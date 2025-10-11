// Library Management Module - Production Ready API (Compliance & Fines)
const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi'); // For input validation
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- R.B.A.C. & CONTEXT HELPERS ---

const getRequestContext = (req) => ({
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001', 
    userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',   
    userRole: req.user?.role || 'librarian' // Primary user is the Librarian
});

// Permissions
const isLibrarian = (role) => 
    ['super_admin', 'school_admin', 'principal', 'librarian'].includes(role);

const isTeacherOrManager = (role) => 
    ['super_admin', 'school_admin', 'principal', 'teacher'].includes(role);

const isManager = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

const isPrincipalOrSuperAdmin = (role) => 
    ['super_admin', 'principal'].includes(role);


// Hook for Persistent Audit Logging
async function logAudit(schoolId, userId, action, entityId, details) {
    console.log(`[LMS Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`, details);
    // NOTE: In production, this inserts a record into a dedicated audit_logs table.
}

// Hook for Arattai/WhatsApp Notifications
async function sendNotification(recipientPhone, type, details) {
    console.log(`[Notification Queue] Sending ${type} alert to ${recipientPhone}`, details);
    return true; 
}


// --- VALIDATION SCHEMAS ---

const loanSchema = Joi.object({
    bookId: Joi.string().guid().required(),
    studentId: Joi.string().guid().required(),
    dueDate: Joi.date().iso().required(),
}).options({ allowUnknown: true });

const searchSchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    search: Joi.string().optional().allow(''),
    status: Joi.string().valid('on_loan', 'returned', 'lost').optional(),
    overdue: Joi.boolean().optional(),
    export: Joi.string().valid('csv', 'pdf').optional()
});

const configUpdateSchema = Joi.object({
    maxLoanDays: Joi.number().integer().min(7).max(90).required(),
    finePerDay: Joi.number().min(0).max(50).required(), // Max fine per day (e.g., 50 INR)
    overdueNotificationDays: Joi.number().integer().min(1).max(14).required(), // Days before due date to send reminder
    maxConcurrentLoans: Joi.number().integer().min(1).max(10).required() // Max books a student can borrow
});


// --- CORE API ENDPOINTS ---

// GET: List all books (Read Inventory) - With Pagination and Search
router.get('/books', async (req, res) => {
    const { schoolId } = getRequestContext(req);
    const { error: queryError, value: queryValue } = searchSchema.validate(req.query);
    if (queryError) return res.status(400).json({ error: queryError.details[0].message, code: 'LMS_VAL_002' });

    const { limit, offset, search } = queryValue;
    
    try {
        let whereClauses = [`school_id = $1`];
        const params = [schoolId];
        
        // Search Filter
        if (search) {
             whereClauses.push(`(title ILIKE $${params.push(`%${search}%`)} OR author ILIKE $${params.push(`%${search}%`)})`);
        }
        
        const whereString = whereClauses.join(' AND ');

        // Get Total Count
        const countQuery = `SELECT COUNT(id) AS total FROM library_books WHERE ${whereString};`;
        const countResult = await pool.query(countQuery, params);
        const totalCount = parseInt(countResult.rows[0].total);

        let query = `
            SELECT id, title, author, isbn, available_copies, total_copies
            FROM library_books
            WHERE ${whereString}
            ORDER BY title 
            LIMIT $${params.push(limit)} OFFSET $${params.push(offset)};
        `;
        const result = await pool.query(query, params);

        res.json({ success: true, books: result.rows, totalRecords: totalCount });
    } catch (err) {
        console.error("DB Query Error /library/books:", err.message);
        res.status(500).json({ success: false, error: 'Database access error fetching books.' });
    }
});

