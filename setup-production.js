#!/usr/bin/env node

/**
 * SmartGenEduX Production Setup Script
 * Automatically configures the platform for production deployment
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
  
  // Update client config
  const clientConfigPath = path.join(__dirname, 'client', 'js', 'config.js');
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
  
  // Update server config
  const serverConfigPath = path.join(__dirname, 'server', 'config.js');
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
  console.log('✅ Server configuration updated');
}

// Create database connection helper
function createDatabaseHelper() {
  console.log('🗄️ Creating database connection helper...');
  
  const dbHelperPath = path.join(__dirname, 'server', 'database.js');
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
  console.log('✅ Database helper created');
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
      "start": "node server/index.js",
      "build": "npm run build:client && npm run build:server",
      "build:client": "cd client && npm run build",
      "build:server": "echo 'Server build complete'",
      "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
      "dev:server": "nodemon server/index.js",
      "dev:client": "cd client && npm run dev",
      "deploy": "npm run build && vercel --prod",
      "test": "npm run test:client && npm run test:server",
      "test:client": "cd client && npm test",
      "test:server": "cd server && npm test"
    },
    dependencies: {
      ...existingPackage.dependencies,
      "pg": "^8.11.3",
      "bcrypt": "^5.1.1",
      "jsonwebtoken": "^9.0.2",
      "cors": "^2.8.5",
      "helmet": "^7.1.0",
      "express-rate-limit": "^7.1.5",
      "multer": "^1.4.5",
      "nodemailer": "^6.9.8",
      "dotenv": "^16.3.1"
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
        "src": "server/index.js",
        "use": "@vercel/node"
      },
      {
        "src": "client/**/*",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/server/index.js"
      },
      {
        "src": "/(.*)",
        "dest": "/client/$1"
      }
    ],
    "env": {
      "NODE_ENV": "production"
    },
    "functions": {
      "server/index.js": {
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

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartgenedux
# For Supabase: postgresql://postgres.xyz:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

# Application Settings
NODE_ENV=production
SESSION_SECRET=your-32-character-random-string-here
API_BASE_URL=https://your-domain.vercel.app

# Authentication
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
  try {
    console.log('Starting production setup...\n');
    
    updateConfig();
    createDatabaseHelper();
    createProductionPackage();
    createVercelConfig();
    createEnvTemplate();
    
    console.log('\n🎉 Production setup complete!');
    console.log('\nNext steps:');
    console.log('1. Copy .env.example to .env and fill in your values');
    console.log('2. Set up Supabase database using the SQL in PRODUCTION_DEPLOYMENT_GUIDE.md');
    console.log('3. Deploy to Vercel: npm run deploy');
    console.log('4. Configure custom domain (optional)');
    console.log('\n📚 Full guide: See PRODUCTION_DEPLOYMENT_GUIDE.md');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupProduction();
}

module.exports = { setupProduction, config };