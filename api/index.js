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

// JWT authentication middleware (template)
const authenticate = (req, res, next) => {
  // TODO: Implement JWT or Supabase Auth verification
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  // Verify token here
  next();
};

// API Routes

// Authentication (template, replace with Supabase Auth or JWT)
app.post('/api/auth/login', async (req, res) => {
  // TODO: Implement real authentication using Supabase Auth or JWT
  return res.status(501).json({ message: 'Login not implemented. Use Supabase Auth.' });
});

app.post('/api/auth/logout', (req, res) => {
  // TODO: Implement logout logic if needed
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/user', authenticate, async (req, res) => {
  // TODO: Return user info from Supabase Auth
  res.json({ message: 'User info endpoint (not implemented)' });
});

// Dashboard stats (production: fetch from DB)
app.get('/api/dashboard-stats', authenticate, async (req, res) => {
  try {
    // Example: Fetch stats from DB
    const { role = 'school_admin' } = req.query;
    let stats = {};
    if (role === 'super_admin') {
      // Replace with real queries
      const result = await pool.query('SELECT COUNT(*) AS total_schools FROM schools');
      stats.totalSchools = result.rows[0].total_schools;
      // ...add more queries for students, teachers, revenue, etc.
    } else if (role === 'school_admin') {
      // Replace with real queries
      // Example: SELECT * FROM schools WHERE id = $1
      stats = {};
    } else if (role === 'teacher') {
      // Replace with real queries
      stats = {};
    }
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Schools management
app.get('/api/schools', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schools');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

app.get('/api/schools/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM schools WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch school' });
  }
});

// Revenue analytics (template)
app.get('/api/revenue', authenticate, async (req, res) => {
  try {
    // TODO: Replace with real revenue queries
    res.json({ message: 'Revenue endpoint not implemented' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

// Students management
app.get('/api/students', authenticate, async (req, res) => {
  try {
    // TODO: Replace with real student queries
    res.json({ message: 'Students endpoint not implemented' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/api/students/:id', authenticate, async (req, res) => {
  try {
    // TODO: Replace with real student queries
    res.json({ message: 'Student by ID endpoint not implemented' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Teachers management
app.get('/api/teachers', authenticate, async (req, res) => {
  try {
    // TODO: Replace with real teacher queries
    res.json({ message: 'Teachers endpoint not implemented' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Classes management
app.get('/api/classes', authenticate, async (req, res) => {
  try {
    // TODO: Replace with real class queries
    res.json({ message: 'Classes endpoint not implemented' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Import new module handlers
const idCardGenerator = require('./modules/id-card-generator');
const cbseRegistration = require('./modules/cbse-registration');

// Module-specific routes
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fee-management', feeManagementRoutes);

// ID Card Generator routes
app.get('/api/id-card-requests', idCardGenerator.getIdCardRequests);
app.post('/api/id-card-requests', idCardGenerator.submitIdCardRequest);
app.post('/api/id-card-requests/upload-photo', idCardGenerator.uploadPhoto);
app.post('/api/id-card-requests/:requestId/approve', idCardGenerator.approveIdCardRequest);
app.post('/api/id-card-requests/:requestId/generate', idCardGenerator.generateIdCard);
app.get('/api/id-cards', idCardGenerator.getGeneratedIdCards);
app.get('/api/id-card-template', idCardGenerator.getIdCardTemplate);
app.get('/api/id-card-analytics', idCardGenerator.getIdCardAnalytics);

// CBSE Registration routes
app.get('/api/cbse-registrations', cbseRegistration.getCbseRegistrations);
app.post('/api/cbse-registrations', cbseRegistration.submitCbseRegistration);
app.post('/api/cbse-registrations/upload-document', cbseRegistration.uploadDocument);
app.post('/api/cbse-registrations/:registrationId/teacher-verification', cbseRegistration.teacherVerification);
app.post('/api/cbse-registrations/:registrationId/principal-approval', cbseRegistration.principalApproval);
app.post('/api/cbse-registrations/:registrationId/submit-cbse', cbseRegistration.submitToCbse);
app.get('/api/cbse-registrations/required-documents/:class', cbseRegistration.getRequiredDocuments);
app.get('/api/cbse-analytics', cbseRegistration.getCbseAnalytics);
app.get('/api/cbse-registrations/:registrationId', cbseRegistration.getRegistrationById);

// Module status endpoints
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
    { id: 'whatsapp', name: 'WhatsApp Alerts', status: 'active', usage: 88, lastUpdated: '2024-12-29' },
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