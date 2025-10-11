// System Settings Manager Module - Production Ready API
const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi'); // For validation
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- R.B.A.C. & CONTEXT HELPERS ---

const getContext = (req) => ({
    // In production, these must be extracted from the verified JWT in req.user
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
    userId: req.user?.id || '11111111-1111-1111-1111-111111111111',
    role: req.user?.role || 'school_admin',
});

// Permission: Only high-level administration roles can manage general system settings.
const isAuthorizedToManageSettings = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

// Permission: Only Super Admin can manage module enablement across tenants.
const isSuperAdmin = (role) => role === 'super_admin';

// Audit logging (Placeholder)
async function logAudit(schoolId, userId, action, entityId, details) {
    // NOTE: In production, this inserts a record into a dedicated audit_logs table.
    try {
        await pool.query(
            `INSERT INTO audit_logs (school_id, user_id, action, entity_id, details, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`,
            [schoolId, userId, action, entityId, JSON.stringify(details)]
        );
    } catch (e) {
        console.error('Audit logging failed:', e.message);
    }
}

// Validation schemas

const singleSettingSchema = Joi.object({
    settingKey: Joi.string().required(),
    settingValue: Joi.alternatives().try(
        Joi.string().allow(''), // String or empty
        Joi.number(),           // Number
        Joi.boolean(),          // Boolean
        Joi.object()            // JSON/Complex Object
    ).required(),
}).options({ allowUnknown: true });

const batchUpdateSchema = Joi.array().items(singleSettingSchema).min(1).required();

const retrievalQuerySchema = Joi.object({
    search: Joi.string().optional().allow(''),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
}).options({ allowUnknown: true });


// --- API ENDPOINTS ---

// GET: Fetch all settings for a specific school (Batch Retrieval & Pagination)
router.get('/:schoolId', async (req, res) => {
    const { error: queryError, value: queryValue } = retrievalQuerySchema.validate(req.query);
    if (queryError) return res.status(400).json({ success: false, error: `Validation Failed: ${queryError.details[0].message}` });
    
    const { role, schoolId: userSchoolId } = getContext(req);
    const targetSchoolId = req.params.schoolId;

    if (!isAuthorizedToManageSettings(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions.' });
    }
    
    // Authorization Check: Must be Super Admin OR managing their own school
    if (role !== 'super_admin' && targetSchoolId !== userSchoolId) {
        return res.status(403).json({ success: false, error: 'Forbidden: Cannot view settings for another school.' });
    }

    try {
        const { limit, offset, search } = queryValue;
        
        let whereClauses = [`school_id = $1`];
        const params = [targetSchoolId];

        if (search) {
             whereClauses.push(`setting_key ILIKE $${params.push(`%${search}%`)}`);
        }

        const whereString = whereClauses.join(' AND ');

        // 1. Fetch total count (for pagination metadata)
        const countQuery = `SELECT COUNT(id) FROM system_settings WHERE ${whereString}`;
        const countResult = await pool.query(countQuery, params);
        const totalCount = parseInt(countResult.rows[0].count);
        
        // 2. Fetch paginated data
        const dataQuery = `
            SELECT setting_key, setting_value FROM system_settings 
            WHERE ${whereString}
            ORDER BY setting_key ASC
            LIMIT $${params.push(limit)} OFFSET $${params.push(offset)};
        `;
        const result = await pool.query(dataQuery, params);
        
        // Format response as a flat object (key-value pairs)
        const formattedSettings = result.rows.reduce((acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
        }, {});

        res.json({ 
            success: true, 
            settings: formattedSettings,
            pagination: {
                totalRecords: totalCount,
                limit,
                offset
            }
        });
    } catch (err) {
        console.error("DB Error fetching system settings:", err.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve system settings.' });
    }
});

// POST: Batch Upsert (Create or Update) multiple settings
router.post('/:schoolId', async (req, res) => {
    const { role, schoolId: userSchoolId, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;
    
    if (!isAuthorizedToManageSettings(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions to modify settings.' });
    }
    if (role !== 'super_admin' && targetSchoolId !== userSchoolId) {
        return res.status(403).json({ success: false, error: 'Forbidden: Cannot modify settings for another school.' });
    }

    // Input Validation (Batch)
    const { error, value: settingsArray } = batchUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: `Batch Validation Failed: ${error.details[0].message}` });
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let updatedCount = 0;
        
        for (const { settingKey, settingValue } of settingsArray) {
            // Note: We convert complex JS objects to JSON strings for robust storage in TEXT/JSONB columns.
            const valueToStore = (typeof settingValue === 'object' && settingValue !== null) 
                                 ? JSON.stringify(settingValue) 
                                 : String(settingValue);

            const result = await client.query(
                `INSERT INTO system_settings (school_id, setting_key, setting_value, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (school_id, setting_key) DO UPDATE
                 SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
                 RETURNING setting_key`,
                [targetSchoolId, settingKey, valueToStore]
            );
            
            if (result.rowCount > 0) {
                updatedCount++;
                // Log audit for each individual change
                await logAudit(targetSchoolId, userId, 'SYSTEM_SETTING_UPDATED', settingKey, { newValue: valueToStore });
            }
        }

        await client.query('COMMIT');
        
        res.json({ success: true, updatedCount: updatedCount, message: `${updatedCount} settings updated successfully.` });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error updating system settings (Batch):", err.message);
        res.status(500).json({ success: false, error: 'Failed to update system settings due to database error.' });
    } finally {
        client.release();
    }
});

// --- CRITICAL MODULE ACCESS MANAGEMENT (Super Admin Only) ---

// GET: List all modules and their status for a specific school
router.get('/:schoolId/modules', async (req, res) => {
    const { role } = getContext(req);
    const targetSchoolId = req.params.schoolId;

    if (!isSuperAdmin(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Only Super Admin can view global module status.' });
    }

    try {
        // Fetch all module statuses for the target school
        const result = await pool.query(
            "SELECT module_name, is_enabled, updated_at FROM school_modules WHERE school_id = $1", 
            [targetSchoolId]
        );
        res.json({ success: true, modules: result.rows });
    } catch (err) {
        console.error("DB Error fetching modules:", err.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve module status.' });
    }
});

// PUT: Toggle Module Status (Super Admin Only)
router.put('/:schoolId/modules/:moduleName', async (req, res) => {
    const { role, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;
    const moduleName = req.params.moduleName;
    const { isEnabled } = req.body;

    if (!isSuperAdmin(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Only Super Admin can toggle module status.' });
    }
    if (typeof isEnabled !== 'boolean') {
        return res.status(400).json({ success: false, error: 'Input Validation Failed: isEnabled must be a boolean.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO school_modules (school_id, module_name, is_enabled, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (school_id, module_name) DO UPDATE
             SET is_enabled = $3, updated_at = NOW()
             RETURNING module_name, is_enabled`,
            [targetSchoolId, moduleName, isEnabled]
        );

        await logAudit(targetSchoolId, userId, 'MODULE_TOGGLED', moduleName, { newState: isEnabled });

        res.json({ success: true, updatedModule: result.rows[0] });
    } catch (err) {
        console.error("DB Error updating module status:", err.message);
        res.status(500).json({ success: false, error: 'Failed to update module status.' });
    }
});


module.exports = router;
