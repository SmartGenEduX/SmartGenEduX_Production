const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const router = express.Router();
// NOTE: In a full project, Joi or Yup validation library would be imported here.

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Placeholder functions (assuming they are fully implemented elsewhere)
const upload = multer({ dest: 'uploads/id-photos' });
const getRequestContext = (req) => ({
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
    userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',
    userRole: req.user?.role || 'school_admin'
});

const isApprover = (role) => role === 'super_admin' || role === 'principal';
const isManager = (role) => role === 'super_admin' || role === 'school_admin';
const isPrincipalOrAdmin = (role) => role === 'super_admin' || role === 'school_admin' || role === 'principal';

// Hook for Arattai/WhatsApp Notifications (to notify Principal)
async function sendNotification(recipientPhone, templateId, details) {
    console.log(`[Notification Queue] Sending ${templateId} alert to ${recipientPhone}`);
    return true; 
}

// Hook for Persistent Audit Logging
async function logAudit(schoolId, userId, action, entityId, details) {
    console.log(`[ID Card Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`);
    // NOTE: In production, this inserts a record into a dedicated audit_logs table.
}


// --- CORE LOGIC ---

// Helper to generate a unique Barcode UID for attendance
function generateBarcodeUID(targetEntityId) {
    return `SGX-AT-${String(targetEntityId).substring(0, 4)}-${Date.now().toString().slice(-6)}`;
}

// POST: Submit new ID card request (Status: Pending Photo/Data Validation)
router.post('/requests', async (req, res) => {
    const { schoolId, userId, userRole } = getRequestContext(req);
    const { targetEntityId, userType, name, ...data } = req.body;

    if (!isManager(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required.' });
    }
    // INPUT VALIDATION CHECKER: Check required fields.

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let barcodeUid = data.barcodeUid; 
        
        // --- ENHANCEMENT: Handle Barcode UID generation for both Students and Staff ---
        if (userType === 'student' || userType === 'staff') {
            const targetTable = userType === 'student' ? 'students' : 'teachers';
            
            // 1. Check if Barcode UID already exists
            const entityCheck = await client.query(`SELECT barcode_uid FROM ${targetTable} WHERE id = $1`, [targetEntityId]);
            barcodeUid = entityCheck.rows[0]?.barcode_uid;

            if (!barcodeUid) {
                barcodeUid = generateBarcodeUID(targetEntityId);
                // 2. Update the respective table with the new UID (CRITICAL LINK TO ATTENDANCE)
                await client.query(`UPDATE ${targetTable} SET barcode_uid = $1 WHERE id = $2 AND school_id = $3`, [barcodeUid, targetEntityId, schoolId]);
            }
        }
        // ---------------------------------------------------------------------------------

        // 3. Insert the initial request into id_card_generator table
        const requestData = { ...data, barcodeUid };
        const result = await client.query(
            `INSERT INTO id_card_generator (school_id, target_entity_id, target_entity_type, request_data, requested_by_user_profile_id, status)
             VALUES ($1, $2, $3, $4, $5, 'pending_data') RETURNING *`,
            [schoolId, targetEntityId, userType, requestData, userId]
        );
        
        await logAudit(schoolId, userId, 'REQUEST_SUBMITTED', result.rows[0].id, { userType });

        await client.query('COMMIT');
        res.status(201).json({ success: true, request: result.rows[0], barcodeUid: barcodeUid });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('ID Card Request Error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to submit ID card request.' });
    } finally {
        client.release();
    }
});


// POST: Generate ID Card (System/Admin Action) - This step finalizes data and sends for Principal approval
router.post('/requests/:requestId/generate', async (req, res) => {
    const { requestId } = req.params;
    const { userRole, userId } = getRequestContext(req);

    if (!isManager(userRole)) {
        return res.status(403).json({ success: false, error: 'Admin authorization required for generation.' });
    }
    // INPUT VALIDATION CHECKER: Check required fields.

    try {
        // 1. Update status to pending_approval
        await pool.query(
            "UPDATE id_card_generator SET status = 'pending_approval' WHERE id = $1",
            [requestId]
        );
        
        // 2. Notify Principal (Arattai/WhatsApp)
        await sendNotification('PrincipalPhone', 'ID_CARD_APPROVAL_NEEDED', { requestId: requestId, submittedBy: userRole });

        res.json({ success: true, message: 'ID Card generated successfully and submitted for Principal approval.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to process ID card generation.' });
    }
});


