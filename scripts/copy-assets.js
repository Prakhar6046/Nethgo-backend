const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

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
const buildDir = path.join(__dirname, '..', 'build');
const buildIndexFile = path.join(buildDir, 'index.js');

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

// Copy the ENTIRE build directory to api/build
// This ensures all relative imports (like ./Routes/routes) work correctly
const apiBuildDir = path.join(apiDir, 'build');
try {
  // Remove existing api/build if it exists
  if (fs.existsSync(apiBuildDir)) {
    fs.rmSync(apiBuildDir, { recursive: true, force: true });
  }
  
  // Copy entire build directory
  copyDir(buildDir, apiBuildDir);
  console.log('✓ Copied entire build directory to api/build/');
  
  // Verify the copy
  const apiBuildIndex = path.join(apiBuildDir, 'index.js');
  if (fs.existsSync(apiBuildIndex)) {
    const stats = fs.statSync(apiBuildIndex);
    console.log(`✓ Verified api/build/index.js exists (${stats.size} bytes)`);
  } else {
    throw new Error('Copy verification failed - api/build/index.js does not exist');
  }
} catch (err) {
  console.error('✗ ERROR: Could not copy build directory to api/build:', err.message);
  console.error('This will cause the Vercel deployment to fail!');
  process.exit(1);
}

