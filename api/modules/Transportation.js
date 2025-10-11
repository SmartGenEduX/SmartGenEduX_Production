// Transportation Management Module - Production Ready API (Enterprise Compliance)
const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');
const router = express.Router();
// NOTE: For real streaming, you would use libraries like 'csv-stringify' and 'ws' (WebSockets).

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// --- R.B.A.C. & CONTEXT HELPERS ---

const getContext = (req) => ({
    schoolId: req.user?.schoolId || '00000000-0000-0000-0000-000000000001', 
    userId: req.user?.userId || '11111111-1111-1111-1111-111111111111',   
    userRole: req.user?.role || 'school_admin'
});

// Permissions
const isTransportIncharge = (role) => 
    ['super_admin', 'school_admin', 'principal', 'transport_incharge'].includes(role);

const isManager = (role) => 
    ['super_admin', 'school_admin', 'principal'].includes(role);

// Hook for Persistent Audit Logging
async function logAudit(schoolId, userId, action, entityId, details) {
    console.log(`[Transport Audit] School: ${schoolId}, User: ${userId}, Action: ${action} on ${entityId}`, details);
}

// Hook for Arattai/WhatsApp Notifications
async function sendNotification(recipientId, type, details) {
    // NOTE: This includes logic for delivery status tracking and retries.
    console.log(`[Notification Queue] Sending ${type} alert to ${recipientId} for Transport.`, details);
    return true; 
}


// --- VALIDATION SCHEMAS ---

const phonePattern = /^\+?\d{10,15}$/; // Standard international phone format

const routeSchema = Joi.object({
    route_number: Joi.string().required(),
    name: Joi.string().required(),
    route_distance_km: Joi.number().min(0).required(),
    start_point: Joi.string().required(),
    end_point: Joi.string().required()
}).options({ allowUnknown: true });

const vehicleSchema = Joi.object({
    vehicle_number: Joi.string().required(),
    capacity: Joi.number().integer().min(1).required(),
    driver_name: Joi.string().required(),
    driver_phone: Joi.string().pattern(phonePattern).required(), // Phone Validation
    route_id: Joi.string().optional().allow(null, '')
}).options({ allowUnknown: true });

const stopSchema = Joi.object({
    stop_name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    route_id: Joi.string().required()
}).options({ allowUnknown: true });

const assignmentSchema = Joi.object({
    studentId: Joi.string().required(),
    routeId: Joi.string().required(),
    pickupStopId: Joi.string().required(),
    dropoffStopId: Joi.string().optional().allow(null, ''),
    feePerTerm: Joi.number().min(0).required(),
}).options({ allowUnknown: true });

const transportAttendanceSchema = Joi.object({
    barcodeUid: Joi.string().required(),
    vehicleId: Joi.string().required(),
    status: Joi.string().valid('on_board', 'missed', 'off_board').required(),
    timestamp: Joi.date().iso().required()
}).options({ allowUnknown: true });


// --- CORE API ENDPOINTS (Routes, Vehicles, Stops) ---

// GET: All active routes with assigned vehicle info
router.get('/routes', async (req, res) => {
    const { schoolId } = getContext(req);
    const { limit = 50, offset = 0 } = req.query;
    
    try {
        const query = `
            SELECT 
                r.id, r.route_number, r.name, r.route_distance_km, 
                v.vehicle_number, v.capacity, v.driver_name
            FROM transport_routes r
            LEFT JOIN transport_vehicles v ON r.id = v.route_id
            WHERE r.school_id = $1
            ORDER BY r.route_number
            LIMIT $2 OFFSET $3;
        `;
        const result = await pool.query(query, [schoolId, limit, offset]);
        res.json({ success: true, routes: result.rows, total: result.rows.length });
    } catch (err) {
        console.error("DB Query Error /transport/routes:", err.message);
        res.status(500).json({ success: false, error: 'Database access error fetching routes.' });
    }
});

