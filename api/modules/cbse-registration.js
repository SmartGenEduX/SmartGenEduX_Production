const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const Joi = require('joi');
const jwt = require('jsonwebtoken');  // JWT package
const router = express.Router();

// DB Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// JWT Authentication Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
router.use(authMiddleware);

// Role checks
const isManager = role => ['super_admin','school_admin','principal'].includes(role);
const isTeacher = role => ['super_admin','school_admin','principal','teacher'].includes(role);
const isPrincipal = role => ['super_admin','principal'].includes(role);

// Context extraction helper
const getContext = req => ({
  userId: req.user.id,
  schoolId: req.user.schoolId,
  role: req.user.role,
});

// Notification hook (placeholder for queuing)
async function sendNotification(to, template, context) {
  console.log(`[Notification QUEUE] To: ${to}, Template: ${template}, Context:`, context);
  return true;
}

// Audit logging (writes audit entry to DB)
async function logAudit(schoolId, userId, action, entityId, details) {
  await pool.query(`INSERT INTO audit_logs (school_id, user_id, action, entity_id, details, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`,
    [schoolId, userId, action, entityId, JSON.stringify(details)]);
}

// Multer for file upload - memory storage for cloud upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if(!allowed.test(ext)) return cb(new Error('Only PDF/JPG/PNG allowed'));
    cb(null, true);
  }
});

// Validation schemas using Joi
const registrationSchema = Joi.object({
  studentId: Joi.string().required(),
  studentName: Joi.string().required(),
  studentClass: Joi.string().valid('9th','11th').required(),
  academicYear: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
  personalDetails: Joi.object({
    fullName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('Male','Female','Other').required(),
    aadhaarNumber: Joi.string().length(12).required(),
    // Other personal fields as required...
  }).required(),
  parentDetails: Joi.object({
    fatherName: Joi.string().required(),
    fatherPhone: Joi.string().pattern(/^\d{10,15}$/).required(),
    motherName: Joi.string().required(),
    // Other parent details...
  }).required(),
  submittedBy: Joi.string().valid('parent','student','admin').required(),
  documents: Joi.object().optional()
});

// Other validation schemas for verification, approval...

// Routes

// List Registrations
router.get('/registrations', async (req,res) => {
  const ctx = getContext(req);
  const querySchema = Joi.object({
    studentClass: Joi.string().valid('9th','11th'),
    status: Joi.string(),
    academicYear: Joi.string(),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0)
  });
  const { error, value } = querySchema.validate(req.query);
  if(error) return res.status(400).json({ error: error.details[0].message });

  if(!isTeacher(ctx.role)) return res.status(403).json({ error: 'Unauthorized' });

  try {
    let sql = `SELECT * FROM cbse_registration WHERE school_id=$1`;
    const params = [ctx.schoolId];
    if(value.studentClass){
      sql += ` AND studentClass=$${params.push(value.studentClass)}`;
    }
    if(value.status){
      sql += ` AND status=$${params.push(value.status)}`;
    }
    if(value.academicYear){
      sql += ` AND academicYear=$${params.push(value.academicYear)}`;
    }
    sql += ` ORDER BY submittedAt DESC LIMIT $${params.push(value.limit)} OFFSET $${params.push(value.offset)}`;
    
    const { rows } = await pool.query(sql, params);
    // Ideally, total count from separate query here

    res.json({ success:true, data:rows, count:rows.length });
  } catch (err){
    console.error(err);
    res.status(500).json({ error: 'Failed fetching registrations' });
  }
});

// Submit Registration
router.post('/registrations', async (req,res) => {
  const ctx = getContext(req);

  if(!isManager(ctx.role)) return res.status(403).json({ error: 'Unauthorized' });

  const { error, value } = registrationSchema.validate(req.body);
  if(error) return res.status(400).json({ error: error.details[0].message });

  try {
    // check duplicate etc skipped for brevity
    const result = await pool.query(
      `INSERT INTO cbse_registration (school_id, studentId, registrationData, status, submittedBy, submittedAt) VALUES ($1,$2,$3,'submitted',$4, NOW()) RETURNING id`,
      [ctx.schoolId, value.studentId, value, ctx.userId]
    );
    await logAudit(ctx.schoolId, ctx.userId, 'CBSE_SUBMITTED', result.rows[0].id, { studentId: value.studentId });
    await sendNotification('TeacherId', 'CBSE_VERIFICATION_NEEDED', { studentName: value.studentName });
    res.status(201).json({ success:true, registrationId: result.rows[0].id, message:'Registration submitted.' });
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed submitting registration' });
  }
});

// Other routes for verification, approval, submission, document upload similar...

// Export
module.exports = router;