// POST: CHECK-OUT/LOAN (1. Collection of books)
router.post('/loan', async (req, res) => {
    const { userRole, schoolId, userId } = getRequestContext(req);
    const { bookId, studentId, dueDate } = req.body;

    if (!isLibrarian(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage loans.' });
    }
    
    const { error } = loanSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'LMS_VAL_001' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); 
        
        // --- 1. Fetch Config and Student Status (for eligibility checks) ---
        const configResult = await client.query("SELECT max_loan_days, max_concurrent_loans FROM library_config WHERE school_id = $1", [schoolId]);
        const config = configResult.rows[0] || { max_loan_days: 30, max_concurrent_loans: 3 };

        // CRITICAL VALIDATION: Max Loan Period
        const loanDuration = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (loanDuration > config.max_loan_days) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, error: `Loan period exceeds maximum allowed of ${config.max_loan_days} days.` });
        }
        
        // CRITICAL VALIDATION: Max Concurrent Loans per Student
        const concurrentLoansResult = await client.query(
            "SELECT COUNT(id) AS count FROM library_loans WHERE student_id = $1 AND loan_status = 'on_loan'", 
            [studentId]
        );
        if (parseInt(concurrentLoansResult.rows[0].count) >= config.max_concurrent_loans) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, error: `Student has reached maximum concurrent loan limit of ${config.max_concurrent_loans} books.` });
        }


        // 2. Check if copy is available (Optimistic Lock)
        const checkResult = await client.query(
            "SELECT available_copies FROM library_books WHERE id = $1 AND school_id = $2 FOR UPDATE",
            [bookId, schoolId]
        );
        if (checkResult.rows.length === 0 || checkResult.rows[0].available_copies <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, error: 'No available copies of this book remain.' });
        }

        // 3. Decrement available copies
        await client.query(
            "UPDATE library_books SET available_copies = available_copies - 1 WHERE id = $1",
            [bookId]
        );

        // 4. Create loan record
        const loanResult = await client.query(
            `INSERT INTO library_loans 
            (school_id, book_id, student_id, user_profile_id, due_date, loan_status)
            VALUES ($1, $2, $3, $4, $5, 'on_loan') RETURNING id`,
            [schoolId, bookId, studentId, userId, dueDate]
        );

        await logAudit(schoolId, userId, 'BOOK_CHECKOUT', loanResult.rows[0].id, { bookId, studentId, maxLoanDays: config.max_loan_days });
        await client.query('COMMIT');
        
        // NOTE: Notification hook on approaching due date would be scheduled here.
        
        res.status(201).json({ success: true, message: 'Book successfully checked out.', loanId: loanResult.rows[0].id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error checking out book:", err.message);
        res.status(500).json({ success: false, error: 'Failed to process book check-out.' });
    } finally {
        client.release();
    }
});

