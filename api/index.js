// SmartGenEduX - Main API Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import module routers
const timetableRoutes = require('./modules/timetable');
const attendanceRoutes = require('./modules/attendance');
const feeManagementRoutes = require('./modules/fee-management');
const arattaiRoutes = require('./modules/whatsapp-alert'); // Assuming the file is still named this
// NOTE: Please ensure you rename 'whatsapp-alert.js' file in modules/ to 'arattai-alerts.js' for consistency later!

const idCardGenerator = require('./modules/id-card-generator');
const cbseRegistration = require('./modules/cbse-registration');

// JWT authentication middleware (template)
const authenticate = (req, res, next) => {
  // TODO: Implement JWT or Supabase Auth verification
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // NOTE: This 401 response is correct but must be improved to extract user context from JWT
    return res.status(401).json({ error: 'No authorization header' });
  }
  // Verify token here
  next();
};

// API Routes

// --- Authentication Endpoints (Client-side handled, API not fully implemented) ---
app.post('/api/auth/login', async (req, res) => {
  // Login is now handled via the client calling Supabase Auth directly.
  return res.status(501).json({ message: 'Login authentication handled by client to Supabase Auth API.' });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/user', authenticate, async (req, res) => {
  res.json({ message: 'User info endpoint (not implemented)' });
});

// --- CRITICAL FIX 1: CONNECT TO LIVE DB FOR DASHBOARD STATS ---
app.get('/api/dashboard-stats', authenticate, async (req, res) => {
  try {
    // If this query succeeds, your DATABASE_URL is correct!
    const result = await pool.query('SELECT COUNT(*) AS total_schools FROM schools');
    
    const stats = {
        // Real query result
        totalSchools: result.rows[0].count || 0,
        // Mock data to ensure dashboard populates for now
        totalStudents: 1247,
        teachingStaff: 89,
        feeCollection: '₹89,500'
    };

    res.json(stats);
  } catch (err) {
    console.error("CRITICAL DB ACCESS ERROR:", err);
    res.status(500).json({ error: 'Failed to connect to PostgreSQL. Check Vercel DATABASE_URL and Supabase Firewall rules.' });
  }
});

// --- FIX 2: IMPLEMENT LIVE DB QUERY FOR SCHOOLS (TEST RLS) ---
app.get('/api/schools', authenticate, async (req, res) => {
  try {
    // This fetches schools. RLS should filter by user's school_id.
    const result = await pool.query('SELECT id, name, subscription_plan FROM schools');
    res.json({ success: true, schools: result.rows });
  } catch (err) {
    console.error("DB Query Error /api/schools:", err);
    res.status(500).json({ error: 'Failed to fetch schools from DB. Check RLS policies.' });
  }
});

// ... (other template endpoints left as mock/placeholder for now)

// --- Module-specific routes ---
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fee-management', feeManagementRoutes);

// --- CRITICAL FIX 3: MAP WHATSAPP TO ARATTAI ROUTE ---
app.use('/api/arattai', arattaiRoutes); 

// ID Card Generator routes (kept as is)
app.get('/api/id-card-requests', idCardGenerator.getIdCardRequests);
// ... (rest of ID Card routes)

// CBSE Registration routes (kept as is)
app.get('/api/cbse-registrations', cbseRegistration.getCbseRegistrations);
// ... (rest of CBSE routes)

// --- CRITICAL FIX 4: UPDATE MODULE STATUS LIST ---
app.get('/api/modules/status', (req, res) => {
  const modules = [
    { id: 'timetable', name: 'Timetable Management', status: 'active', usage: 89, lastUpdated: '2024-12-29' },
    { id: 'attendance', name: 'Attendance System', status: 'active', usage: 94, lastUpdated: '2024-12-29' },
    { id: 'fee_management', name: 'Fee Management', status: 'active', usage: 78, lastUpdated: '2024-12-29' },
    { id: 'substitution', name: 'Substitution Log', status: 'active', usage: 67, lastUpdated: '2024-12-28' },
    { id: 'behavior', name: 'Behavior Tracker', status: 'active', usage: 73, lastUpdated: '2024-12-28' },
    { id: 'invigilation', name: 'Invigilation Duty', status: 'active', usage: 45, lastUpdated: '2024-12-27' },
    { id: 'distribution', name: 'Student Distribution', status: 'active', usage: 82, lastUpdated: '2024-12-29' },
    { id: 'reports', name: 'Report Tracker', status: 'active', usage: 91, lastUpdated: '2024-12-29' },
    { id: 'qp_generator', name: 'Question Paper Generator', status: 'active', usage: 56, lastUpdated: '2024-12-26' },
    { id: 'q_extractor', name: 'Question Extractor', status: 'active', usage: 34, lastUpdated: '2024-12-25' },
    { id: 'admission', name: 'Admission Management', status: 'active', usage: 23, lastUpdated: '2024-12-20' },
    { id: 'pdf_tools', name: 'PDF Tools', status: 'active', usage: 67, lastUpdated: '2024-12-28' },
    { id: 'events', name: 'Event Management', status: 'active', usage: 45, lastUpdated: '2024-12-24' },
    { id: 'arattai', name: 'Arattai Communication', status: 'active', usage: 88, lastUpdated: '2024-12-29' }, // <-- RENAMED entry
    { id: 'vipu_ai', name: 'Vipu AI Assistant', status: 'active', usage: 72, lastUpdated: '2024-12-29' },
    { id: 'id_card_generator', name: 'ID Card Generator', status: 'active', usage: 45, lastUpdated: '2024-12-29' },
    { id: 'cbse_registration', name: 'CBSE Registration Process', status: 'active', usage: 62, lastUpdated: '2024-12-29' },
    { id: 'timesubbehave_ai', name: 'Timesubbehave AI Premium', status: 'premium', usage: 34, lastUpdated: '2024-12-28' },
    { id: 'fee_tally', name: 'Fee Management with Tally', status: 'premium', usage: 23, lastUpdated: '2024-12-27' }
  ];
  res.json(modules);
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartGenEduX Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API Base: http://localhost:${PORT}/api`);
});

module.exports = app;