// POST: Approve Request (CRITICAL: Principal Only - Unlocks Printing)
router.post('/requests/:requestId/approve', async (req, res) => {
    const { requestId } = req.params;
    const { userRole, userId } = getRequestContext(req);

    if (!isApprover(userRole)) {
        return res.status(403).json({ success: false, error: 'PRINCIPAL/Super Admin approval required.' });
    }

    try {
        await pool.query(
            "UPDATE id_card_generator SET status = 'approved', approved_by = $2, approved_at = NOW() WHERE id = $1",
            [requestId, userId]
        );
        
        // Audit Log: Approval
        await logAudit(getRequestContext(req).schoolId, userId, 'CARD_APPROVED', requestId, { approvedBy: userRole });

        // 1. Final confirmation notification
        await sendNotification('AdminPhone', 'ID_CARD_FINAL_APPROVED', { requestId: requestId, approvedBy: userRole });

        res.json({ success: true, message: 'ID Card approved. Printing and issuance are now authorized.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to approve request.' });
    }
});

// GET: All Requests (Simplified)
router.get('/requests', async (req, res) => {
    const { schoolId } = getRequestContext(req);
    // INPUT VALIDATION CHECKER: Validate query parameters.
    const result = await pool.query(
        "SELECT id, target_entity_type, status, request_data FROM id_card_generator WHERE school_id = $1", 
        [schoolId]
    );
    res.json({ success: true, data: result.rows });
});

// GET: Print Gated Endpoint (FE should call this only when status is 'approved')
router.get('/requests/:requestId/print-data', async (req, res) => {
    const { requestId } = req.params;
    const { userRole } = getRequestContext(req);
    
    // Authorization check before fetching sensitive data
    if (!isPrincipalOrAdmin(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to view printable data.' });
    }

    const { rows } = await pool.query("SELECT * FROM id_card_generator WHERE id = $1", [requestId]);
    
    if (rows.length === 0 || rows[0].status !== 'approved') {
         return res.status(403).json({ success: false, error: 'Card not approved by Principal or does not exist.' });
    }

    // NOTE: This endpoint returns all data needed for the FE to render the printable card, including the Barcode UID.
    res.json({ success: true, cardData: rows[0].request_data, status: rows[0].status });
});

// --- NEW ENDPOINTS: CONFIGURATION PAGE ---

// GET: Fetch ID Card Configuration (Gated Access)
router.get('/config', async (req, res) => {
    const { schoolId, userRole } = getRequestContext(req);

    if (!isPrincipalOrAdmin(userRole)) {
        return res.status(403).json({ success: false, error: 'Access denied. Only Admin/Principal can view configuration.' });
    }
    
    try {
        // Fetch current settings from a dedicated config table (id_card_config)
        const result = await pool.query(
            "SELECT * FROM id_card_config WHERE school_id = $1", 
            [schoolId]
        );
        
        res.json({ success: true, settings: result.rows[0] || { template: 'modern_student_v1', fields: ['name', 'class', 'barcodeUid'], expiration: '12 months' } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to retrieve configuration.' });
    }
});

// PUT: Update ID Card Configuration (Gated Access)
router.put('/config', async (req, res) => {
    const { schoolId, userId, userRole } = getRequestContext(req);
    const { template, requiredFields, complianceSettings, expirationPolicy, barcodeStyle } = req.body;

    if (!isPrincipalOrAdmin(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to update configuration.' });
    }
    // INPUT VALIDATION CHECKER: Validate template, fields, and settings structure.
    
    try {
        // NOTE: This complex query would upsert the configuration settings into the id_card_config table.
        await pool.query(
            `INSERT INTO id_card_config (school_id, template, required_fields, expiration_policy, barcode_style)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (school_id) DO UPDATE SET 
                template = $2, required_fields = $3, expiration_policy = $4, barcode_style = $5;`,
            [schoolId, template, requiredFields, expirationPolicy, barcodeStyle]
        );

        await logAudit(schoolId, userId, 'CONFIG_UPDATED', null, { template, expirationPolicy });

        res.json({ success: true, message: 'ID Card configuration updated successfully.', newTemplate: template });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update configuration.' });
    }
});

module.exports = router;
