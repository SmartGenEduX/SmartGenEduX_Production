const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi'); // For validation
const router = express.Router();

// --- ENTERPRISE UTILITIES & MOCKS ---

/**
 * 1. Rate Limiting Middleware (Simulated using express-rate-limit structure)
 */
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again after 15 minutes."
});
router.use(apiLimiter); // Apply rate limiting globally

/**
 * 2. Input Sanitization Helper: Ensures key names are safe (alphanumeric/underscores)
 * @param {string} key - The setting key input.
 * @returns {string} Sanitized key.
 */
function sanitizeSettingKey(key) {
    // Allows letters, numbers, and underscores only.
    return key.replace(/[^a-zA-Z0-9_]/g, '');
}

/** 3. PostgreSQL connection pool setup */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/** 4. In-Memory Caching (Map key = schoolId) */
const settingsCache = new Map();
const modulesCache = new Map();


// --- R.B.A.C. & CONTEXT HELPERS ---

const getContext = (req) => ({
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
    userId: req.user?.id || '11111111-1111-1111-1111-111111111111',
    role: req.user?.role || 'school_admin',
});

const isAuthorizedToManageSettings = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

const isSuperAdmin = (role) => role === 'super_admin';

// Audit logging (Enhanced: includes context in console error on failure)
async function logAudit(schoolId, userId, action, entityId, details) {
    try {
        await pool.query(
            `INSERT INTO audit_logs (school_id, user_id, action, entity_id, details, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`,
            [schoolId, userId, action, entityId, JSON.stringify(details)]
        );
    } catch (e) {
        console.error(`[CRITICAL AUDIT FAILURE] User: ${userId}, School: ${schoolId}, Action: ${action}. DB Error: ${e.message}`);
    }
}


// --- VALIDATION SCHEMAS ---

const singleSettingSchema = Joi.object({
    settingKey: Joi.string().required(),
    settingValue: Joi.alternatives().try(
        Joi.string().allow(''),
        Joi.number(),
        Joi.boolean(),
        Joi.object()
    ).required(),
}).options({ allowUnknown: true });

const batchUpdateSchema = Joi.array().items(singleSettingSchema).min(1).required();

const retrievalQuerySchema = Joi.object({
    search: Joi.string().optional().allow(''),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
}).options({ allowUnknown: true });

const moduleNameValidator = Joi.string().pattern(/^[a-zA-Z0-9_ -]+$/).required().messages({
    'string.pattern.base': 'Module name contains invalid characters. Use letters, numbers, spaces, hyphens, or underscores only.'
});


// --- API ENDPOINTS ---

/**
 * GET /:schoolId
 * Fetches all system settings for a school with pagination and optional search filtering.
 * Uses caching for performance optimization.
 * * @param {string} schoolId - The ID of the target school (path parameter).
 * @param {number} limit - Number of records to return.
 * @param {number} offset - Number of records to skip.
 * @returns {object} { settings: {key: value}, pagination: {totalRecords, totalPages} }
 */
