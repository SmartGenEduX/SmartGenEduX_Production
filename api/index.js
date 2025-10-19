// SmartGenEduX - Main API Server - PRODUCTION VERSION
require('dotenv').config({ path: '.env.production' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken'); 
const rateLimit = require('express-rate-limit'); 
const { performance } = require('perf_hooks'); 
const helmet = require('helmet'); 
const { v4: uuidv4 } = require('uuid');

// Supabase SDK initialization
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CORS CONFIGURATION - UPDATE WITH YOUR DOMAIN
// ============================================
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://smart-gen-edu-x-production.vercel.app', // ⚠️ REPLACE WITH YOUR ACTUAL VERCEL DOMAIN
    // Add more domains if needed
];

// ============================================
// DATABASE CONNECTION
// ============================================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// ============================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ============================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://*"],
            connectSrc: ["'self'", "https://*.supabase.co"],
            frameAncestors: ["'self'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`🚫 CORS blocked origin: ${origin}`);
            callback(new Error('CORS policy violation: Origin not allowed'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Rate Limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        code: 'SEC_RATE_001', 
        error: "Too many requests. Please try again later." 
    }
});
app.use(globalLimiter);

// Sensitive Endpoint Limiter (for auth, payments, etc.)
const sensitiveLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // More restrictive
    message: { 
        success: false, 
        code: 'SEC_RATE_002', 
        error: "Too many login attempts. Please wait 5 minutes." 
    }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// JWT AUTHENTICATION MIDDLEWARE
// ============================================
function authMiddleware(req, res, next) {
    req.startTime = performance.now();
    req.traceId = uuidv4();
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            error: 'Authorization header missing', 
            code: 'AUTH_MISSING' 
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Token missing', 
            code: 'AUTH_MISSING' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid token claims', 
                code: 'AUTH_INVALID_CLAIMS' 
            });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Failed:', err.message);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: 'Token expired', 
                code: 'AUTH_EXPIRED' 
            });
        }
        
        return res.status(401).json({ 
            success: false,
            error: 'Invalid token', 
            code: 'AUTH_INVALID' 
        });
    }
}

// ============================================
// MODULE IMPORTS
// ============================================
const authRoutes = require('./modules/auth')(supabase, pool);
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
const userManagementRoutes = require('./modules/adminUsers')(supabase);

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: process.env.DATABASE_URL ? 'configured' : 'unconfigured',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Auth routes (login, register) - with rate limiting
app.use('/api/auth', sensitiveLimiter, authRoutes);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// ============================================
// PROTECTED API ROUTES (Require Authentication)
// ============================================

// Apply authentication middleware to all /api/v1 routes
app.use('/api/v1', authMiddleware);

// Dashboard stats endpoint
app.get('/api/v1/dashboard-stats', async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const schoolId = req.user.school_id;

        let stats = {};

        if (userRole === 'super_admin') {
            // Super admin sees all schools
            const schoolsResult = await pool.query('SELECT COUNT(*) AS total FROM schools');
            const teachersResult = await pool.query('SELECT COUNT(*) AS total FROM teachers');
            const studentsResult = await pool.query('SELECT COUNT(*) AS total FROM students');
            
            stats = {
                totalSchools: parseInt(schoolsResult.rows[0]?.total || 0),
                totalTeachers: parseInt(teachersResult.rows[0]?.total || 0),
                totalStudents: parseInt(studentsResult.rows[0]?.total || 0),
                feeCollection: '₹0' // Implement real fee calculation
            };
        } else if (userRole === 'school_admin') {
            // School admin sees their school data
            const teachersResult = await pool.query(
                'SELECT COUNT(*) AS total FROM teachers WHERE school_id = $1',
                [schoolId]
            );
            const studentsResult = await pool.query(
                'SELECT COUNT(*) AS total FROM students WHERE school_id = $1',
                [schoolId]
            );
            const classesResult = await pool.query(
                'SELECT COUNT(*) AS total FROM classes WHERE school_id = $1',
                [schoolId]
            );
            
            stats = {
                totalStudents: parseInt(studentsResult.rows[0]?.total || 0),
                totalTeachers: parseInt(teachersResult.rows[0]?.total || 0),
                totalClasses: parseInt(classesResult.rows[0]?.total || 0),
                feeCollection: '₹0'
            };
        } else if (userRole === 'teacher') {
            // Teacher sees their assigned data
            const classesResult = await pool.query(
                'SELECT COUNT(DISTINCT class_id) AS total FROM timetable WHERE teacher_profile_id = $1',
                [userId]
            );
            const studentsResult = await pool.query(
                `SELECT COUNT(DISTINCT s.id) AS total 
                 FROM students s 
                 JOIN classes c ON s.class_id = c.id 
                 WHERE c.class_teacher_profile_id = $1`,
                [userId]
            );
            
            stats = {
                myStudents: parseInt(studentsResult.rows[0]?.total || 0),
                myClasses: parseInt(classesResult.rows[0]?.total || 0),
                pendingAssessments: 0,
                attendanceRate: '0%'
            };
        }

        res.json(stats);
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch dashboard statistics',
            code: 'STATS_ERROR'
        });
    }
});

// Module routes
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

// ============================================
// REQUEST LOGGING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
    if (req.startTime) {
        const duration = performance.now() - req.startTime;
        const logEntry = {
            level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            user: req.user?.id || 'anonymous',
            schoolId: req.user?.school_id || null,
            responseTimeMs: duration.toFixed(2),
            traceId: req.traceId,
        };
        console.log(JSON.stringify(logEntry));
    }
    next();
});

// ============================================
// CATCH-ALL ROUTE FOR SPA
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ GLOBAL ERROR:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        traceId: req.traceId
    });
    
    res.status(err.status || 500).json({ 
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message,
        code: err.code || 'ERR_GLOBAL_500',
        traceId: req.traceId
    });
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('==========================================');
    console.log('🚀 SmartGenEduX Server Started');
    console.log('==========================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
    console.log('==========================================');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('✅ Express server closed');
        
        pool.end(() => {
            console.log('✅ Database pool closed');
            process.exit(0);
        });
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Forcing shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

module.exports = app; // Export for testing
