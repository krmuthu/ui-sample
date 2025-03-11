/**
 * This script extracts simple values from the Style Dictionary output.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Output file path
const outputFilePath = path.join(projectRoot, 'src/styles/tailwind-theme-simple.mjs');

/**
 * Extract simple values from complex objects
 */
function extractSimpleValues(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  // If it's an array, map over each element
  if (Array.isArray(obj)) {
    return obj.map(extractSimpleValues);
  }
  
  // If this object has a 'value' property, return just that
  if (obj.hasOwnProperty('value')) {
    return obj.value;
  }
  
  // Otherwise, recursively process each property
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = extractSimpleValues(value);
  }
  
  return result;
}

try {
  // Import the theme file directly using dynamic import
  const themeModule = await import('../src/styles/tailwind-theme.mjs');
  const themeObject = themeModule.default;
  
  // Extract simple values from the theme object
  const simplifiedTheme = extractSimpleValues(themeObject);
  
  // Special handling for box shadows - override with properly formatted strings
  if (themeObject?.boxShadow) {
    simplifiedTheme.boxShadow = {};
    
    // Process each shadow
    Object.entries(themeObject.boxShadow).forEach(([key, shadowObj]) => {
      if (shadowObj.value) {
        const shadow = shadowObj.value;
        if (typeof shadow === 'object') {
          simplifiedTheme.boxShadow[key] = `${shadow.x || '0'} ${shadow.y || '0'} ${shadow.blur || '0'} ${shadow.spread || '0'} ${shadow.color}`;
        } else {
          simplifiedTheme.boxShadow[key] = shadow;
        }
      }
    });
  }
  
  // Create a new theme file with simplified values that uses CommonJS format
  // since the Tailwind config expects module.exports
  const newThemeContent = `/**
 * Auto-generated simplified Tailwind theme
 * Contains only the essential token values
 */

export default ${JSON.stringify(simplifiedTheme, null, 2)};
`;
  
  // Write the simplified theme file
  await fs.promises.writeFile(outputFilePath, newThemeContent, 'utf8');
  
  console.log('✨ Simplified theme file created successfully!');
} catch (error) {
  console.error('Error processing theme file:', error);
  process.exit(1);
} 