router.get('/:schoolId', async (req, res) => {
    const { error: queryError, value: queryValue } = retrievalQuerySchema.validate(req.query);
    if (queryError) return res.status(400).json({ success: false, error: `Validation Failed: ${queryError.details[0].message}` });
    
    const { role, schoolId: userSchoolId, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;

    if (!isAuthorizedToManageSettings(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions.' });
    }
    
    if (role !== 'super_admin' && targetSchoolId !== userSchoolId) {
        return res.status(403).json({ success: false, error: 'Forbidden: Cannot view settings for another school.' });
    }

    try {
        const { limit, offset, search } = queryValue;
        
        // Caching Check (Optimization)
        let settingsList = settingsCache.get(targetSchoolId);

        if (!settingsList) {
             const result = await pool.query("SELECT setting_key, setting_value FROM system_settings WHERE school_id = $1 ORDER BY setting_key ASC", [targetSchoolId]);
             settingsList = result.rows;
             settingsCache.set(targetSchoolId, settingsList);
        }

        // Apply search filter and pagination client-side (on cached data)
        let filteredSettings = settingsList;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredSettings = settingsList.filter(s => 
                s.setting_key.toLowerCase().includes(searchLower)
            );
        }
        
        const totalCount = filteredSettings.length;
        const totalPages = Math.ceil(totalCount / limit);

        const paginatedSettings = filteredSettings.slice(offset, offset + limit);
        
        // Format response as a flat object (key-value pairs)
        const formattedSettings = paginatedSettings.reduce((acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
        }, {});

        res.json({ 
            success: true, 
            settings: formattedSettings,
            pagination: {
                totalRecords: totalCount,
                totalPages: totalPages, 
                limit,
                offset
            },
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error(`[API ERROR] GET /settings/${targetSchoolId} (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to retrieve system settings due to server error.' });
    }
});

/**
 * GET /:schoolId/:settingKey
 * Fetches a single specific setting key/value for a school.
 * * @param {string} schoolId - The ID of the target school.
 * @param {string} settingKey - The specific setting key to retrieve.
 * @returns {object} { settingKey, settingValue }
 */
router.get('/:schoolId/:settingKey', async (req, res) => {
    const { role, schoolId: userSchoolId, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;
    const settingKey = sanitizeSettingKey(req.params.settingKey);

    if (!isAuthorizedToManageSettings(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions.' });
    }
    
    if (role !== 'super_admin' && targetSchoolId !== userSchoolId) {
        return res.status(403).json({ success: false, error: 'Forbidden: Cannot view settings for another school.' });
    }
    
    try {
        // Check cache first for faster response
        const settingsList = settingsCache.get(targetSchoolId);
        let settingValue = null;

        if (settingsList) {
            const setting = settingsList.find(s => s.setting_key === settingKey);
            if (setting) settingValue = setting.setting_value;
        }

        if (settingValue === null) {
            // Fallback to database if not in cache or if cache was never primed
            const result = await pool.query("SELECT setting_value FROM system_settings WHERE school_id = $1 AND setting_key = $2", [targetSchoolId, settingKey]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Setting key not found.' });
            }
            settingValue = result.rows[0].setting_value;
        }
        
        res.json({ 
            success: true, 
            settingKey: settingKey,
            settingValue: settingValue,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error(`[API ERROR] GET single setting (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to retrieve setting due to server error.' });
    }
});

/**
 * PUT /:schoolId/:settingKey
 * Updates a single setting key/value.
 * * @param {string} schoolId - The ID of the target school.
 * @param {string} settingKey - The setting key to update.
 * @param {any} settingValue - The new value (can be string, number, boolean, or object).
 * @returns {object} { message, timestamp }
 */
router.put('/:schoolId/:settingKey', async (req, res) => {
    const { role, schoolId: userSchoolId, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;
    const settingKey = sanitizeSettingKey(req.params.settingKey);
    const { settingValue } = req.body; // Use req.body to get the value

    // Validate the value format using the single setting schema structure
    const { error } = singleSettingSchema.validate({ settingKey, settingValue });
    if (error) return res.status(400).json({ success: false, error: `Validation Failed: ${error.details[0].message}` });
    
    if (!isAuthorizedToManageSettings(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Insufficient permissions to modify settings.' });
    }
    if (role !== 'super_admin' && targetSchoolId !== userSchoolId) {
        return res.status(403).json({ success: false, error: 'Forbidden: Cannot modify settings for another school.' });
    }
    
    // Data Preparation
    const valueToStore = (typeof settingValue === 'object' && settingValue !== null) 
                         ? JSON.stringify(settingValue) 
                         : String(settingValue);

    try {
        const result = await pool.query(
            `INSERT INTO system_settings (school_id, setting_key, setting_value, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (school_id, setting_key) DO UPDATE
             SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
             RETURNING setting_key`,
            [targetSchoolId, settingKey, valueToStore]
        );

        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, error: 'Failed to update setting (no rows affected).' });
        }

        // CRITICAL: Clear cache upon successful write operation
        settingsCache.delete(targetSchoolId);

        await logAudit(targetSchoolId, userId, 'SYSTEM_SETTING_UPDATED', settingKey, { newValue: valueToStore.substring(0, 50) + '...' });
        
        res.json({ 
            success: true, 
            message: `Setting '${settingKey}' updated successfully.`, 
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error(`[API ERROR] PUT single setting (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to update setting due to database error: ' + err.message });
    }
});


/**
 * POST /:schoolId
 * Batch Upsert: Creates or updates multiple settings in a single transaction.
 * * NOTE: The use of a transaction here achieves atomicity, which is crucial for batch updates.
 * For high concurrency, database-level optimistic locking or version fields should be used on the 'system_settings' table.
 * * @param {string} schoolId - The ID of the target school.
 * @param {array} req.body - Array of { settingKey: string, settingValue: any } objects.
 * @returns {object} { updatedCount, message, timestamp }
 */
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
            // INPUT SANITIZATION
            const sanitizedKey = sanitizeSettingKey(settingKey);
            if (sanitizedKey !== settingKey) {
                 throw new Error(`Setting key "${settingKey}" contains illegal characters.`);
            }

            // Data Preparation
            const valueToStore = (typeof settingValue === 'object' && settingValue !== null) 
                                 ? JSON.stringify(settingValue) 
                                 : String(settingValue);

            const result = await client.query(
                `INSERT INTO system_settings (school_id, setting_key, setting_value, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (school_id, setting_key) DO UPDATE
                 SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
                 RETURNING setting_key`,
                [targetSchoolId, sanitizedKey, valueToStore]
            );
            
            if (result.rowCount > 0) {
                updatedCount++;
                await logAudit(targetSchoolId, userId, 'SYSTEM_SETTING_UPDATED', sanitizedKey, { newValue: valueToStore.substring(0, 50) + '...' });
            }
        }

        // CRITICAL: Clear cache upon successful write operation
        settingsCache.delete(targetSchoolId);

        await client.query('COMMIT');
        
        res.json({ success: true, updatedCount: updatedCount, message: `${updatedCount} settings updated successfully.`, timestamp: new Date().toISOString() });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[API ERROR] POST /settings/${targetSchoolId} (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to update system settings due to database error: ' + err.message });
    } finally {
        client.release();
    }
});

// --- CRITICAL MODULE ACCESS MANAGEMENT (Super Admin Only) ---

/**
 * GET /:schoolId/modules
 * Lists all module enablement statuses for a school.
 * * @param {string} schoolId - The ID of the target school.
 * @returns {object} { modules: [{module_name, is_enabled, updated_at}], timestamp }
 */
router.get('/:schoolId/modules', async (req, res) => {
    const { role, userId } = getContext(req);
    const targetSchoolId = req.params.schoolId;

    if (!isSuperAdmin(role)) {
        return res.status(403).json({ success: false, error: 'Forbidden: Only Super Admin can view global module status.' });
    }

    try {
        // Caching Check (Optimization)
        let modulesList = modulesCache.get(targetSchoolId);

        if (!modulesList) {
            const result = await pool.query(
                "SELECT module_name, is_enabled, updated_at FROM school_modules WHERE school_id = $1", 
                [targetSchoolId]
            );
            modulesList = result.rows;
            modulesCache.set(targetSchoolId, modulesList);
        }

        res.json({ success: true, modules: modulesList, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(`[API ERROR] GET /modules/${targetSchoolId} (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to retrieve module status.' });
    }
});

/**
 * PUT /:schoolId/modules/:moduleName
 * Toggles the enablement status of a specific module.
 * * @param {string} schoolId - The ID of the target school.
 * @param {string} moduleName - The name of the module to toggle.
 * @param {boolean} isEnabled - The new state of the module.
 * @returns {object} { updatedModule, timestamp }
 */
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

    // VALIDATION FOR MODULE NAME
    const { error: moduleError } = moduleNameValidator.validate(moduleName);
    if (moduleError) {
        return res.status(400).json({ success: false, error: moduleError.details[0].message });
    }

    try {
        const result = await pool.query(
            `INSERT INTO school_modules (school_id, module_name, is_enabled, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (school_id, module_name) DO UPDATE
             SET is_enabled = $3, updated_at = NOW()
             RETURNING module_name, is_enabled, updated_at`,
            [targetSchoolId, moduleName, isEnabled]
        );
        
        // CRITICAL: Clear module cache upon successful write operation
        modulesCache.delete(targetSchoolId);

        await logAudit(targetSchoolId, userId, 'MODULE_TOGGLED', moduleName, { newState: isEnabled });

        res.json({ success: true, updatedModule: result.rows[0], timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(`[API ERROR] PUT /modules/${targetSchoolId}/${moduleName} (User: ${userId}). Error: ${err.message}`);
        res.status(500).json({ success: false, error: 'Failed to update module status.' });
    }
});


module.exports = router;
