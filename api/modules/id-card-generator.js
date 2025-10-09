// ID Card Generator Module - SmartGenEduX (Principal Approval Gated)
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Placeholder functions (assuming they are fully implemented elsewhere)
const upload = multer({ dest: 'uploads/id-photos' });
const getRequestContext = (req) => ({
    schoolId: '00000000-0000-0000-0000-000000000001',
    userId: '11111111-1111-1111-1111-111111111111',
    userRole: 'school_admin'
});
const isApprover = (role) => role === 'super_admin' || role === 'principal';
const isManager = (role) => role === 'super_admin' || role === 'school_admin';
// Hook for Arattai/WhatsApp Notifications (to notify Principal)
async function sendNotification(recipientPhone, templateId, details) {
    console.log(`[Notification Hook] Sending ${templateId} alert to ${recipientPhone}`);
    return true; 
}


// --- CORE LOGIC ---

// Helper to generate a unique Barcode UID for attendance
function generateBarcodeUID(targetEntityId) {
    // Generate a simple, unique identifier based on target ID and timestamp
    return `SGX-AT-${String(targetEntityId).substring(0, 4)}-${Date.now().toString().slice(-6)}`;
}

// POST: Submit new ID card request (Status: Pending Photo/Data Validation)
router.post('/requests', async (req, res) => {
    const { schoolId, userId, userRole } = getRequestContext(req);
    const { targetEntityId, userType, name, ...data } = req.body;

    if (!isManager(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let barcodeUid = data.barcodeUid; 
        if (userType === 'student') {
            // 1. Check if student already has a barcode, if not, generate and update students table
            const studentCheck = await client.query("SELECT barcode_uid FROM students WHERE id = $1", [targetEntityId]);
            barcodeUid = studentCheck.rows[0]?.barcode_uid;

            if (!barcodeUid) {
                 barcodeUid = generateBarcodeUID(targetEntityId);
                 await client.query("UPDATE students SET barcode_uid = $1 WHERE id = $2 AND school_id = $3", [barcodeUid, targetEntityId, schoolId]);
            }
        }

        // 2. Insert the initial request into id_card_generator table
        const requestData = { ...data, barcodeUid };
        const result = await client.query(
            `INSERT INTO id_card_generator (school_id, target_entity_id, target_entity_type, request_data, requested_by_user_profile_id, status)
             VALUES ($1, $2, $3, $4, $5, 'pending_data') RETURNING *`,
            [schoolId, targetEntityId, userType, requestData, userId]
        );

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
    const result = await pool.query(
        "SELECT id, target_entity_type, status, request_data FROM id_card_generator WHERE school_id = $1", 
        [schoolId]
    );
    res.json({ success: true, data: result.rows });
});

// GET: Print Gated Endpoint (FE should call this only when status is 'approved')
router.get('/requests/:requestId/print-data', async (req, res) => {
    const { requestId } = req.params;
    const { rows } = await pool.query("SELECT * FROM id_card_generator WHERE id = $1", [requestId]);
    
    if (rows.length === 0 || rows[0].status !== 'approved') {
         return res.status(403).json({ success: false, error: 'Card not approved by Principal or does not exist.' });
    }

    // NOTE: This endpoint returns all data needed for the FE to render the printable card.
    res.json({ success: true, cardData: rows[0].request_data, status: rows[0].status });
});


module.exports = router;
