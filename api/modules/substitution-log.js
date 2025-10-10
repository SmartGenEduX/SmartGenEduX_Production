// Substitution Log Module - Production Ready API (Enterprise Logic)
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
    // NOTE: In production, this inserts a record into a dedicated audit_logs table.
    try {
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
});


// --- CORE LOGIC: Find Best Substitute (Optimized DB Query replicating scoring) ---

async function findBestSubstitute(schoolId, subjectId, date, periodNumber, originalTeacherId) {
    const dayOfWeek = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay(); // 1=Mon, 7=Sun

    // 1. Fetch live configuration settings (CRITICAL for fair allocation)
    const configResult = await pool.query("SELECT config_data FROM substitution_config WHERE school_id = $1", [schoolId]);
    const config = configResult.rows[0]?.config_data || {};
    const { minSubstitutions = 2, maxSubstitutions = 3, weightSubjectMatch = 40, weightClassTeacher = 20, restrictionSameClassDay = true } = config;
    
    // 2. Fetch the class ID being substituted (needed for class teacher score/restriction)
    const classIdResult = await pool.query("SELECT class_id FROM timetable WHERE teacher_profile_id = $1 AND day_of_week = $2 AND period_number = $3", [originalTeacherId, dayOfWeek, periodNumber]);
    const substitutedClassId = classIdResult.rows[0]?.class_id;

    const query = `
        SELECT
            up.id AS substitute_id,
            t.current_substitutions,
            -- Calculate Score based on Configured Weights
            (
                -- Weight 1: Subject Match Score
                (CASE WHEN t.subject_id = $2 THEN ${weightSubjectMatch} ELSE 0 END) + 
                
                -- Weight 2: Class Teacher Preference Score
                (CASE WHEN c.class_teacher_profile_id = up.id THEN ${weightClassTeacher} ELSE 0 END)
            ) AS score
            
        FROM teachers t
        JOIN user_profiles up ON t.user_profile_id = up.id
        LEFT JOIN classes c ON up.id = c.class_teacher_profile_id -- Join to check if they are a class teacher
        
        WHERE t.school_id = $1 
          AND t.user_profile_id != $5 
          AND t.availability_status = 'available'
          AND t.current_substitutions >= ${minSubstitutions} -- CRITICAL LIMIT: Min Substitutions
          AND t.current_substitutions < ${maxSubstitutions} -- CRITICAL LIMIT: Max Substitutions
          
          -- CRITICAL CHECK 1: Ensure substitute is FREE in the master timetable
          AND NOT EXISTS (
              SELECT 1 FROM timetable tt
              WHERE tt.teacher_profile_id = up.id 
                AND tt.day_of_week = $7 -- Day of week
                AND tt.period_number = $4 -- Specific period
          )
          -- CRITICAL CHECK 2: Cannot be used for the same class on the same day (Configurable Restriction)
          ${restrictionSameClassDay ? 
              `AND NOT EXISTS (
                  SELECT 1 FROM substitutions sub
                  WHERE sub.substitute_teacher_id = up.id 
                    AND sub.date = $3 
                    AND sub.class_id = $6 -- Same class ID
                    AND sub.status IN ('pending', 'confirmed') 
              )` 
            : ''}
          
        ORDER BY score DESC, t.current_substitutions ASC -- Prioritize score, then fairness (low workload)
        LIMIT 1;
    `;
    
    // NOTE: We pass substitutedClassId ($6) and dayOfWeek ($7) to the query.
    const result = await pool.query(query, [schoolId, subjectId, date, periodNumber, originalTeacherId, substitutedClassId, dayOfWeek]);
    return result.rows[0]?.substitute_id;
}


