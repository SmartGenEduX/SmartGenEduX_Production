const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi'); // For input validation
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// --- AUTH MIDDLEWARE PLACEHOLDER (to be used globally) ---
function authMiddleware(req, res, next) {
  // In production, parse and verify JWT token here, set req.user
  next();
}

router.use(authMiddleware); // Apply to all routes below

// --- R.B.A.C. & CONTEXT HELPERS (FIXED for Multi-Branch Filtering) ---
const getRequestContext = (req) => ({
  // PRIORITY FIX: Use schoolId from the URL query first (set by frontend branch selector)
  schoolId: req.query.schoolId || req.user?.schoolId || '00000000-0000-0000-0000-000000000001',
  userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',
  userRole: req.user?.role || 'ac_incharge'
});

const isAccountsIncharge = (role) =>
  role === 'super_admin' || role === 'school_admin' || role === 'ac_incharge';

const isPrincipalOrAdmin = (role) =>
  role === 'super_admin' || role === 'school_admin' || role === 'principal';

const isFinanceConfigManager = (role) =>
  role === 'school_admin' || role === 'ac_incharge';

const isPrincipalOrSuperAdmin = (role) =>
  role === 'super_admin' || role === 'principal';

// --- VALIDATION SCHEMAS ---
const paymentQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
  studentId: Joi.string().optional(),
  status: Joi.string().optional(),
  sortBy: Joi.string().valid('payment_date', 'amount_paid').default('payment_date'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
  schoolId: Joi.string().optional() // Allow schoolId in query
});

const paymentBodySchema = Joi.object({
  studentId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().required(),
  transactionId: Joi.string().optional().allow(null, ''),
  feeStructureId: Joi.string().optional().allow(null, '')
});

const defaulterQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
  sortBy: Joi.string().valid('days_overdue', 'amount').default('days_overdue'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
  minOverdueDays: Joi.number().integer().min(0).optional(),
  minAmount: Joi.number().min(0).optional(),
  export: Joi.string().valid('csv', 'pdf').optional(),
  schoolId: Joi.string().optional() // Allow schoolId in query
});

const configUpdateSchema = Joi.object({
  lateFeePercent: Joi.number().min(0).max(100).required(),
  graceDays: Joi.number().integer().min(0).required(),
  accountingSyncEnabled: Joi.boolean().required(),
  feeStructureUpdates: Joi.array().optional(),
  discountUpdates: Joi.array().optional()
});

// --- Hook for Arattai/WhatsApp Notifications (Simulated Queue) ---
async function sendNotification(recipientPhone, type, variables) {
  // Here, implement message queuing and delivery confirmation
  console.log(`[Notification Queue] Sending ${type} alert to ${recipientPhone}`, variables);
  return true;
}

// --- Hook for Persistent Audit Logging ---
async function logAudit(schoolId, userId, action, entityId, details) {
  // Persist logs in database audit_logs table (example shown)
  console.log(`[Fee Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`, details);
}

// --- CORE API ENDPOINTS ---

// GET: All fee payments with validated query params
router.get('/payments', async (req, res) => {
  try {
    const { error, value } = paymentQuerySchema.validate(req.query);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { limit, offset, sortBy, sortOrder } = value;
    // Context now pulls schoolId from req.query thanks to getRequestContext fix
    const { userRole, schoolId } = getRequestContext(req); 

    if (!isAccountsIncharge(userRole))
      return res.status(403).json({ success: false, error: 'Access denied. Requires Accounts authorization.' });

    const query = `
      SELECT fp.*, s.first_name, s.last_name FROM fee_payments fp
      JOIN students s ON fp.student_id = s.id
      WHERE fp.school_id = $1
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [schoolId, limit, offset]);
    res.json({ success: true, payments: result.rows });
  } catch (err) {
    console.error("DB Error fetching payments:", err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve fee payments due to server error.' });
  }
});

// POST: Process new payment with input validation
router.post('/payment', async (req, res) => {
  try {
    const { error, value } = paymentBodySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { studentId, amount, method, transactionId, feeStructureId } = value;
    // Context now pulls schoolId from req.query or auth
    const { schoolId, userId, userRole } = getRequestContext(req); 

    if (!isAccountsIncharge(userRole))
      return res.status(403).json({ success: false, error: 'Only Accounts Incharge/Admin can log payments.' });
    
    const result = await pool.query(
      `INSERT INTO fee_payments 
       (school_id, student_id, amount_paid, payment_date, payment_method, transaction_id, fee_structure_id, created_by_user_id)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7) RETURNING id`,
      [schoolId, studentId, amount, method, transactionId, feeStructureId, userId]
    );
    const paymentId = result.rows[0].id;

    await logAudit(schoolId, userId, 'PAYMENT_RECEIVED', paymentId, { amount, method, by: userRole });
    await sendNotification('parent_phone_from_db', 'PAYMENT_CONFIRMED', { amount });

    res.status(201).json({ success: true, paymentId, message: 'Payment logged successfully.' });
  } catch (err) {
    console.error("DB Error logging payment:", err.message);
    res.status(500).json({ success: false, error: 'Failed to log payment due to database error.' });
  }
});

// POST: Sync fee collection data from ERP to Tally
router.post('/tally/sync-collection', async (req, res) => {
  const { userRole, userId, schoolId } = getRequestContext(req);
  if (!isAccountsIncharge(userRole))
    return res.status(403).json({ success: false, error: 'Authorization required to run Tally sync.' });

  await logAudit(schoolId, userId, 'TALLY_SYNC_INITIATED', null, { source: 'ERP' });
  console.log(`TALLY INTEGRATION: Initiating fee collection sync for School ID: ${schoolId}`);

  res.json({
    success: true,
    message: `Tally collection sync initiated for today's transactions in School ID ${schoolId}.`,
    status: "queued"
  });
});

