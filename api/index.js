// Vercel serverless function entry point
// This imports the Express app from api/build/index.js
// The entire build directory is copied to api/build during build process

let app;

try {
  // Require from api/build/index.js
  // The entire build directory structure is copied here, so all relative imports work
  const appModule = require('./build/index.js');
  
  // Handle both ES6 default export and CommonJS export
  app = appModule.default || appModule;
  
  if (!app) {
    throw new Error(`Express app not found in module. Available keys: ${Object.keys(appModule).join(', ')}`);
  }
  
  console.log('✓ Express app loaded successfully from api/build/index.js');
} catch (error) {
  console.error('✗ ERROR loading Express app:', error.message);
  console.error('Error code:', error.code);
  console.error('__dirname:', __dirname);
  console.error('process.cwd():', process.cwd());
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('The api/build/index.js file was not found. Make sure the build process completed successfully.');
    console.error('Expected location:', require('path').join(__dirname, 'build', 'index.js'));
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

