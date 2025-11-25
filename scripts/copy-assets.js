const fs = require('fs');
const path = require('path');

// Create build/utils directory if it doesn't exist
const buildUtilsDir = path.join(__dirname, '..', 'build', 'utils');
if (!fs.existsSync(buildUtilsDir)) {
  fs.mkdirSync(buildUtilsDir, { recursive: true });
}

// Copy serviceAccountKey.json from src/utils to build/utils
const sourceFile = path.join(__dirname, '..', 'src', 'utils', 'serviceAccountKey.json');
const destFile = path.join(buildUtilsDir, 'serviceAccountKey.json');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✓ serviceAccountKey.json copied to build/utils/');
} else {
  console.warn('⚠ serviceAccountKey.json not found in src/utils/. Make sure it exists for Firebase to work.');
}

// Verify build/index.js exists (main entry point)
const buildIndexFile = path.join(__dirname, '..', 'build', 'index.js');
if (!fs.existsSync(buildIndexFile)) {
  console.error('✗ ERROR: build/index.js not found! TypeScript compilation may have failed.');
  process.exit(1);
}

console.log('✓ build/index.js exists');

// Ensure api directory exists
const apiDir = path.join(__dirname, '..', 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
  console.log('✓ Created api directory');
}

// Copy build/index.js to api/app.js for easier access in Vercel
// This ensures the serverless function can find the built app in the same directory
const apiAppFile = path.join(apiDir, 'app.js');

// Read the built file content
let buildContent;
try {
  buildContent = fs.readFileSync(buildIndexFile, 'utf8');
  console.log(`✓ Read build/index.js (${buildContent.length} characters)`);
} catch (err) {
  console.error('✗ ERROR: Could not read build/index.js:', err.message);
  process.exit(1);
}

// Write to api/app.js
try {
  fs.writeFileSync(apiAppFile, buildContent, 'utf8');
  console.log('✓ Copied build/index.js to api/app.js for Vercel');
  
  // Verify the copy was successful
  if (fs.existsSync(apiAppFile)) {
    const stats = fs.statSync(apiAppFile);
    const verifyContent = fs.readFileSync(apiAppFile, 'utf8');
    if (verifyContent === buildContent) {
      console.log(`✓ Verified api/app.js exists and matches source (${stats.size} bytes)`);
    } else {
      throw new Error('Copy verification failed - content mismatch');
    }
  } else {
    throw new Error('Copy verification failed - file does not exist after write');
  }
} catch (err) {
  console.error('✗ ERROR: Could not write to api/app.js:', err.message);
  console.error('This will cause the Vercel deployment to fail!');
  process.exit(1);
}

