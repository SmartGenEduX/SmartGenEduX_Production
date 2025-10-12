#!/usr/bin/env node

/**
 * SmartGenEduX Production Setup Script
 * Automatically configures the platform for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 SmartGenEduX Production Setup');
console.log('==================================\n');

const config = {
  mode: 'production',
  database: {
    type: 'supabase',
    url: process.env.DATABASE_URL || '',
  },
  deployment: {
    platform: 'vercel',
    domain: process.env.CUSTOM_DOMAIN || '',
  },
};

function updateConfig() {
  console.log('📝 Updating configuration files...');

  const clientConfigPath = path.join(__dirname, 'client', 'dist', 'js', 'config.js');
  const clientConfig = `
// SmartGenEduX Configuration
const CONFIG = {
  mode: '${config.mode}',
  apiBaseUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://' + window.location.hostname + '/api',
  isDemoMode: false,
  features: {
    realTimeSync: true,
    emailNotifications: true,
    paymentGateway: true,
    multiTenant: true,
    aiFeatures: true,
  },
  ui: {
    showDemoData: false,
    enableAdvancedFeatures: true,
    showSuperAdminFeatures: true,
  }
};

// Export for modules
window.SMARTGEN_CONFIG = CONFIG;
`;
  fs.writeFileSync(clientConfigPath, clientConfig);
  console.log('✅ Client configuration updated');

  const serverConfigPath = path.join(__dirname, 'API', 'config.js');
  const serverConfig = `
module.exports = {
  mode: '${config.mode}',
  database: {
    type: '${config.database.type}',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
  },
  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    tokenExpiry: '24h',
    bcryptRounds: 12,
  },
  features: {
    emailService: process.env.NODE_ENV === 'production',
    smsService: process.env.NODE_ENV === 'production',
    paymentGateway: process.env.NODE_ENV === 'production',
    fileUpload: true,
    aiProcessing: true,
  },
  limits: {
    fileUploadSize: '10MB',
    requestsPerMinute: 100,
    maxSchools: 1000,
  },
};
`;
  fs.writeFileSync(serverConfigPath, serverConfig);
  console.log('✅ Server configuration (API/config.js) created');
}

function createDatabaseHelper() {
  console.log('🗄️ Creating database connection helper...');

  const dbHelperPath = path.join(__dirname, 'API', 'database.js');
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

    this.testConnection();
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      if (process.env.NODE_ENV === 'production') process.exit(1);
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

function createEnvTemplate() {
  console.log('🔐 Creating environment template...');

  const envTemplatePath = path.join(__dirname, '.env.example');
  const envTemplate = `# SmartGenEduX Production Environment Variables

DATABASE_URL=postgresql://postgres:password@localhost:5432/smartgenedux
NODE_ENV=production
SESSION_SECRET=your-32-character-random-string
JWT_SECRET=your-jwt-secret
BCRYPT_ROUNDS=12

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

OPENAI_API_KEY=sk-...

SENTRY_DSN=

ANALYTICS_ID=
`;

  fs.writeFileSync(envTemplatePath, envTemplate);
  console.log('✅ Environment template created');
}

function main() {
  updateConfig();
  createDatabaseHelper();
  createEnvTemplate();
  console.log('\n🎉 Production setup completed successfully!');
}

if (require.main === module) {
  main();
}

module.exports = {
  updateConfig,
  createDatabaseHelper,
  createEnvTemplate,
  main,
};
