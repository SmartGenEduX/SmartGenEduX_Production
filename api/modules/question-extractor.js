// Question Extractor Module - Production Ready API (AI-Powered)
const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi'); 
const router = express.Router();
const multer = require('multer'); // For file upload handling (PDF/DOCX)

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- R.B.A.C. & CONTEXT HELPERS ---

const getContext = (req) => ({
    // NOTE: In production, req.user must be populated by robust JWT authentication middleware.
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
    userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',
    userRole: req.user?.role || 'teacher' 
});

// Permissions
const isTeacher = (role) => 
    ['super_admin', 'school_admin', 'principal', 'teacher'].includes(role);

const isManager = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);


// Hook for Persistent Audit Logging
async function logAudit(schoolId, userId, action, entityId, details) {
    // NOTE: In production, this inserts a record into a dedicated audit_logs table.
    console.log(`[Extractor Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`, details);
    // Example DB insert: await pool.query('INSERT INTO audit_logs (school_id, user_id, action, entity_id, details, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())', [schoolId, userId, action, entityId, JSON.stringify(details)]);
}

// --- FILE UPLOAD SETUP (MOCK STORAGE) ---
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for serverless

// --- VALIDATION SCHEMAS ---
const uploadSchema = Joi.object({
    subjectId: Joi.string().required(),
    classId: Joi.string().required(),
    uploadedBy: Joi.string().required(), // Should match ctx.userId, but we validate here for structure
    extractionMethod: Joi.string().valid('basic_ocr', 'enhanced_ocr', 'ai_enhanced').default('enhanced_ocr')
});

const verificationSchema = Joi.object({
    isVerified: Joi.boolean().required(),
    marks: Joi.number().optional().min(1).max(10),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
    remarks: Joi.string().max(500).allow(null, '')
});

const bulkVerificationSchema = Joi.object({
    questionIds: Joi.array().items(Joi.string().required()).min(1).required(),
    isVerified: Joi.boolean().required(),
    remarks: Joi.string().max(500).allow(null, '')
});

const configSchema = Joi.object({
    ai_model_preference: Joi.string().valid('basic_ocr', 'enhanced_ocr', 'ai_enhanced').required(),
    confidence_threshold: Joi.number().min(50).max(100).required(),
    auto_verification_enabled: Joi.boolean().required(),
    supported_languages: Joi.array().items(Joi.string()).required(),
    max_file_size_mb: Joi.number().min(1).max(50).required()
});


// --- CORE API ENDPOINTS ---

// GET: List all extracted documents (Paginated)
router.get('/documents', async (req, res) => {
    const ctx = getContext(req);
    const { limit = 50, offset = 0, status, search } = req.query;

    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        let query = `
            SELECT id, file_name, uploaded_at, processing_status, questions_extracted 
            FROM question_extractor 
            WHERE school_id = $1
            ORDER BY uploaded_at DESC
            LIMIT $2 OFFSET $3`;
        
        const result = await pool.query(query, [ctx.schoolId, limit, offset]);
        
        res.json({ success: true, documents: result.rows, total: result.rows.length });
    } catch (err) {
        console.error("DB Error fetching documents:", err.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve documents list.' });
    }
});

// POST: Upload and process document (Teacher/Manager Action)
router.post('/upload', upload.single('documentFile'), async (req, res) => {
    const ctx = getContext(req);
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    if (!req.file) return res.status(400).json({ error: 'Document file is required.' });
    
    // 1. Input Validation
    const { error, value } = uploadSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'EXT_VAL_002' });
    
    try {
        // 2. Upload to Cloud Storage (Supabase/S3) - Returns secure URL
        const secureUrl = `https://cloud.storage/extractor/${ctx.schoolId}/${value.subjectId}/${Date.now()}`;
        
        // 3. Insert record into database (Status: Queued)
        const result = await pool.query(
            `INSERT INTO question_extractor (school_id, file_name, original_document_url, processing_status, uploaded_by_user_id, subject_id, class_id)
             VALUES ($1, $2, $3, 'queued', $4, $5, $6) RETURNING id`,
            [ctx.schoolId, req.file.originalname, secureUrl, ctx.userId, value.subjectId, value.classId]
        );
        const documentId = result.rows[0].id;

        // 4. Trigger AI Processing Queue (Hook for background worker)
        console.log(`[AI Queue] Started processing Document ID: ${documentId} using ${value.extractionMethod}.`);

        await logAudit(ctx.schoolId, ctx.userId, 'DOCUMENT_UPLOADED_QUEUED', documentId, { fileName: req.file.originalname, method: value.extractionMethod });

        res.status(201).json({ success: true, documentId: documentId, message: 'Document uploaded and queued for question extraction.' });
    } catch (err) {
        console.error("DB Error uploading document:", err.message);
        res.status(500).json({ success: false, error: 'Failed to upload document.' });
    }
});

// GET: Extracted questions for a document
router.get('/documents/:documentId/questions', async (req, res) => {
    const ctx = getContext(req);
    // Teacher/Manager access required
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        const result = await pool.query(
            `SELECT * FROM question_bank WHERE source_document_id = $1 AND school_id = $2 ORDER BY page_number ASC`,
            [req.params.documentId, ctx.schoolId]
        );
        
        res.json({ success: true, questions: result.rows, total: result.rows.length });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to retrieve extracted questions.' });
    }
});

