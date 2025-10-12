// SmartGenEduX Configuration - Production Mode Only

const config = {
  mode: 'production',

  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://your-supabase-url.supabase.co',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    features: {
      realTimeSync: true,
      cloudStorage: true,
      multiTenant: true,
    }
  }
};

function getConfig() {
  return config.production;
}

function isDemoMode() {
  return false;
}

function isProductionMode() {
  return true;
}

// Export the config for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { config, getConfig, isDemoMode, isProductionMode };
}
