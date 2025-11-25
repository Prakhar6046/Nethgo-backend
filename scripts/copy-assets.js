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

