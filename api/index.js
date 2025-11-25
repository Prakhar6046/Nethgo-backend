// Vercel serverless function entry point
// This imports the Express app from the build folder
const path = require('path');
const fs = require('fs');

let app;

try {
  // Try multiple paths in order of preference
  const possiblePaths = [
    path.join(__dirname, 'app.js'),                    // Copied to api/app.js during build
    path.join(__dirname, '..', 'build', 'index.js'),  // Standard build location
    path.join(process.cwd(), 'build', 'index.js')     // Absolute from project root
  ];
  
  let appModule = null;
  let usedPath = null;
  let lastError = null;
  
  for (const buildPath of possiblePaths) {
    try {
      const resolvedPath = path.resolve(buildPath);
      if (fs.existsSync(resolvedPath)) {
        appModule = require(resolvedPath);
        usedPath = resolvedPath;
        console.log(`✓ Successfully loaded app from: ${usedPath}`);
        break;
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  
  if (!appModule) {
    throw new Error(
      `Could not find Express app. Tried: ${possiblePaths.join(', ')}. ` +
      `Last error: ${lastError ? lastError.message : 'File not found'}`
    );
  }
  
  // Handle ES6 default export (compiled to .default) or direct CommonJS export
  app = appModule.default || appModule;
  
  if (!app) {
    console.error('Available module keys:', Object.keys(appModule));
    throw new Error('Express app not found. Check exports. Module keys: ' + Object.keys(appModule).join(', '));
  }
  
  console.log('✓ Express app loaded successfully');
} catch (error) {
  console.error('✗ Error loading Express app:', error.message);
  console.error('Error code:', error.code);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  
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