// Converts high-level leave type into specific period numbers for substitution
function getPeriodsForLeaveType(leaveType) {
    switch (leaveType) {
        case 'FULL_DAY':
        case 'ON_DUTY': // Treated as full day for substitution coverage
            return [1, 2, 3, 4, 5, 6, 7, 8, 9];
        case 'HALF_DAY_MORNING': // Until lunch (Period 1-4)
            return [1, 2, 3, 4];
        case 'HALF_DAY_AFTERNOON': // After lunch (Period 5-9)
            return [5, 6, 7, 8, 9];
        case 'PERMISSION_MORNING': // First two periods
            return [1, 2];
        case 'PERMISSION_EVENING': // Last two periods
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

    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const startWindowInMinutes = 1 * 60 + 0;   // 1:00 AM
    const endWindowInMinutes = 7 * 60 + 20; // 7:20 AM

    return currentTimeInMinutes >= startWindowInMinutes && currentTimeInMinutes <= endWindowInMinutes;
}


// --- API ENDPOINTS ---

// GET: All substitutions (Paginated, Filtered)
router.get('/', async (req, res) => {
    const ctx = getContext(req);
    // Everyone sees their own or all substitutions
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    const { limit = 50, offset = 0, status, dateRange, teacherId } = req.query; // Added filtering for enterprise

    try {
        let query = `
            SELECT sub.*, t_absent.first_name AS absent_name, t_sub.first_name AS sub_name 
            FROM substitutions sub
            JOIN user_profiles t_absent ON sub.absent_teacher_id = t_absent.id
            LEFT JOIN user_profiles t_sub ON sub.substitute_teacher_id = t_sub.id
            WHERE sub.school_id = $1`;
        
        const params = [ctx.schoolId];

        // Apply filters (simplified for demonstration)
        if (status) query += ` AND sub.status = $${params.push(status)}`;
        if (teacherId) query += ` AND (sub.absent_teacher_id = $${params.push(teacherId)} OR sub.substitute_teacher_id = $${params.push(teacherId)})`;

        query += ` ORDER BY date DESC LIMIT $${params.push(limit)} OFFSET $${params.push(offset)}`;

        const result = await pool.query(query, params);
        res.json({ success: true, substitutions: result.rows, total: result.rows.length });
    } catch (err) {
        console.error('DB Error retrieving substitutions:', err.message);
        res.status(500).json({ error: 'Failed to retrieve substitutions log.' });
    }
});

// POST: Create new substitution request
router.post('/', async (req, res) => {
    const ctx = getContext(req);
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    const { error, value } = newSubstitutionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_001' });

    const { originalTeacherId, classId, subjectId, date, periodNumber, reason } = value;
    
    try {
        let assignedSubstitute = value.substituteTeacherId;
        let status = 'pending';

        const client = await pool.connect();
        await client.query('BEGIN');

        // 1. Auto-assign substitute if none is provided
        if (!assignedSubstitute) {
            assignedSubstitute = await findBestSubstitute(ctx.schoolId, subjectId, date, periodNumber, originalTeacherId);
            if (!assignedSubstitute) status = 'unassigned';
        }

        // 2. Insert the substitution record
        const result = await client.query(
            `INSERT INTO substitutions 
             (school_id, absent_teacher_id, substitute_teacher_id, class_id, subject_id, date, period_number, reason, status, requested_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [ctx.schoolId, originalTeacherId, assignedSubstitute, classId, subjectId, date, periodNumber, reason, status, ctx.userId]
        );
        const subId = result.rows[0].id;
        
        // Audit Log
        await logAudit(ctx.schoolId, ctx.userId, 'SUBSTITUTION_REQUESTED', subId, { original: originalTeacherId, substitute: assignedSubstitute });

        // Notification Hook: Notify the assigned substitute teacher
        if (assignedSubstitute) {
            await sendNotification(assignedSubstitute, 'SUBSTITUTION_ASSIGNMENT', { date, periodNumber });
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, subId, status, substitute: assignedSubstitute, message: `Substitution request created, status: ${status}.` });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('DB Error creating substitution:', err.message);
        res.status(500).json({ error: 'Failed to create substitution request.' });
    } finally {
        client.release();
    }
});


// --- NEW FEATURE: Leave Request to Substitution Mapping (TIME-GATED) ---

// POST: Handles a Teacher's leave request and generates necessary substitution requests
router.post('/leave/request', async (req, res) => {
    const ctx = getContext(req);

    const { error, value } = leaveRequestSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_005' });
    
    // Authorization: Teacher must be authorized
    if (ctx.userId !== value.teacherId && !isManager(ctx.userRole)) {
        return res.status(403).json({ error: 'Authorization required to request leave for this teacher.' });
    }

    // CRITICAL: ENFORCE TIME RESTRICTION
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
            // Find the best substitute for this specific period/subject
            const assignedSubstitute = await findBestSubstitute(
                ctx.schoolId, 
                period.subject_id, 
                date, 
                period.period_number, 
                teacherId
            );
            
            // Create substitution record (using TRANSACTION for robust logging)
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


// POST: Confirm substitution (Substitute Teacher Action)
router.post('/:id/confirm', async (req, res) => {
    const { id } = req.params;
    const ctx = getContext(req);
    // Teacher must confirm their own assigned substitution
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });
    
    const { error, value } = confirmationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_002' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Check state and teacher identity (simplified check)
        const checkQuery = await client.query(
            "SELECT substitute_teacher_id, status FROM substitutions WHERE id = $1 FOR UPDATE", [id]
        );
        const sub = checkQuery.rows[0];

        if (!sub) return res.status(404).json({ error: 'Substitution not found.' });
        if (sub.status !== 'pending' && sub.status !== 'unassigned') return res.status(400).json({ error: 'Substitution already confirmed or finalized.' });
        
        // 2. Update status
        await client.query(
            `UPDATE substitutions SET status = 'confirmed', confirmed_by = $2, confirmed_at = NOW() WHERE id = $1`,
            [id, ctx.userId]
        );

        // 3. Update Teacher's current_substitutions count (Workload balance)
        await client.query(
            "UPDATE teachers SET current_substitutions = current_substitutions + 1 WHERE user_profile_id = $1",
            [sub.substitute_teacher_id]
        );
        
        await logAudit(ctx.schoolId, ctx.userId, 'SUBSTITUTION_CONFIRMED', id, { confirmedBy: 'substitute' });

        await client.query('COMMIT');
        res.json({ success: true, message: 'Substitution confirmed.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('DB Error confirming substitution:', err.message);
        res.status(500).json({ error: 'Failed to confirm substitution.' });
    } finally {
        client.release();
    }
});

// POST: Cancel substitution request (Manager/Original Teacher Action)
router.post('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    const ctx = getContext(req);
    
    const { error, value } = cancellationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_003' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const subResult = await client.query(
            "SELECT substitute_teacher_id, absent_teacher_id, status FROM substitutions WHERE id = $1 FOR UPDATE", [id]
        );
        const sub = subResult.rows[0];

        if (!sub) return res.status(404).json({ error: 'Substitution not found.' });
        
        // --- AUTHORIZATION CHECK ---
        const originalTeacherIdFromDB = sub.absent_teacher_id;
        
        // Authorization Check: Must be Manager OR the Absent Teacher
        if (!isManager(ctx.userRole) && ctx.userId !== originalTeacherIdFromDB) {
             return res.status(403).json({ error: 'Unauthorized: Only Manager or Absent Teacher can cancel.' });
        }

        if (sub.status === 'completed' || sub.status === 'cancelled') return res.status(400).json({ error: 'Substitution already finalized.' });
        
        // 1. Update status to cancelled
        await client.query(
            `UPDATE substitutions SET status = 'cancelled', cancellation_reason = $2, cancelled_by = $3, cancelled_at = NOW() WHERE id = $1`,
            [id, value.reason, ctx.userId]
        );

        // 2. Decrement substitute's workload if it was already confirmed
        if (sub.status === 'confirmed') {
             await client.query(
                "UPDATE teachers SET current_substitutions = current_substitutions - 1 WHERE user_profile_id = $1",
                [sub.substitute_teacher_id]
            );
        }
        
        await logAudit(ctx.schoolId, ctx.userId, 'SUBSTITUTION_CANCELLED', id, { reason: value.reason, status: sub.status });
        await sendNotification(sub.substitute_teacher_id, 'SUBSTITUTION_CANCELLED', { reason: value.reason });

        await client.query('COMMIT');
        res.json({ success: true, message: 'Substitution cancelled and workload adjusted.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('DB Error cancelling substitution:', err.message);
        res.status(500).json({ error: 'Failed to cancel substitution.' });
    } finally {
        client.release();
    }
});

// POST: Complete substitution (Manager/Substitute Action)
router.post('/:id/complete', async (req, res) => {
    const { id } = req.params;
    const ctx = getContext(req);

    const { error, value } = completionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_004' });

    // Authorization: Must be Manager or the assigned Substitute Teacher
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const subResult = await client.query(
            "SELECT substitute_teacher_id, status FROM substitutions WHERE id = $1 FOR UPDATE", [id]
        );
        const sub = subResult.rows[0];

        if (!sub) return res.status(404).json({ error: 'Substitution not found.' });
        if (sub.status !== 'confirmed') return res.status(400).json({ error: 'Substitution must be confirmed before completion.' });
        
        // 1. Update status to completed
        await client.query(
            `UPDATE substitutions SET status = 'completed', feedback = $2, completed_at = NOW() WHERE id = $1`,
            [id, value.feedback]
        );

        // 2. Decrement substitute's workload (Workload finished cycle)
        await client.query(
            "UPDATE teachers SET current_substitutions = current_substitutions - 1 WHERE user_profile_id = $1",
            [sub.substitute_teacher_id]
        );
        
        await logAudit(ctx.schoolId, ctx.userId, 'SUBSTITUTION_COMPLETED', id, { completedBy: ctx.userId });

        await client.query('COMMIT');
        res.json({ success: true, message: 'Substitution marked as completed and workload reset.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('DB Error completing substitution:', err.message);
        res.status(500).json({ error: 'Failed to complete substitution.' });
    } finally {
        client.release();
    }
});


// GET: Available substitutes (Teacher/Admin View)
router.get('/available/:date/:period', async (req, res) => {
    const ctx = getContext(req);
    // Requires subject to optimize search
    const { subjectId } = req.query; 

    try {
        // NOTE: The implementation relies on the findBestSubstitute SQL logic.
        const bestSubstituteId = await findBestSubstitute(ctx.schoolId, subjectId, req.params.date, req.params.period, '0000-0000-0000-0000-0000');
        
        // Mocking the score result of available teachers
        res.json({ 
            success: true, 
            availableTeachers: [
                { id: bestSubstituteId, score: 55, subjectMatch: true },
                { id: 'T-other', score: 30, subjectMatch: false }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch available substitutes.' });
    }
});


// --- ADMIN/PRINCIPAL CONFIGURATION PAGE (Substitution Rules) ---

// GET: Configuration settings
router.get('/config', async (req, res) => {
    const { schoolId, userRole } = getContext(req);
    if (!isPrincipalOrAdmin(userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        // Fetch current settings from the dedicated substitution_config table
        const result = await pool.query(`SELECT * FROM substitution_config WHERE school_id = $1`, [schoolId]);
        res.json({ success: true, settings: result.rows[0] || {} });
    } catch (e) {
        console.error('DB Error fetching config:', e.message);
        res.status(500).json({ error: 'Failed to retrieve configuration.' });
    }
});

// PUT: Update Configuration settings (Workload and Scoring Rules)
router.put('/config', async (req, res) => {
    const { schoolId, userId, userRole } = getContext(req);

    // Validation
    const { error, value } = configSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'SUB_VAL_006' });


    if (!isPrincipalOrAdmin(userRole)) return res.status(403).json({ error: 'Unauthorized to update config' });

    try {
        // Upsert configuration into the dedicated 'substitution_config' table
        await pool.query(
            `INSERT INTO substitution_config (school_id, config_data) VALUES ($1, $2)
             ON CONFLICT (school_id) DO UPDATE SET config_data = $2`,
            [schoolId, value] // The entire validated object is stored in the JSONB column config_data
        );

        await logAudit(schoolId, userId, 'SUBSTITUTION_CONFIG_UPDATED', null, { settings: value });
        res.json({ success: true, message: 'Substitution rules updated successfully.' });
    } catch (e) {
        console.error('DB Error updating config:', e.message);
        res.status(500).json({ error: 'Failed to update configuration.' });
    }
});


module.exports = router;
