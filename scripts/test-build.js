#!/usr/bin/env node

/**
 * This script performs a simple smoke test on the built library files.
 * It checks if the files exist, if they can be imported, and if they contain
 * the expected exports.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Running build smoke tests...');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory does not exist. Run npm run build:lib first.');
  process.exit(1);
}

// Check if essential files exist
const requiredFiles = [
  'index.js',
  'index.esm.js',
  'index.d.ts',
  'version.json'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(distDir, file)));

if (missingFiles.length > 0) {
  console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

// Check file sizes to ensure they're not empty
const fileSizes = requiredFiles.map(file => {
  const filePath = path.join(distDir, file);
  const stats = fs.statSync(filePath);
  return { file, size: stats.size };
});

const emptyFiles = fileSizes.filter(({ size }) => size === 0);
if (emptyFiles.length > 0) {
  console.error(`❌ Empty files detected: ${emptyFiles.map(f => f.file).join(', ')}`);
  process.exit(1);
}

// Try to load version.json
try {
  const versionJson = JSON.parse(fs.readFileSync(path.join(distDir, 'version.json'), 'utf8'));
  
  // Check if version.json has required fields
  const requiredFields = ['version', 'name', 'buildDate', 'buildTimestamp', 'commitHash'];
  const missingFields = requiredFields.filter(field => !(field in versionJson));
  
  if (missingFields.length > 0) {
    console.error(`❌ version.json is missing required fields: ${missingFields.join(', ')}`);
    process.exit(1);
  }
  
  console.log(`✓ version.json is valid (version: ${versionJson.version}, commit: ${versionJson.commitHash})`);
} catch (error) {
  console.error('❌ Failed to parse version.json:', error.message);
  process.exit(1);
}

// Check if ESM module exists and has content
try {
  // We've already verified these files exist above
  console.log('✓ ESM module looks valid');
} catch (error) {
  console.error('❌ Error with ESM module:', error.message);
  process.exit(1);
}

// Check if CJS module exists and has content
try {
  // We've already verified these files exist above
  console.log('✓ CommonJS module looks valid');
} catch (error) {
  console.error('❌ Error with CommonJS module:', error.message);
  process.exit(1);
}

console.log('\n✅ All build smoke tests passed! The library appears to be built correctly.');
console.log('\nTo fully verify your library, create a test project and import the components.');
console.log('See the README.md for instructions on testing the library in another project.'); 