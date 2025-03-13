// This script generates version information for the build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get the version
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Generate version information object
export const generateVersionInfo = () => {
  const now = new Date();
  const buildDate = now.toISOString();
  const buildTimestamp = now.getTime();
  
  // Get commit hash from environment variable or default to 'development'
  const commitHash = process.env.COMMIT_HASH || 'development';
  
  return {
    version: packageJson.version,
    name: packageJson.name,
    buildDate,
    buildTimestamp,
    commitHash,
  };
};

// Export version info
export const versionInfo = generateVersionInfo();

// Write version info to a file
export const writeVersionInfoToFile = (outputPath = path.resolve(__dirname, '../dist/version.json')) => {
  try {
    // Ensure the dist directory exists
    const distDir = path.dirname(outputPath);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Write the version info to a JSON file
    fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
    console.log(`Version info written to ${outputPath}`);
    
    return versionInfo;
  } catch (error) {
    console.error('Error writing version info to file:', error.message);
    return versionInfo;
  }
};

// If this script is run directly
if (import.meta.url === `file://${__filename}`) {
  writeVersionInfoToFile();
} 