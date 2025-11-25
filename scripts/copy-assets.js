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
} else {
  console.log('✓ build/index.js exists');
  
  // Copy build/index.js to api/app.js for easier access in Vercel
  // This ensures the serverless function can find the built app
  const apiAppFile = path.join(__dirname, '..', 'api', 'app.js');
  try {
    fs.copyFileSync(buildIndexFile, apiAppFile);
    console.log('✓ Copied build/index.js to api/app.js for Vercel');
  } catch (err) {
    console.warn('⚠ Could not copy to api/app.js:', err.message);
  }
}

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
} else {
  console.log('✓ build/index.js exists');
  
  // Copy build/index.js to api/app.js for easier access in Vercel
  // This ensures the serverless function can find the built app
  const apiAppFile = path.join(__dirname, '..', 'api', 'app.js');
  try {
    fs.copyFileSync(buildIndexFile, apiAppFile);
    console.log('✓ Copied build/index.js to api/app.js for Vercel');
  } catch (err) {
    console.warn('⚠ Could not copy to api/app.js:', err.message);
  }
}

