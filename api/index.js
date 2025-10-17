// SmartGenEduX - Main API Server - FINAL PRODUCTION VERSION (V1)
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken'); 
const rateLimit = require('express-rate-limit'); 
const { performance } = require('perf_hooks'); 
const helmet = require('helmet'); 
const { v4: uuidv4 } = require('uuid'); // For generating trace IDs

const app = express();
const PORT = process.env.PORT || 3000;

// Whitelist configuration for CORS (Add your Vercel domains here)
const allowedOrigins = [
    'http://localhost:3000', // Local Dev
    'https://your-vercel-domain.vercel.app', // Your live domain
    // Add other frontend domains if necessary
];

// --- 1. POSTGRESQL CONNECTION ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, 
    idleTimeoutMillis: 30000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- 2. SECURITY & PERFORMANCE MIDDLEWARE ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // CRITICAL: We enforce 'self' but allow necessary CDNs and data sources
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow CDN scripts
            styleSrc: ["'self'", "'unsafe-inline'"], // Keep inline styles for now (if FE requires)
            imgSrc: ["'self'", "data:", "https://*"], // Allow data URIs and external images
            connectSrc: ["'self'", "https://*.supabase.co"], // Allow API communication
            frameAncestors: ["'self'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// Global Rate Limiter Configuration
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, 
    keyGenerator: (req) => req.ip,
    message: { success: false, code: 'SEC_RATE_001', error: "Too many requests. Limit exceeded." }
});
app.use(globalLimiter);

// Sensitive Endpoint Limiter
const sensitiveLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 300,
    keyGenerator: (req) => req.ip,
    message: { success: false, code: 'SEC_RATE_002', error: "Too many sensitive requests. Try again later." }
});

// ENHANCED JWT Authentication Middleware
function authMiddleware(req, res, next) {
    req.startTime = performance.now();
    req.traceId = uuidv4();
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Authorization header missing', code: 'AUTH_MISSING' });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing', code: 'AUTH_MISSING' });

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET); 
        if (!decoded.tenant || !decoded.role || !decoded.id) {
            return res.status(401).json({ error: 'Token invalid: Missing context claims.', code: 'AUTH_INVALID_CLAIMS' });
        }
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('JWT Verification Failed:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token', code: 'AUTH_EXPIRED' });
    }
}

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. MODULE IMPORTS (All 15+ Modules) ---
const authRoutes = require('./modules/auth'); 
const settingsManager = require('./modules/system_settings_api');
const timetableRoutes = require('./modules/timetable');
const attendanceRoutes = require('./modules/attendance');
const feeManagementRoutes = require('./modules/documentation');
const substitutionRoutes = require('./modules/substitution-log');
const reportTrackerRoutes = require('./modules/report-tracker');
const admissionRoutes = require('./modules/admission-management');
const qpgRoutes = require('./modules/questionpaper-generation');
const qeRoutes = require('./modules/question-extractor');
const idCardRoutes = require('./modules/id-card-generator');
const cbseRoutes = require('./modules/cbse-registration');
const libraryManager = require('./modules/library-manager');
const transportManager = require('./modules/transport-manager');
const leaveConfig = require('./modules/leave-config');
const vipuAi = require('./modules/vipu-ai');
const arattaiManager = require('./modules/arattai-manager'); 
const schoolEventLogRoutes = require('./modules/school-event-log'); 
const userManagementRoutes = require('./modules/adminUsers');

// --- 4. API ROUTES (Authenticated & Public) ---
// PUBLIC / UNPROTECTED AUTH ROUTES
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'configured' : 'unconfigured' }));
app.use('/api/auth', authRoutes); // Login and Register endpoints

// API Versioning and Authentication Guard
app.use('/api/v1', authMiddleware);

// CORE MODULES - Mounted under /api/v1
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/fee-management', sensitiveLimiter, feeManagementRoutes);
app.use('/api/v1/substitution', substitutionRoutes);
app.use('/api/v1/reports', reportTrackerRoutes);
app.use('/api/v1/admission', admissionRoutes);
app.use('/api/v1/qpg', qpgRoutes);
app.use('/api/v1/qe', qeRoutes);
app.use('/api/v1/id-card', idCardRoutes);
app.use('/api/v1/cbse', cbseRoutes);
app.use('/api/v1/school-events', schoolEventLogRoutes); 
app.use('/api/v1/library', libraryManager);
app.use('/api/v1/transport', transportManager);
app.use('/api/v1/leave-config', leaveConfig);
app.use('/api/v1/vipu-ai', vipuAi);
app.use('/api/v1/arattai', arattaiManager); 
app.use('/api/v1/settings', settingsManager); 
app.use('/api/v1/admin', userManagementRoutes);

// Dashboard stats (Protected by authMiddleware)
app.get('/api/v1/dashboard-stats', async (req, res) => {
  try {
    const schoolsResult = await pool.query('SELECT COUNT(*) AS total_schools FROM schools');
    const teachersResult = await pool.query('SELECT COUNT(*) AS total_teachers FROM teachers');
    const stats = {
        totalSchools: schoolsResult.rows[0].total_schools || 0,
        totalTeachers: teachersResult.rows[0].total_teachers || 0,
        totalStudents: 0, 
        feeCollection: '₹0' 
    };
    res.json(stats);
  } catch (err) {
    console.error("DASHBOARD DB ACCESS FAILURE:", err);
    res.status(500).json({ error: 'Database initialization failed. Check Vercel DATABASE_URL.' });
  }
});

// Global post-request logging and error handling
app.use((req, res, next) => {
    if (req.startTime) {
        const duration = performance.now() - req.startTime;
        console.log(JSON.stringify({
            level: res.statusCode >= 500 ? 'error' : 'info',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            user: req.user?.id || 'anon',
            schoolId: req.user?.tenant,
            responseTimeMs: duration.toFixed(2),
            traceId: req.traceId,
        }));
    }
    next();
});

// Catch-all route for SPA (Serves the client frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('GLOBAL APPLICATION ERROR:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'An unhandled exception occurred in the API server.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    code: 'ERR_GLOBAL_500'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartGenEduX Server running on port ${PORT}`);
  console.log(`🔧 API Base: http://localhost:${PORT}/api/v1`);
});

// Graceful Shutdown Hook
const gracefulShutdown = () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
        console.log('Express server closed.');
        pool.end(() => {
            console.log('PostgreSQL connection pool closed.');
            process.exit(0);
        });
    });
    setTimeout(() => {
        console.error('Forcing shutdown after timeout.');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
