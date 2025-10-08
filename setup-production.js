#!/usr/bin/env node

/**
 * SmartGenEduX Production Setup Script
 * Automatically configures the platform for production deployment
 * * NOTE: Paths updated to use 'API' instead of 'server' to match project structure.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 SmartGenEduX Production Setup');
console.log('==================================\n');

// Configuration options
const config = {
    mode: 'production', // 'demo' or 'production'
    database: {
        type: 'supabase', // 'supabase' or 'postgresql'
        url: process.env.DATABASE_URL || ''
    },
    deployment: {
        platform: 'vercel', // 'vercel', 'netlify', or 'railway'
        domain: process.env.CUSTOM_DOMAIN || ''
    }
};

// Update configuration files
function updateConfig() {
    console.log('📝 Updating configuration files...');
    
    // Update client config (Creates client/js/config.js)
    const clientConfigPath = path.join(__dirname, 'client', 'dist', 'js', 'config.js'); // Changed path for final client build dir
    const clientConfig = `
// SmartGenEduX Configuration
const CONFIG = {
    mode: '${config.mode}',
    apiBaseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://' + window.location.hostname + '/api',
    isDemoMode: ${config.mode === 'demo'},
    features: {
        realTimeSync: ${config.mode === 'production'},
        emailNotifications: ${config.mode === 'production'},
        paymentGateway: ${config.mode === 'production'},
        multiTenant: true,
        aiFeatures: true
    },
    ui: {
        showDemoData: ${config.mode === 'demo'},
        enableAdvancedFeatures: ${config.mode === 'production'},
        showSuperAdminFeatures: true
    }
};

// Export for modules
window.SMARTGEN_CONFIG = CONFIG;
`;
    
    fs.writeFileSync(clientConfigPath, clientConfig);
    console.log('✅ Client configuration updated');
    
    // Update server config (Creates API/config.js)
    const serverConfigPath = path.join(__dirname, 'API', 'config.js'); // **FIXED PATH**
    const serverConfig = `
module.exports = {
    mode: '${config.mode}',
    database: {
        type: '${config.database.type}',
        url: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production'
    },
    auth: {
        sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
        tokenExpiry: '24h',
        bcryptRounds: 12
    },
    features: {
        emailService: process.env.NODE_ENV === 'production',
        smsService: process.env.NODE_ENV === 'production',
        paymentGateway: process.env.NODE_ENV === 'production',
        fileUpload: true,
        aiProcessing: true
    },
    limits: {
        fileUploadSize: '10MB',
        requestsPerMinute: 100,
        maxSchools: config.mode === 'demo' ? 1 : 1000
    }
};
`;
    
    fs.writeFileSync(serverConfigPath, serverConfig);
    console.log('✅ Server configuration (API/config.js) created');
}

// Create database connection helper
function createDatabaseHelper() {
    console.log('🗄️ Creating database connection helper...');
    
    // Creates API/database.js
    const dbHelperPath = path.join(__dirname, 'API', 'database.js'); // **FIXED PATH**
    const dbHelper = `
const { Pool } = require('pg');

class DatabaseManager {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        
        // Test connection
        this.testConnection();
    }
    
    async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log('✅ Database connected successfully');
            client.release();
        } catch (err) {
            console.error('❌ Database connection failed:', err.message);
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
        }
    }
    
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
            return res;
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }
    }
    
    async getClient() {
        return await this.pool.connect();
    }
    
    async close() {
        await this.pool.end();
    }
}

module.exports = new DatabaseManager();
`;
    
    fs.writeFileSync(dbHelperPath, dbHelper);
    console.log('✅ Database helper (API/database.js) created');
}

// Create production package.json
function createProductionPackage() {
    console.log('📦 Creating production package.json...');
    
    const packagePath = path.join(__dirname, 'package.json');
    const existingPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const productionPackage = {
        ...existingPackage,
        scripts: {
            ...existingPackage.scripts,
            "start": "node API/index.js", // **FIXED PATH**
            "build": "npm run build:client && npm run build:server",
            "build:client": "cd client && npm run build",
            "build:server": "echo 'Server build complete'",
            "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
            "dev:server": "nodemon API/index.js", // **FIXED PATH**
            "dev:client": "cd client && npm run dev",
            "deploy": "npm run build && vercel --prod",
            "test": "npm run test:client && npm run test:server",
            "test:client": "cd client && npm test",
            "test:server": "cd API && npm test" // **FIXED PATH**
        },
        dependencies: {
            ...existingPackage.dependencies,
            "pg": "^8.11.3",
            "bcrypt": "^5.1.1",
            "jsonwebtoken": "^9.0.2",
            "multer": "^1.4.5",
            "nodemailer": "^6.9.8",
            // Dependencies already in original: express, cors, dotenv, helmet, express-rate-limit
        },
        engines: {
            "node": ">=18.0.0",
            "npm": ">=8.0.0"
        }
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(productionPackage, null, 2));
    console.log('✅ Production package.json created');
}

// Create Vercel configuration
function createVercelConfig() {
    console.log('🌐 Creating Vercel configuration...');
    
    const vercelConfigPath = path.join(__dirname, 'vercel.json');
    const vercelConfig = {
        "version": 2,
        "name": "smartgenedux-production",
        "builds": [
            {
                "src": "API/index.js", // **FIXED PATH**
                "use": "@vercel/node"
            },
            {
                "src": "client/dist/**",
                "use": "@vercel/static"
            }
        ],
        "routes": [
            {
                "src": "/api/(.*)",
                "dest": "/API/index.js" // **FIXED PATH**
            },
            {
                "src": "/(.*)",
                "dest": "/client/dist/$1"
            }
        ],
        "env": {
            "NODE_ENV": "production"
        },
        "functions": {
            "API/index.js": { // **FIXED PATH**
                "maxDuration": 30
            }
        }
    };
    
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    console.log('✅ Vercel configuration created');
}

// Create environment template
function createEnvTemplate() {
    console.log('🔐 Creating environment template...');
    
    const envTemplatePath = path.join(__dirname, '.env.example');
    const envTemplate = `# SmartGenEduX Production Environment Variables

# Database Configuration (CRITICAL: MUST BE FILLED)
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartgenedux
# For Supabase: postgresql://postgres.[project-ref]:[PASSWORD]@[host-url].supabase.com:5432/postgres

# Application Settings
NODE_ENV=production
SESSION_SECRET=your-32-character-random-string-here
API_BASE_URL=https://your-domain.vercel.app

# Authentication (CRITICAL: MUST BE FILLED IF USING JWT)
JWT_SECRET=your-jwt-secret-here
BCRYPT_ROUNDS=12

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# AI Services (Optional)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# Monitoring (Optional)
SENTRY_DSN=https://...
ANALYTICS_ID=GA_...
`;
    
    fs.writeFileSync(envTemplatePath, envTemplate);
    console.log('✅ Environment template created');
}

// Main setup function
async function setupProduction() {
    // ... (Main function body remains the same, executing all the above functions)
}

// Run setup
if (require.main === module) {
    setupProduction();
}

module.exports = { setupProduction, config };