// POST: SUBMISSION/RETURN (2. Submission of books) - With Fine Calculation
router.post('/return/:loanId', async (req, res) => {
    const { loanId } = req.params;
    const { userRole, schoolId, userId } = getRequestContext(req);

    if (!isLibrarian(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage returns.' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const returnDate = new Date();

        // 1. Check if loan is overdue and calculate fine (Fetches FINE_PER_DAY from config)
        const configResult = await client.query("SELECT fine_per_day FROM library_config WHERE school_id = $1", [schoolId]);
        const FINE_PER_DAY = configResult.rows[0]?.fine_per_day || 5.00; 

        const loanCheck = await client.query(
            "SELECT book_id, student_id, due_date, loan_status FROM library_loans WHERE id = $1 AND loan_status = 'on_loan' FOR UPDATE", 
            [loanId]
        );

        if (loanCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, error: 'Active loan record not found.' });
        }
        
        const loanRecord = loanCheck.rows[0];
        const dueDate = new Date(loanRecord.due_date);
        const daysOverdue = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
        
        const fineAmount = daysOverdue * FINE_PER_DAY;
        
        // 2. Mark loan as returned and update fine amount
        const loanResult = await client.query(
            `UPDATE library_loans 
            SET return_date = $1, loan_status = 'returned', fines_incurred = $3
            WHERE id = $2 RETURNING book_id, student_id, due_date;`,
            [returnDate, loanId, fineAmount]
        );
        
        const { book_id, student_id } = loanResult.rows[0];

        // 3. Increment available copies
        await client.query(
            "UPDATE library_books SET available_copies = available_copies + 1 WHERE id = $1",
            [book_id]
        );

        await logAudit(schoolId, userId, 'BOOK_RETURNED', loanId, { book_id, student_id, fineAmount });
        await client.query('COMMIT');

        // NOTE: Notification hook if fines are incurred would be sent here.

        res.json({ 
            success: true, 
            message: 'Book successfully returned.', 
            loanId, 
            fineCalculated: fineAmount,
            daysOverdue 
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error processing book return:", err.message);
        res.status(500).json({ success: false, error: 'Failed to process book return.' });
    } finally {
        client.release();
    }
});


// --- NEW: Loan History, Status, and Reporting ---

// GET: Student Loan History (for Parent/Student/Teacher Portal View)
router.get('/history/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { schoolId, userRole } = getRequestContext(req);
    
    // Authorization check: Teacher/Librarian/Manager or Parent of this student.
    if (!isTeacherOrManager(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to view history.' });
    }

    try {
        const query = `
            SELECT 
                l.id, l.due_date, l.return_date, l.fines_incurred, l.loan_status,
                lb.title, lb.isbn
            FROM library_loans l
            JOIN library_books lb ON l.book_id = lb.id
            WHERE l.school_id = $1 AND l.student_id = $2
            ORDER BY l.due_date DESC;
        `;
        const result = await pool.query(query, [schoolId, studentId]);

        res.json({ success: true, history: result.rows });
    } catch (err) {
        console.error("DB Query Error fetching loan history:", err.message);
        res.status(500).json({ success: false, error: 'Failed to fetch loan history.' });
    }
});


// GET: List all currently loaned books
router.get('/loans/current', async (req, res) => {
    const { schoolId, userRole } = getRequestContext(req);
    const { limit = 20, offset = 0, search, overdue } = req.query;

    if (!isLibrarian(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required.' });
    }
    
    try {
        let whereClauses = [`l.school_id = $1 AND l.loan_status = 'on_loan'`];
        const params = [schoolId];

        if (search) {
            whereClauses.push(`(lb.title ILIKE $${params.push(`%${search}%`)} OR s.first_name ILIKE $${params.push(`%${search}%`)})`);
        }
        if (overdue === 'true') {
            whereClauses.push(`l.due_date < NOW()`);
        }

        const countQuery = `SELECT COUNT(l.id) AS total FROM library_loans l JOIN students s ON l.student_id = s.id JOIN library_books lb ON l.book_id = lb.id WHERE ${whereClauses.join(' AND ')};`;
        const countResult = await pool.query(countQuery, params);
        const totalCount = parseInt(countResult.rows[0].total);

        let query = `
            SELECT 
                l.id, l.due_date, l.return_date, l.fines_incurred, lb.title, 
                s.first_name AS student_name, s.class_id
            FROM library_loans l
            JOIN library_books lb ON l.book_id = lb.id
            JOIN students s ON l.student_id = s.id
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY l.due_date ASC
            LIMIT $${params.push(limit)} OFFSET $${params.push(offset)};
        `;
        const result = await pool.query(query, params);

        res.json({ 
            success: true, 
            activeLoans: result.rows,
            pagination: { totalRecords: totalCount, limit: parseInt(limit), offset: parseInt(offset) }
        });
    } catch (err) {
        console.error("DB Error retrieving active loans:", err.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve active loans list.' });
    }
});

// --- LIBRARY CONFIGURATION (NEW ENDPOINTS) ---

const configUpdateSchema = Joi.object({
    maxLoanDays: Joi.number().integer().min(7).max(90).required(),
    finePerDay: Joi.number().min(0).max(50).required(), // Max fine per day (e.g., 50 INR)
    overdueNotificationDays: Joi.number().integer().min(1).max(14).required(), // Days before due date to send reminder
    maxConcurrentLoans: Joi.number().integer().min(1).max(10).required() // Max books a student can borrow
});

// GET: Fetch Library Configuration
router.get('/config', async (req, res) => {
    const { schoolId } = getRequestContext(req);
    
    try {
        const result = await pool.query("SELECT * FROM library_config WHERE school_id = $1", [schoolId]);
        
        // CRITICAL: Return accurate structure even if DB is empty
        res.json({ 
            success: true, 
            settings: result.rows[0] || { 
                max_loan_days: 30, 
                fine_per_day: 5.00, 
                overdue_notification_days: 3, 
                max_concurrent_loans: 3 
            } 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to retrieve library configuration.' });
    }
});

// PUT: Update Library Configuration (Restricted to Manager/Admin)
router.put('/config', async (req, res) => {
    const { userRole, schoolId, userId } = getRequestContext(req);

    if (!isManager(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to update settings.' });
    }

    const { error, value } = configUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'LMS_VAL_003' });

    try {
        // Upsert configuration into the library_config table
        await pool.query(
            `INSERT INTO library_config (school_id, max_loan_days, fine_per_day, overdue_notification_days, max_concurrent_loans)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (school_id) DO UPDATE SET 
                max_loan_days = $2, fine_per_day = $3, overdue_notification_days = $4, max_concurrent_loans = $5`,
            [schoolId, value.maxLoanDays, value.finePerDay, value.overdueNotificationDays, value.maxConcurrentLoans]
        );
        
        await logAudit(schoolId, userId, 'CONFIG_UPDATED', null, value);

        res.json({ success: true, message: 'Library configuration updated successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to update configuration.' });
    }
});


// --- ARATTAI INTEGRATION Endpoints (4. Overdue Notifications) ---

// GET: Get overdue loans (for Arattai/WhatsApp alerts)
router.get('/alerts/overdue-targets', async (req, res) => {
    const { schoolId } = getRequestContext(req);
    
    try {
        const query = `
            SELECT 
                s.first_name, s.last_name, s.parent_phone, 
                lb.title, l.due_date, l.fines_incurred
            FROM library_loans l
            JOIN students s ON l.student_id = s.id
            JOIN library_books lb ON l.book_id = lb.id
            WHERE l.school_id = $1 AND l.loan_status = 'on_loan' AND l.due_date < NOW();
        `;
        const result = await pool.query(query, [schoolId]);
        
        // NOTE: This endpoint is designed to be hit by a scheduled background job 
        // which then triggers the sendNotification hook for each target.
        
        res.json({ success: true, notificationTargets: result.rows });
    } catch (err) {
        console.error("DB Query Error fetching overdue loans:", err.message);
        res.status(500).json({ success: false, error: 'Database error fetching overdue loans list for Arattai/WhatsApp.' });
    }
});

// GET: Principal Dashboard Status (Oversight View)
router.get('/stats/oversight', async (req, res) => {
    const { schoolId, userRole } = getRequestContext(req);

    if (!isPrincipalOrSuperAdmin(userRole)) {
        return res.status(403).json({ success: false, error: 'Access denied. Principal oversight required.' });
    }

    try {
        // Query 1: Total active loans and overdue count
        const loansQuery = await pool.query(
            `SELECT 
                COUNT(*) AS total_active_loans,
                COUNT(*) FILTER (WHERE due_date < NOW()) AS total_overdue,
                SUM(fines_incurred) AS total_accrued_fines
             FROM library_loans
             WHERE school_id = $1 AND loan_status = 'on_loan'`, 
             [schoolId]
        );
        
        const summary = loansQuery.rows[0];

        // Audit Log: Principal accessed financial oversight
        await logAudit(schoolId, getRequestContext(req).userId, 'PRINCIPAL_LMS_OVERSIGHT', null, { view: 'Library Finances' });

        // Send notification to Principal about accrued fines (mock)
        if (summary.total_accrued_fines > 1000) {
            await sendNotification('PrincipalPhone', 'LMS_HIGH_FINE_ALERT', { fines: summary.total_accrued_fines });
        }


        res.json({
            success: true,
            dashboard: {
                totalActiveLoans: parseInt(summary.total_active_loans),
                totalOverdue: parseInt(summary.total_overdue),
                totalAccruedFines: parseFloat(summary.total_accrued_fines || 0),
            }
        });
    } catch (err) {
        console.error("DB Error fetching Principal stats:", err.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve management oversight statistics.' });
    }
});


module.exports = router;
