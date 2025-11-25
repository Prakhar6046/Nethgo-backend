// Vercel serverless function entry point
// This imports the Express app from the build folder
const appModule = require('../build/index.js');
// Handle both default export and direct export
const app = appModule.default || appModule;

// Export as a serverless function handler
module.exports = app;

