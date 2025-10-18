// SmartGenEduX Configuration - Production Mode Only

const config = {
  mode: 'production',

  production: {
    // Base URL for your backend API
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://smart-gen-edu-x-production.vercel.app/api/v1',

    // Supabase Public URL for frontend (no sensitive keys here)
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.waqttehjaifdkcbovund.supabase.co',

    // Public anon key for safe client-side access to Supabase APIs
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhcXR0ZWhqYWlmZGtjYm92dW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk1ODIsImV4cCI6MjA2NTIwNTU4Mn0.nv1_UIuXl-wSfkfTMvwCUsJTGO65TwZ2D8a571ELKJ0',

    // Feature toggles for your application
    features: {
      realTimeSync: true,
      cloudStorage: true,
      multiTenant: true,
    }
  }
};

/**
 * Returns the active production config object
 * @returns {object} config.production
 */
function getConfig() {
  return config.production;
}

/**
 * Indicates if the app is in demo mode (false here).
 * @returns {boolean}
 */
function isDemoMode() {
  return false;
}

/**
 * Indicates if the app is running in production mode (true here).
 * @returns {boolean}
 */
function isProductionMode() {
  return true;
}

// Export for use in CommonJS or Node.js apps
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { config, getConfig, isDemoMode, isProductionMode };
}
