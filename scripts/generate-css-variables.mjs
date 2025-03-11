/**
 * This script generates CSS variables from the transformed-tokens.json file
 * and updates the globals.css file with those variables.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// File paths
const tokensPath = path.join(projectRoot, 'src/styles/transformed-tokens.json');
const cssPath = path.join(projectRoot, 'src/styles/globals.css');

/**
 * Processes a box shadow value into a CSS box-shadow string
 * @param {Object|Array} shadowValue - The shadow value to process
 * @returns {string} - A CSS box-shadow string
 */
function processBoxShadow(shadowValue) {
  if (Array.isArray(shadowValue)) {
    // Process array of shadows
    return shadowValue.map(shadow => {
      if (typeof shadow === 'string') return shadow;
      const { x = '0', y = '0', blur = '0', spread = '0', color } = shadow;
      return `${x} ${y} ${blur} ${spread} ${color}`;
    }).join(', ');
  } else if (typeof shadowValue === 'object') {
    // Process single shadow object
    const { x = '0', y = '0', blur = '0', spread = '0', color } = shadowValue;
    return `${x} ${y} ${blur} ${spread} ${color}`;
  }
  
  // Return as is if it's already a string
  return shadowValue;
}

/**
 * Converts a nested object of tokens into flat CSS variables
 * @param {Object} obj - The object to flatten
 * @param {string} prefix - The prefix for the variable name
 * @returns {Object} - Object with flattened variable names and values
 */
function flattenTokens(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = prefix ? `${prefix}-${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.value !== undefined) {
        // This is a leaf token with a value
        let processedValue = value.value;
        
        // Special processing for box shadows
        if (newPrefix.includes('boxShadow') && typeof processedValue === 'object') {
          processedValue = processBoxShadow(processedValue);
        }
        
        result[`--${newPrefix}`] = processedValue;
      } else {
        // This is a nested object, recurse
        Object.assign(result, flattenTokens(value, newPrefix));
      }
    }
  }
  
  return result;
}

/**
 * Generates CSS for variables
 * @param {Object} variables - Flattened CSS variables
 * @returns {string} - CSS code for variables
 */
function generateCSS(variables) {
  let css = '';
  
  for (const [name, value] of Object.entries(variables)) {
    css += `    ${name}: ${value};\n`;
  }
  
  return css;
}

/**
 * Updates the globals.css file with the CSS variables
 * @param {string} cssVariables - CSS variables to inject
 */
function updateGlobalCSS(cssVariables) {
  try {
    // Read the current globals.css
    const currentCSS = fs.readFileSync(cssPath, 'utf8');
    
    // Find the :root section
    const rootRegex = /(:root\s*{)([\s\S]*?)(})/;
    
    // Check if :root exists
    if (rootRegex.test(currentCSS)) {
      // Replace the content of :root
      const updatedCSS = currentCSS.replace(rootRegex, `$1\n${cssVariables}$3`);
      fs.writeFileSync(cssPath, updatedCSS, 'utf8');
    } else {
      // If :root doesn't exist, find the @layer base section and add :root
      const layerBaseRegex = /(@layer\s+base\s*{)([\s\S]*?)(})/;
      
      if (layerBaseRegex.test(currentCSS)) {
        const updatedCSS = currentCSS.replace(
          layerBaseRegex, 
          `$1\n  :root {\n${cssVariables}  }\n\n$2$3`
        );
        fs.writeFileSync(cssPath, updatedCSS, 'utf8');
      } else {
        // If @layer base doesn't exist either, add it before @layer components
        const layerComponentsIndex = currentCSS.indexOf('@layer components');
        
        if (layerComponentsIndex !== -1) {
          const updatedCSS = 
            currentCSS.slice(0, layerComponentsIndex) + 
            `@layer base {\n  :root {\n${cssVariables}  }\n}\n\n` +
            currentCSS.slice(layerComponentsIndex);
          
          fs.writeFileSync(cssPath, updatedCSS, 'utf8');
        } else {
          // Last resort: append to the end
          const updatedCSS = 
            currentCSS + 
            `\n@layer base {\n  :root {\n${cssVariables}  }\n}\n`;
          
          fs.writeFileSync(cssPath, updatedCSS, 'utf8');
        }
      }
    }
    
    console.log('✨ CSS variables successfully generated and added to globals.css');
  } catch (error) {
    console.error('Error updating globals.css:', error);
    process.exit(1);
  }
}

// Main execution
try {
  // Read the tokens file
  const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  
  // Flatten the tokens into CSS variables
  const cssVariables = flattenTokens(tokensData);
  
  // Generate CSS code
  const cssCode = generateCSS(cssVariables);
  
  // Update globals.css
  updateGlobalCSS(cssCode);
  
} catch (error) {
  console.error('Error generating CSS variables:', error);
  process.exit(1);
} 