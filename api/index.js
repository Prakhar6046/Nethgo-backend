// Vercel serverless function entry point
// This imports the Express app from api/app.js (created during build)

// Use a try-catch to handle the require gracefully
let app;

try {
  // Try to require app.js from the same directory
  // This file is created by scripts/copy-assets.js during build
  const appModule = require('./app.js');
  
  // Handle both ES6 default export and CommonJS export
  app = appModule.default || appModule;
  
  if (!app) {
    throw new Error(`Express app not found in module. Available keys: ${Object.keys(appModule).join(', ')}`);
  }
  
  console.log('✓ Express app loaded successfully from api/app.js');
} catch (error) {
  console.error('✗ ERROR loading Express app:', error.message);
  console.error('Error code:', error.code);
  console.error('__dirname:', __dirname);
  console.error('process.cwd():', process.cwd());
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('The api/app.js file was not found. Make sure the build process completed successfully.');
    console.error('Expected location:', require('path').join(__dirname, 'app.js'));
  }
  
  // Return an error handler
  app = (req, res) => {
    res.status(500).json({
      error: 'Server initialization failed',
      message: `Could not load Express app: ${error.message}`,
      code: error.code
    });
  };
}

// Export the Express app directly for Vercel
module.exports = app;