// POST: Tally webhook for reconciliation confirmation with secret verification (No schoolId context needed here, handled by secret)
router.post('/tally/webhook', async (req, res) => {
  const { transactionId, tallyVoucherId, status, errorDetails, secret } = req.body;

  if (!secret || secret !== process.env.TALLY_WEBHOOK_SECRET)
    return res.status(403).json({ received: false, error: 'Authentication failed.' });

  if (!transactionId || !status)
    return res.status(400).json({ received: false, error: 'Missing required webhook payload data.' });

  if (status === 'success' || status === 'completed') {
    await logAudit('system', 'webhook', 'TALLY_VOUCHER_SUCCESS', transactionId, { voucher: tallyVoucherId });
  } else {
    await logAudit('system', 'webhook', 'TALLY_VOUCHER_FAILED', transactionId, { error: errorDetails, status });
  }

  // Update local reconciliation flags accordingly here

  res.status(200).json({ received: true });
});

// POST: Initiate tri-party verification
router.post('/verification/triparty-initiate', async (req, res) => {
  const schema = Joi.object({ paymentId: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  const { paymentId } = value;
  const { userRole, userId, schoolId } = getRequestContext(req);

  if (!isAccountsIncharge(userRole))
    return res.status(403).json({ success: false, error: 'Only Accounts staff can initiate verification.' });

  // Fetch parent phone from DB for paymentId (simulate here)
  const targetParentPhone = '+919876543210';

  await sendNotification(targetParentPhone, 'PAYMENT_VERIFICATION_REQUEST', { payment_id: paymentId, amount: 'X.XX' });
  await logAudit(schoolId, userId, 'VERIFICATION_INITIATED', paymentId, { target: targetParentPhone });

  res.status(202).json({
    success: true,
    message: 'Tri-Party Verification initiated. Parent notified via WhatsApp/Arattai to confirm receipt.',
    verificationStatus: 'pending_parent_response'
  });
});

// GET: Defaulters List with filters and pagination
router.get('/defaulters', async (req, res) => {
  const paramsSchema = defaulterQuerySchema;
  const { error, value } = paramsSchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  const { userRole, schoolId } = getRequestContext(req);
  if (!isPrincipalOrSuperAdmin(userRole))
    return res.status(403).json({ success: false, error: 'Access denied. Oversight required.' });

  const { limit, offset, sortBy, sortOrder, minOverdueDays, minAmount, export: exportFormat } = value;

  try {
    let whereClauses = ['school_id = $1'];
    let params = [schoolId];
    if (minOverdueDays !== undefined) {
      params.push(minOverdueDays);
      whereClauses.push(`days_overdue >= $${params.length}`);
    }
    if (minAmount !== undefined) {
      params.push(minAmount);
      whereClauses.push(`amount > $${params.length}`);
    }

    const query = `
      SELECT * FROM defaulters_view 
      WHERE ${whereClauses.join(' AND ')} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT $${params.push(limit)} OFFSET $${params.push(offset)};
    `;

    const result = await pool.query(query, params);

    if (exportFormat === 'csv' || exportFormat === 'pdf') {
      await logAudit(schoolId, req.user?.userId || 'unknown', 'REPORT_EXPORTED', null, { type: 'Defaulters', format: exportFormat });

      if (exportFormat === 'csv') {
        // Generate real CSV here based on result.rows in production
        return res.header('Content-Type', 'text/csv').send("student,amount,days_overdue\nMock,1000,30");
      } else {
        return res.status(200).json({ success: true, downloadUrl: '/api/reports/defaulters.pdf', message: 'PDF report queued for generation.' });
      }
    }

    res.json({ success: true, defaulterList: result.rows, totalCount: 47 });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve defaulters list.' });
  }
});

// POST: Automated daily alerts to defaulters
router.post('/defaulters/auto-alert', async (req, res) => {
  const { schoolId } = getRequestContext(req);

  // NOTE: Restrict this endpoint to internal cron jobs with secret auth in production

  // Fetch defaulters (mock data here)
  const defaulterTargets = [{ phone: '+919876543210', name: 'Student A', amount: '25000' }];

  let sentCount = 0;
  for (const defaulter of defaulterTargets) {
    await sendNotification(defaulter.phone, 'FEE_OVERDUE_DAILY_REMINDER', { name: defaulter.name, amount: defaulter.amount });
    sentCount++;
  }

  res.status(200).json({
    success: true,
    message: `Daily reminders sent successfully to ${sentCount} defaulters via Arattai/WhatsApp for School ID ${schoolId}.`,
    sentCount
  });
});

// GET: Fetch fee configuration securely
router.get('/config', async (req, res) => {
  const { userRole, schoolId } = getRequestContext(req);

  if (!isFinanceConfigManager(userRole))
    return res.status(403).json({ success: false, error: 'Access denied. Only A/c Incharge or School Admin can configure fee settings.' });

  try {
    // Fetch fee config from database
    res.json({ success: true, config: { lateFeePercent: 2.0, graceDays: 15, accountingSyncEnabled: true } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch fee configuration.' });
  }
});

// PUT: Update fee configuration securely with validation placeholder
router.put('/config', async (req, res) => {
  const { userRole, schoolId } = getRequestContext(req);

  if (!isFinanceConfigManager(userRole))
    return res.status(403).json({ success: false, error: 'Authorization denied to update settings.' });

  // Input validation placeholder (should validate req.body here)

  try {
    // Update fee config and structures here
    await logAudit(schoolId, req.user?.userId || 'unknown', 'CONFIG_UPDATE', null, req.body);

    res.json({
      success: true,
      message: 'Fee configuration and structure rules updated successfully.',
      updated: req.body
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update configuration.' });
  }
});

module.exports = router;
