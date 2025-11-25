// Vercel serverless function entry point
// This file imports the Express app from the build directory
// The build/index.js exports the app using: module.exports = app;
module.exports = require('../build/index.js');

