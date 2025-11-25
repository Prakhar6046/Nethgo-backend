const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../build/index.js');

if (fs.existsSync(indexPath)) {
  let code = fs.readFileSync(indexPath, 'utf8');
  
  // Only add module.exports if it doesn't already exist
  if (!code.includes('module.exports =')) {
    code += '\n\n// Vercel compatibility: ensure CommonJS export\nmodule.exports = exports.default || exports;';
    fs.writeFileSync(indexPath, code);
    console.log('✓ Added CommonJS export for Vercel compatibility');
  } else {
    console.log('✓ CommonJS export already exists');
  }
} else {
  console.log('⚠ build/index.js not found, skipping export fix');
}

