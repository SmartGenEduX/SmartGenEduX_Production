const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- R.B.A.C. & CONTEXT HELPERS ---

const getContext = (req) => ({
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
    userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',
    userRole: req.user?.role || 'school_admin'
});

// Permissions
const isTeacher = (role) => 
    ['super_admin', 'school_admin', 'principal', 'teacher'].includes(role);

const isManager = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

const isPrincipalOrAdmin = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

// Hook for Arattai/WhatsApp Notifications
async function sendNotification(recipientId, type, details) {
    console.log(`[Notification Queue] Sending ${type} alert to ${recipientId} for Substitution.`, details);
    return true; 
}

// Hook for Persistent Audit Logging
async function logAudit(schoolId, userId, action, entityId, details) {
    console.log(`[Sub Log Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`, details);
    try {
        // NOTE: In production, this inserts a record into a dedicated audit_logs table.
        // Example DB insert (simplified):
        await pool.query(
            `INSERT INTO audit_logs (school_id, user_id, action, entity_id, details) VALUES ($1,$2,$3,$4,$5)`,
            [schoolId, userId, action, entityId, JSON.stringify(details)]
        );
    } catch (e) {
        console.error('Audit logging failed:', e.message);
    }
}

// --- VALIDATION SCHEMAS ---

const newSubstitutionSchema = Joi.object({
    originalTeacherId: Joi.string().required(),
    classId: Joi.string().required(),
    subjectId: Joi.string().required(),
    date: Joi.date().iso().required(),
    periodNumber: Joi.number().integer().min(1).required(),
    reason: Joi.string().max(500).required(),
    substituteTeacherId: Joi.string().optional().allow(null, ''),
});

const confirmationSchema = Joi.object({
    confirmedBy: Joi.string().required(),
    notes: Joi.string().optional().allow(null, '')
});

const cancellationSchema = Joi.object({
    reason: Joi.string().required().max(500),
});

const completionSchema = Joi.object({
    feedback: Joi.string().max(1000).optional().allow(null, ''),
    lessonsCompleted: Joi.boolean().required(),
    studentsBehavior: Joi.string().optional(),
    attendanceMarked: Joi.boolean().required()
});

const leaveRequestSchema = Joi.object({
    teacherId: Joi.string().required(),
    date: Joi.date().iso().required(),
    leaveType: Joi.string().valid('FULL_DAY', 'ON_DUTY', 'HALF_DAY_MORNING', 'HALF_DAY_AFTERNOON', 'PERMISSION_MORNING', 'PERMISSION_EVENING').required(),
    reason: Joi.string().max(500).required(),
});

const configSchema = Joi.object({
    minSubstitutions: Joi.number().integer().min(0).max(10).required(),
    maxSubstitutions: Joi.number().integer().min(1).max(15).required(),
    weightSubjectMatch: Joi.number().integer().min(0).required(),
    weightClassTeacher: Joi.number().integer().min(0).required(),
    restrictionSameClassDay: Joi.boolean().required(),
    // Added for App Script parity
    maxDailyPeriodsExclusion: Joi.number().integer().min(5).max(10).required(), 
    permanentExclusionList: Joi.array().items(Joi.string()).optional() 
});


// Converts high-level leave type into specific period numbers for substitution
function getPeriodsForLeaveType(leaveType) {
    switch (leaveType) {
        case 'FULL_DAY':
        case 'ON_DUTY': 
            return [1, 2, 3, 4, 5, 6, 7, 8, 9];
        case 'HALF_DAY_MORNING':
            return [1, 2, 3, 4];
        case 'HALF_DAY_AFTERNOON':
            return [5, 6, 7, 8, 9];
        case 'PERMISSION_MORNING':
            return [1, 2];
        case 'PERMISSION_EVENING':
            return [8, 9];
        default:
            return [];
    }
}

