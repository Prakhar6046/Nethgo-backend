// Root entry point for Vercel zero-config Express detection
// This file re-exports the built Express app from build/index.js
module.exports = require('./build/index.js').default || require('./build/index.js');