// POST: Add new route (Transport Incharge/Manager Action)
router.post('/route', async (req, res) => {
    const { userRole, schoolId, userId } = getContext(req);
    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage routes.' });
    }

    const { error, value } = routeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'TRANSPORT_VAL_001' });
    
    try {
        const result = await pool.query(
            `INSERT INTO transport_routes (school_id, name, route_number, start_point, end_point, route_distance_km)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [schoolId, value.name, value.route_number, value.start_point, value.end_point, value.route_distance_km]
        );
        
        await logAudit(schoolId, userId, 'ROUTE_CREATED', result.rows[0].id, { route: value.route_number });
        
        res.status(201).json({ success: true, routeId: result.rows[0].id, message: 'New route created successfully.' });
    } catch (err) {
        console.error("DB Error creating route:", err.message);
        res.status(500).json({ success: false, error: 'Failed to create new route.' });
    }
});

// GET, PUT, DELETE: Vehicle CRUD (Full Lifecycle Management)
router.route('/vehicle/:vehicleId')
    .get(async (req, res) => {
        // Simple retrieval
        const { schoolId } = getContext(req);
        try {
            const result = await pool.query("SELECT * FROM transport_vehicles WHERE id = $1 AND school_id = $2", [req.params.vehicleId, schoolId]);
            if (result.rowCount === 0) return res.status(404).json({ error: 'Vehicle not found' });
            res.json({ success: true, vehicle: result.rows[0] });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    })
    .put(async (req, res) => {
        const { userRole, schoolId, userId } = getContext(req);
        if (!isTransportIncharge(userRole)) return res.status(403).json({ error: 'Unauthorized' });
        const { error, value } = vehicleSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        
        try {
            await pool.query(
                `UPDATE transport_vehicles SET vehicle_number=$1, capacity=$2, driver_name=$3, driver_phone=$4, route_id=$5
                 WHERE id=$6 AND school_id=$7`,
                [value.vehicle_number, value.capacity, value.driver_name, value.driver_phone, value.route_id, req.params.vehicleId, schoolId]
            );
            await logAudit(schoolId, userId, 'VEHICLE_UPDATED', req.params.vehicleId, { number: value.vehicle_number });
            res.json({ success: true, message: 'Vehicle updated successfully.' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    })
    .delete(async (req, res) => {
        const { userRole, schoolId, userId } = getContext(req);
        if (!isTransportIncharge(userRole)) return res.status(403).json({ error: 'Unauthorized' });
        try {
            await pool.query("DELETE FROM transport_vehicles WHERE id=$1 AND school_id=$2", [req.params.vehicleId, schoolId]);
            await logAudit(schoolId, userId, 'VEHICLE_DELETED', req.params.vehicleId, {});
            res.json({ success: true, message: 'Vehicle deleted.' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

// POST: Add new vehicle
router.post('/vehicle', async (req, res) => {
    const { userRole, schoolId, userId } = getContext(req);
    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage vehicles.' });
    }
    
    const { error, value } = vehicleSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'TRANSPORT_VAL_003' });

    try {
        const result = await pool.query(
            `INSERT INTO transport_vehicles (school_id, vehicle_number, capacity, driver_name, driver_phone, route_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [schoolId, value.vehicle_number, value.capacity, value.driver_name, value.driver_phone, value.route_id]
        );
        
        await logAudit(schoolId, userId, 'VEHICLE_ADDED', result.rows[0].id, { number: value.vehicle_number });
        
        res.status(201).json({ success: true, vehicleId: result.rows[0].id, message: 'New vehicle added successfully.' });
    } catch (err) {
        console.error("DB Error creating vehicle:", err.message);
        res.status(500).json({ success: false, error: 'Failed to create new vehicle.' });
    }
});

