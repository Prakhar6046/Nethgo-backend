// Vercel serverless function entry point
// This imports the Express app from the build folder

let app;

try {
  // Import the built Express app
  // TypeScript compiles export default to module.exports.default
  const appModule = require('../build/index.js');
  
  // Handle ES6 default export (compiled to .default) or direct CommonJS export
  app = appModule.default || appModule;
  
  if (!app) {
    throw new Error('Express app not found. Check build/index.js exports.');
  }
  
  console.log('Express app loaded successfully');
} catch (error) {
  console.error('Error loading Express app:', error);
  console.error('Error stack:', error.stack);
  // Return a simple error handler
  app = (req, res) => {
    res.status(500).json({ 
      error: 'Server initialization failed',
      message: error.message 
    });
  };
}

// Export as a serverless function handler
// Vercel expects the Express app directly, not wrapped in a function
module.exports = app;