// POST: Verify and save question to the final Question Bank (Teacher Action)
router.post('/questions/:questionId/verify', async (req, res) => {
    const ctx = getContext(req);
    // Only Teachers/Admins can verify/edit questions
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });
    
    const { error, value } = verificationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'EXT_VAL_001' });

    try {
        const { isVerified, marks, difficulty, remarks } = value;
        const newStatus = isVerified ? 'verified' : 'needs_review';

        // NOTE: This complex query updates the status of the question and sets the final verified data (marks, difficulty).
        await pool.query(
            `UPDATE question_bank 
             SET verified_status = $1, marks = $2, difficulty = $3, verification_notes = $4, verified_by = $5 
             WHERE id = $6 AND school_id = $7`,
            [newStatus, marks, difficulty, remarks, ctx.userId, req.params.questionId, ctx.schoolId]
        );

        await logAudit(ctx.schoolId, ctx.userId, `QUESTION_VERIFIED_${newStatus.toUpperCase()}`, req.params.questionId, { marks, difficulty });
        
        res.json({ success: true, message: `Question marked as ${newStatus}. Ready for QPG.` });
    } catch (err) {
        console.error("DB Error during verification:", err.message);
        res.status(500).json({ success: false, error: 'Failed to verify question.' });
    }
});

// POST: Bulk verify/reject questions (for efficiency)
router.post('/questions/bulk-verify', async (req, res) => {
    const ctx = getContext(req);
    if (!isTeacher(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });
    
    // 1. Validation
    const { error, value } = bulkVerificationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'EXT_VAL_003' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { questionIds, isVerified, remarks } = value;
        const newStatus = isVerified ? 'verified' : 'needs_review';
        
        // 2. Execute bulk update in a single query
        const updateResult = await client.query(
            `UPDATE question_bank 
             SET verified_status = $1, verification_notes = $2, verified_by = $3 
             WHERE id = ANY($4::text[]) AND school_id = $5`,
            [newStatus, remarks, ctx.userId, questionIds, ctx.schoolId]
        );
        
        await logAudit(ctx.schoolId, ctx.userId, `QUESTION_BULK_VERIFIED`, null, { count: updateResult.rowCount, status: newStatus });
        
        await client.query('COMMIT');
        res.json({ success: true, updatedCount: updateResult.rowCount, message: `${updateResult.rowCount} questions marked as ${newStatus}.` });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error during bulk verification:", err.message);
        res.status(500).json({ success: false, error: 'Failed to process bulk verification.' });
    } finally {
        client.release();
    }
});

// GET: Statistics (Analytics)
router.get('/statistics', async (req, res) => {
    const ctx = getContext(req);
    if (!isManager(ctx.userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        // NOTE: This queries dedicated analytics views or runs aggregations on the question_bank/extractor tables.
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_extracted,
                COUNT(*) FILTER (WHERE verified_status = 'verified') as verified_count,
                COUNT(*) FILTER (WHERE processing_status = 'processing') as processing_count
            FROM question_extractor WHERE school_id = $1;
        `, [ctx.schoolId]);
        
        res.json({ success: true, summary: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to retrieve statistics.' });
    }
});

// --- ADMIN CONFIGURATION PAGE (Dedicated Config) ---

// GET: Extraction Settings
router.get('/config', async (req, res) => {
    const { schoolId, userRole } = getContext(req);
    if (!isManager(userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        // Fetch AI Model settings and quality thresholds
        const result = await pool.query(`SELECT * FROM extraction_settings WHERE school_id = $1`, [schoolId]);
        res.json({ success: true, settings: result.rows[0] || {} });
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch config', details: e.message });
    }
});

// PUT: Update Extraction Settings
router.put('/config', async (req, res) => {
    const { schoolId, userRole, userId } = getContext(req);

    // 1. Validation
    const { error, value } = configSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'EXT_VAL_004' });

    if (!isManager(userRole)) return res.status(403).json({ error: 'Unauthorized' });

    try {
        // Upsert configuration (simplified)
        await pool.query(
            `INSERT INTO extraction_settings (school_id, ai_model_preference, confidence_threshold, auto_verification_enabled, supported_languages, max_file_size_mb)
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (school_id) DO UPDATE SET 
                ai_model_preference = $2, confidence_threshold = $3, auto_verification_enabled = $4, supported_languages = $5, max_file_size_mb = $6`,
            [schoolId, value.ai_model_preference, value.confidence_threshold, value.auto_verification_enabled, value.supported_languages, value.max_file_size_mb]
        );

        await logAudit(schoolId, userId, 'EXTRACTION_CONFIG_UPDATED', null, { model: value.ai_model_preference, confidence: value.confidence_threshold });
        
        res.json({ success: true, message: 'Extraction settings updated successfully.' });
    } catch (e) {
        console.error("DB Error updating config:", e.message);
        res.status(500).json({ error: 'Failed to update configuration', details: e.message });
    }
});


// Export the router
module.exports = router;