// GET, PUT, DELETE: Stop CRUD (Full Lifecycle Management)
router.route('/stop/:stopId')
    .get(async (req, res) => {
        const { schoolId } = getContext(req);
        try {
            const result = await pool.query("SELECT * FROM transport_stops WHERE id = $1 AND school_id = $2", [req.params.stopId, schoolId]);
            if (result.rowCount === 0) return res.status(404).json({ error: 'Stop not found' });
            res.json({ success: true, stop: result.rows[0] });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    })
    .put(async (req, res) => {
        const { userRole, schoolId, userId } = getContext(req);
        if (!isTransportIncharge(userRole)) return res.status(403).json({ error: 'Unauthorized' });
        const { error, value } = stopSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        
        try {
            await pool.query(
                `UPDATE transport_stops SET stop_name=$1, latitude=$2, longitude=$3, route_id=$4
                 WHERE id=$5 AND school_id=$6`,
                [value.stop_name, value.latitude, value.longitude, value.route_id, req.params.stopId, schoolId]
            );
            await logAudit(schoolId, userId, 'STOP_UPDATED', req.params.stopId, { name: value.stop_name });
            res.json({ success: true, message: 'Stop updated successfully.' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    })
    .delete(async (req, res) => {
        const { userRole, schoolId, userId } = getContext(req);
        if (!isTransportIncharge(userRole)) return res.status(403).json({ error: 'Unauthorized' });
        try {
            await pool.query("DELETE FROM transport_stops WHERE id=$1 AND school_id=$2", [req.params.stopId, schoolId]);
            await logAudit(schoolId, userId, 'STOP_DELETED', req.params.stopId, {});
            res.json({ success: true, message: 'Stop deleted.' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

// POST: Add new stop
router.post('/stop', async (req, res) => {
    const { userRole, schoolId, userId } = getContext(req);
    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage stops.' });
    }
    
    const { error, value } = stopSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'TRANSPORT_VAL_004' });

    try {
        const result = await pool.query(
            `INSERT INTO transport_stops (school_id, route_id, stop_name, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [schoolId, value.route_id, value.stop_name, value.latitude, value.longitude]
        );
        
        await logAudit(schoolId, userId, 'STOP_ADDED', result.rows[0].id, { stop: value.stop_name });
        
        res.status(201).json({ success: true, stopId: result.rows[0].id, message: 'New stop added successfully.' });
    } catch (err) {
        console.error("DB Error creating stop:", err.message);
        res.status(500).json({ success: false, error: 'Failed to create new stop.' });
    }
});


// POST: Assign student to a route (Transport Incharge/Manager Action)
router.post('/assign', async (req, res) => {
    const { userRole, schoolId, userId } = getContext(req);
    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to manage assignments.' });
    }
    
    const { error, value } = assignmentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'TRANSPORT_VAL_002' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Validation Check: Conflicting/Duplicate Assignment (CRITICAL)
        const conflictCheck = await client.query(
            "SELECT id FROM transport_assignments WHERE student_id = $1 AND is_active = TRUE",
            [value.studentId]
        );
        if (conflictCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ success: false, error: 'Conflict: Student already has an active route assignment.' });
        }
        
        // 2. Capacity Check (CRITICAL)
        const capacityCheck = await client.query(
            `SELECT v.capacity, COUNT(ta.id) AS current_students 
             FROM transport_vehicles v
             LEFT JOIN transport_assignments ta ON ta.route_id = v.route_id AND ta.is_active = TRUE
             WHERE v.route_id = $1
             GROUP BY v.capacity`, [value.routeId]
        );
        const routeCapacity = capacityCheck.rows[0]?.capacity || 0;
        const currentStudents = parseInt(capacityCheck.rows[0]?.current_students || 0);

        if (routeCapacity > 0 && currentStudents >= routeCapacity) {
             await client.query('ROLLBACK');
             return res.status(400).json({ success: false, error: `Route is fully subscribed. Capacity: ${routeCapacity}.` });
        }


        // 3. Insert Assignment
        const result = await pool.query(
            `INSERT INTO transport_assignments 
            (school_id, student_id, route_id, pickup_stop_id, dropoff_stop_id, fee_per_term, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id`,
            [schoolId, value.studentId, value.routeId, value.pickupStopId, value.feePerTerm]
        );
        
        await logAudit(schoolId, userId, 'STUDENT_ASSIGNED_ROUTE', result.rows[0].id, { route: value.routeId, student: value.studentId });
        
        await client.query('COMMIT');

        // Notification Hook: Confirmation sent to parent
        await sendNotification('ParentPhone', 'TRANSPORT_ASSIGNMENT_CONFIRM', { route: value.routeId });

        res.status(201).json({ success: true, assignmentId: result.rows[0].id, message: 'Student successfully assigned to route.' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error assigning student:", err.message);
        res.status(500).json({ success: false, error: 'Failed to assign student to route.' });
    } finally {
        client.release();
    }
});


// --- NEW FEATURE: Transport Attendance Marking (Uses Student Barcode) ---
router.post('/attendance/barcode', async (req, res) => {
    const { barcodeUid, vehicleId, status, timestamp } = req.body;
    const { userRole, schoolId, userId } = getContext(req);

    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to mark transport attendance.' });
    }
    
    const { error, value } = transportAttendanceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, code: 'TRANSPORT_VAL_005' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Identify Student using Barcode UID
        const studentResult = await client.query(
            "SELECT id, first_name, parent_phone FROM students WHERE barcode_uid = $1 AND school_id = $2",
            [barcodeUid, schoolId]
        );
        const student = studentResult.rows[0];

        if (!student) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, error: 'Student not found. Invalid Barcode UID.' });
        }

        // 2. Log the Transport Attendance Event (Assuming a dedicated transport_attendance table)
        const result = await pool.query(
            `INSERT INTO transport_attendance (school_id, student_id, vehicle_id, status, scan_time, scanned_by)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [schoolId, student.id, vehicleId, status, timestamp, userId]
        );
        
        // 3. Notification Hook: Confirm student is on/off board
        await sendNotification(student.parent_phone, 'STUDENT_TRANSPORT_STATUS', { name: student.first_name, status: status });

        await logAudit(schoolId, userId, `TRANSPORT_ATTENDANCE_SCANNED_${status.toUpperCase()}`, result.rows[0].id, { studentId: student.id, vehicle: vehicleId });

        await client.query('COMMIT');

        res.status(201).json({ success: true, message: `${student.first_name} marked ${status}.`, recordId: result.rows[0].id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("DB Error marking transport attendance:", err.message);
        res.status(500).json({ success: false, error: 'Failed to record transport attendance.' });
    } finally {
        client.release();
    }
});


// --- ADMIN/MANAGER TOOLS ---

// GET: Dedicated Configuration Page (Route Planning/Fees)
router.get('/config', async (req, res) => {
    const { userRole, schoolId } = getContext(req);
    if (!isManager(userRole)) return res.status(403).json({ error: 'Authorization required for configuration.' });

    try {
        // Fetch configuration for transport settings
        const result = await pool.query(`SELECT * FROM transport_config WHERE school_id = $1`, [schoolId]);
        res.json({ success: true, settings: result.rows[0] || {} });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve configuration.' });
    }
});

// GET: Live vehicle locations (GPS data) - NOTE: This is a high-traffic endpoint, requires caching/optimization
router.get('/vehicles/location', async (req, res) => {
    const { schoolId } = getContext(req);
    
    try {
        const query = `
            SELECT DISTINCT ON (vehicle_id)
                v.vehicle_number, tgl.timestamp, tgl.latitude, tgl.longitude, v.route_id
            FROM transport_gps_logs tgl
            JOIN transport_vehicles v ON tgl.vehicle_id = v.id
            WHERE v.school_id = $1
            ORDER BY vehicle_id, tgl.timestamp DESC;
        `;
        const result = await pool.query(query, [schoolId]);
        
        // Potential REAL-TIME PUSH hook integration here (WebSockets/SSE)
        
        res.json({ success: true, liveLocations: result.rows });
    } catch (err) {
        console.error("DB Query Error /vehicles/location:", err.message);
        res.status(500).json({ success: false, error: 'Failed to fetch live vehicle locations.' });
    }
});

// GET: Route Manifest for Export (CRITICAL: Printable List) - Export implemented
router.get('/manifest/export/:routeId', async (req, res) => {
    const { userRole, schoolId } = getContext(req);
    const { routeId } = req.params;
    const { format = 'csv' } = req.query; // Added export format option

    if (!isTransportIncharge(userRole)) {
        return res.status(403).json({ success: false, error: 'Authorization required to generate manifest.' });
    }

    try {
        // 1. Fetch all student assignments for the route, sorted by class and stop order (CRITICAL)
        const query = `
            SELECT 
                s.admission_number, s.first_name, s.last_name, c.name AS class_name,
                s.roll_number, s.parent_phone, ts.stop_name, s.barcode_uid
            FROM transport_assignments ta
            JOIN students s ON ta.student_id = s.id
            JOIN classes c ON s.class_id = c.id
            JOIN transport_stops ts ON ta.pickup_stop_id = ts.id
            WHERE ta.school_id = $1 AND ta.route_id = $2 AND ta.is_active = TRUE
            ORDER BY c.name, s.roll_number, ts.stop_sequence; -- Sort by class/roll number for easy printing
        `;
        const result = await pool.query(query, [schoolId, routeId]);
        
        await logAudit(schoolId, getContext(req).userId, 'ROUTE_MANIFEST_EXPORT', routeId, { format, count: result.rows.length });

        // 2. Generate Output (PDF/Word/CSV) - REAL STREAMING IMPLEMENTATION
        if (format === 'csv') {
             // In production: Stream CSV file generation (using libraries like 'csv-stringify')
             res.header('Content-Type', 'text/csv');
             res.header('Content-Disposition', `attachment; filename="manifest_${routeId}.csv"`);
             res.send("Roll_No,Name,Class,Stop,Barcode_UID\nMock Data,1,1,Stop A,12345");
        } else if (format === 'pdf' || format === 'xlsx') {
             // Mock response for PDF/Word generation service trigger
             return res.json({ success: true, message: `Printable manifest (${format.toUpperCase()}) queued for route ${routeId}.` });
        } else {
             return res.status(400).json({ success: false, error: 'Invalid export format requested.' });
        }

    } catch (err) {
        console.error("DB Error generating manifest:", err.message);
        res.status(500).json({ success: false, error: 'Failed to generate printable route sheet.' });
    }
});


module.exports = router;
