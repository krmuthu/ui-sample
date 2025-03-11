import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Function to flatten nested objects with dot notation
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !obj[key].value) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    
    return acc;
  }, {});
}

// Function to handle nested token structure from Tokens Studio for Figma
function processTokens(tokens) {
  // Check if tokens follow the Figma Tokens Studio structure with global namespace
  if (tokens.global) {
    return tokens.global;
  }
  return tokens;
}

// Function to extract actual value from token object
function extractTokenValue(tokenObj) {
  if (tokenObj && typeof tokenObj === 'object' && 'value' in tokenObj) {
    return tokenObj.value;
  }
  return tokenObj;
}

// Function to transform tokens into Style Dictionary format
function transformTokens(tokens) {
  // Process tokens to handle Figma token structure
  const processedTokens = processTokens(tokens);
  
  // Flatten the nested structure
  const flatTokens = flattenObject(processedTokens);
  
  // Create the transformed output
  const transformed = {};

  Object.entries(flatTokens).forEach(([key, value]) => {
    const path = key.split('.');
    let current = transformed;

    path.forEach((segment, index) => {
      if (index === path.length - 1) {
        // Handle different value types
        const tokenValue = extractTokenValue(value);
        
        if (Array.isArray(tokenValue)) {
          // Handle typography arrays [size, lineHeight]
          current[segment] = {
            value: tokenValue[0],
            ...(tokenValue[1] && { lineHeight: tokenValue[1] })
          };
        } else if (typeof tokenValue === 'object' && tokenValue !== null) {
          if (tokenValue.type === 'dropShadow' || tokenValue.type === 'innerShadow') {
            // Handle shadow objects
            current[segment] = {
              value: tokenValue
            };
          } else {
            // Handle other complex objects
            current[segment] = {
              value: tokenValue
            };
          }
        } else {
          // Handle simple values
          current[segment] = {
            value: tokenValue
          };
        }
      } else {
        current[segment] = current[segment] || {};
        current = current[segment];
      }
    });
  });

  return transformed;
}

// Main function
async function main() {
  // Read input tokens
  const inputPath = path.join(projectRoot, 'src/styles/design-tokens.json');
  const outputPath = path.join(projectRoot, 'src/styles/transformed-tokens.json');

  try {
    // Read and parse the tokens file
    const tokensData = await fs.promises.readFile(inputPath, 'utf8');
    const tokens = JSON.parse(tokensData);
    const transformed = transformTokens(tokens);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write transformed tokens
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(transformed, null, 2),
      'utf8'
    );

    console.log('✨ Tokens transformed successfully!');
  } catch (error) {
    console.error('Error transforming tokens:', error);
    process.exit(1);
  }
}

// Execute the main function
main(); 