// Helper to check if submission time is valid for same-day leave
function isSubmissionWindowOpen(requestedDate) {
    const now = new Date();
    const todayISO = now.toISOString().split('T')[0];
    const requestedISO = new Date(requestedDate).toISOString().split('T')[0];

    if (requestedISO !== todayISO) return false;

    // App Script window: 1:00 AM to 7:20 AM
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const startWindowInMinutes = 1 * 60 + 0;    // 60 minutes
    const endWindowInMinutes = 7 * 60 + 20; // 440 minutes

    return currentTimeInMinutes >= startWindowInMinutes && currentTimeInMinutes <= endWindowInMinutes;
}


// --- CORE LOGIC: Find Best Substitute (Enhanced to replicate App Script scoring) ---

async function findBestSubstitute(schoolId, subjectId, date, periodNumber, originalTeacherId) {
    const dayOfWeek = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay(); // 1=Mon, 7=Sun

    const client = await pool.connect();
    try {
        // 1. Fetch live configuration settings (CRITICAL for fair allocation)
        const configResult = await client.query("SELECT config_data FROM substitution_config WHERE school_id = $1", [schoolId]);
        const cfg = configResult.rows[0]?.config_data || {};
        const { 
            minSubstitutions = 0, 
            maxSubstitutions = 3, 
            weightSubjectMatch = 40, 
            weightClassTeacher = 20, 
            restrictionSameClassDay = true,
            maxDailyPeriodsExclusion = 6, // 7 periods in App Script = >= 7, so we set threshold to 6
            permanentExclusionList = []
        } = cfg;
        
        // 2. Fetch the class ID being substituted
        const classIdResult = await client.query("SELECT class_id FROM timetable WHERE teacher_profile_id = $1 AND day_of_week = $2 AND period_number = $3", [originalTeacherId, dayOfWeek, periodNumber]);
        const substitutedClassId = classIdResult.rows[0]?.class_id;

        // 3. Core SQL Query with App Script Logic Integration
        const query = `
            SELECT
                up.id AS substitute_id,
                t.current_substitutions,
                COALESCE(twm.periods_today, 0) AS daily_periods, -- Get today's workload
                
                -- Calculate Score based on Configured Weights (App Script Score Replication)
                (
                    -- Weight 1: Subject Match Score
                    (CASE WHEN t.subject_id = $2 THEN ${weightSubjectMatch} ELSE 0 END) + 
                    
                    -- Weight 2: Class Teacher Preference Score
                    (CASE WHEN c.class_teacher_profile_id = up.id THEN ${weightClassTeacher} ELSE 0 END) +
                    
                    -- Weight 3: Fairness/Low Workload Bonus (App Script's (7 - dailyPeriods) * 5)
                    (CASE WHEN COALESCE(twm.periods_today, 0) < 7 THEN (7 - COALESCE(twm.periods_today, 0)) * 5 ELSE 0 END) -
                    
                    -- Penalty: Existing Substitution Workload (App Script's currentSubs * 15)
                    (t.current_substitutions * 15)
                ) AS score
            
            FROM teachers t
            JOIN user_profiles up ON t.user_profile_id = up.id
            LEFT JOIN classes c ON up.id = c.class_teacher_profile_id
            LEFT JOIN teacher_workload_metrics twm ON up.id = twm.teacher_profile_id AND twm.date = $3 -- Assume this table tracks daily load
            
            WHERE t.school_id = $1 
              AND t.user_profile_id != $5 
              AND t.availability_status = 'available'
              
              -- Max/Min Workload Limits
              AND t.current_substitutions >= ${minSubstitutions}
              AND t.current_substitutions < ${maxSubstitutions}
              
              -- Overloaded Teacher Exclusion (App Script: > 7 periods)
              AND COALESCE(twm.periods_today, 0) < ${maxDailyPeriodsExclusion + 1}
              
              -- Permanent Exclusion List
              ${permanentExclusionList.length > 0 ? 
                  `AND up.id NOT IN ('${permanentExclusionList.join("','")}')` 
                : ''}
              
              -- CRITICAL CHECK: Must be FREE in the master timetable
              AND NOT EXISTS (
                  SELECT 1 FROM timetable tt
                  WHERE tt.teacher_profile_id = up.id 
                    AND tt.day_of_week = $7
                    AND tt.period_number = $4
              )
          
        ORDER BY score DESC, t.current_substitutions ASC
        LIMIT 1;
    `;
    
        // NOTE: We pass substitutedClassId ($6) and dayOfWeek ($7) to the query.
        // $3 is date, $2 is subjectId, $5 is originalTeacherId, $4 is periodNumber
        const result = await client.query(query, [schoolId, subjectId, date, periodNumber, originalTeacherId, substitutedClassId, dayOfWeek]);
        
        return result.rows[0]?.substitute_id;
    } finally {
        client.release();
    }
}


