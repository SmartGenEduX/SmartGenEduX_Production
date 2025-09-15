// SmartGenEduX Configuration
// 2-in-1 Package: Demo Mode (without Supabase) / Production Mode (with Supabase)

const config = {
  // Set to 'demo' for standalone demo or 'production' for Supabase connection
  mode: 'production', // Change to 'production' when deploying with Supabase
  
  // Demo Mode Settings
  demo: {
    apiUrl: '/api',
    features: {
      realTimeSync: false,
      cloudStorage: false,
      multiTenant: false
    }
  },
  
  // Production Mode Settings (Supabase)
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://your-supabase-url.supabase.co',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    features: {
      realTimeSync: true,
      cloudStorage: true,
      multiTenant: true
    }
  }
};

// Get current configuration
function getConfig() {
  return config[config.mode];
}

// Check if running in demo mode
function isDemoMode() {
  return config.mode === 'demo';
}

// Check if running in production mode
function isProductionMode() {
  return config.mode === 'production';
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { config, getConfig, isDemoMode, isProductionMode };
}
