#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const COMPONENT_DIST_DIR = path.join(DIST_DIR, 'components');
const SIZE_LIMITS = {
  component: 15 * 1024, // 15KB warning threshold for individual components
  total: 100 * 1024,    // 100KB warning threshold for total bundle
};

/**
 * Format file size in human readable format
 */
function formatSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

/**
 * Calculate size of a specific file
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Check bundle sizes for components
 */
async function checkComponentSizes() {
  try {
    // Ensure dist directory exists
    try {
      await fs.access(DIST_DIR);
    } catch (error) {
      console.error('❌ Dist directory not found. Please run build first.');
      process.exit(1);
    }
    
    // Get main bundle sizes
    const mainCjsPath = path.join(DIST_DIR, 'index.js');
    const mainEsmPath = path.join(DIST_DIR, 'index.esm.js');
    
    const mainCjsSize = await getFileSize(mainCjsPath);
    const mainEsmSize = await getFileSize(mainEsmPath);
    
    console.log('\n📦 Main Bundle Sizes:');
    console.log(`  - CJS Bundle: ${formatSize(mainCjsSize)}`);
    console.log(`  - ESM Bundle: ${formatSize(mainEsmSize)}`);
    
    // Check if total size exceeds limit
    if (mainCjsSize > SIZE_LIMITS.total || mainEsmSize > SIZE_LIMITS.total) {
      console.warn('⚠️ WARNING: Main bundle size exceeds recommended limit of 100KB');
    }
    
    // Get individual component directories
    try {
      await fs.access(COMPONENT_DIST_DIR);
    } catch (error) {
      console.log('\n⚠️ Component dist directory not found. Skipping component size check.');
      return;
    }
    
    const componentDirs = await fs.readdir(COMPONENT_DIST_DIR);
    
    const oversizedComponents = [];
    let totalIndividualSize = 0;
    
    console.log('\n📦 Individual Component Sizes:');
    
    for (const component of componentDirs) {
      // Only check directories
      const componentPath = path.join(COMPONENT_DIST_DIR, component);
      const stats = await fs.stat(componentPath);
      
      if (!stats.isDirectory()) continue;
      
      const esmPath = path.join(componentPath, 'index.esm.js');
      
      try {
        const esmSize = await getFileSize(esmPath);
        totalIndividualSize += esmSize;
        
        // Log with color indicators based on size
        let sizeLog = `  - ${component}: ${formatSize(esmSize)}`;
        
        if (esmSize > SIZE_LIMITS.component) {
          sizeLog = `\x1b[33m${sizeLog} ⚠️\x1b[0m`; // Yellow warning
          oversizedComponents.push({ name: component, size: esmSize });
        } else if (esmSize > SIZE_LIMITS.component * 0.7) {
          sizeLog = `\x1b[33m${sizeLog}\x1b[0m`; // Yellow text (approaching limit)
        }
        
        console.log(sizeLog);
      } catch (error) {
        console.log(`  - ${component}: Not found`);
      }
    }
    
    console.log(`\n📊 Total size of individual components: ${formatSize(totalIndividualSize)}`);
    
    // Provide recommendations for oversized components
    if (oversizedComponents.length > 0) {
      console.log('\n⚠️ Recommendations for large components:');
      oversizedComponents.forEach(comp => {
        console.log(`  - ${comp.name} (${formatSize(comp.size)}): Consider splitting into smaller components or optimizing imports`);
      });
    }
    
    console.log('\n✅ Bundle size check completed');
    
  } catch (error) {
    console.error('❌ Error checking bundle sizes:', error);
    process.exit(1);
  }
}

// Run the script
checkComponentSizes(); 