// --- CORE API ENDPOINTS ---

// [Omitted GET / and POST / endpoints for brevity, assumed unchanged]

// POST: Handles a Teacher's leave request and generates necessary substitution requests
router.post('/leave/request', async (req, res) => {
    const ctx = getContext(req);

    const { error, value } = leaveRequestSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_005' });
    
    // Authorization: Teacher must be authorized
    if (ctx.userId !== value.teacherId && !isManager(ctx.userRole)) {
        return res.status(403).json({ error: 'Authorization required to request leave for this teacher.' });
    }

    // CRITICAL: ENFORCE TIME RESTRICTION (App Script Parity)
    if (!isSubmissionWindowOpen(value.date) && !isManager(ctx.userRole)) {
        return res.status(403).json({ 
            error: 'Submission window closed.', 
            message: 'Leave requests must be submitted on the day of absence between 1:00 AM and 7:20 AM. Contact administration for overrides.' 
        });
    }

    const { teacherId, date, leaveType, reason } = value;
    const periodsToCover = getPeriodsForLeaveType(leaveType);
    let successfullyCreated = 0;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Fetch Teacher's Timetable for the specific day/date
        const dayOfWeek = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay();
        const timetableQuery = `
            SELECT class_id, subject_id, period_number, start_time, end_time 
            FROM timetable 
            WHERE teacher_profile_id = $1 AND day_of_week = $2 AND period_number = ANY($3::int[]);
        `;
        const { rows: periodsNeedingSub } = await client.query(timetableQuery, [teacherId, dayOfWeek, periodsToCover]);

        // 2. Loop through required periods and create individual substitution requests
        for (const period of periodsNeedingSub) {
            // Find the best substitute for this specific period/subject using the enhanced logic
            const assignedSubstitute = await findBestSubstitute(
                ctx.schoolId, 
                period.subject_id, 
                date, 
                period.period_number, 
                teacherId
            );
            
            // Create substitution record
            const result = await client.query(
                `INSERT INTO substitutions 
                 (school_id, absent_teacher_id, substitute_teacher_id, class_id, subject_id, date, period_number, reason, status, requested_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
                [ctx.schoolId, teacherId, assignedSubstitute, period.class_id, period.subject_id, date, period.period_number, reason, assignedSubstitute ? 'pending' : 'unassigned', ctx.userId]
            );
            
            await logAudit(ctx.schoolId, ctx.userId, 'LEAVE_SUB_GENERATED', result.rows[0].id, { period: period.period_number, type: leaveType });
            
            if (assignedSubstitute) {
                await sendNotification(assignedSubstitute, 'SUBSTITUTION_ASSIGNMENT_URGENT', { date, periodNumber: period.period_number });
                successfullyCreated++;
            }
        }

        await client.query('COMMIT');
        
    } catch (subError) {
        await client.query('ROLLBACK');
        console.error('DB Error creating substitution:', subError.message);
        res.status(500).json({ success: false, message: 'Failed to process leave request and create substitutions.' });
    } finally {
        client.release();
    }


    // 3. Final response
    if (successfullyCreated > 0) {
        res.json({ success: true, message: `${successfullyCreated} substitution requests generated for ${leaveType} leave.` });
    } else {
        res.status(404).json({ success: false, message: 'Leave processed, but no available substitutes found for required periods.' });
    }
});


// [Omitted remaining Confirmation/Cancellation/Completion/Config Endpoints for brevity, assumed unchanged]


module.exports = router;
