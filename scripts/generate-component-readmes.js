#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const templatesDir = path.join(__dirname, 'templates');
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const readmeTemplatePath = path.join(templatesDir, 'README.md.template');

/**
 * Generates README files for all components that don't already have one
 */
async function generateComponentReadmes() {
  try {
    console.log('🔍 Scanning components directory...');
    
    // Get README template content
    const readmeTemplateContent = await fs.readFile(readmeTemplatePath, 'utf8');
    
    // Get all component directories
    const componentDirs = await fs.readdir(componentsDir);
    let processed = 0;
    let created = 0;
    let skipped = 0;
    
    for (const componentName of componentDirs) {
      const componentDir = path.join(componentsDir, componentName);
      
      // Check if it's a directory and follows component naming convention (PascalCase)
      try {
        const stats = await fs.stat(componentDir);
        if (!stats.isDirectory() || !/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
          skipped++;
          continue;
        }
        
        // Check if component file exists
        const componentFilePath = path.join(componentDir, `${componentName}.tsx`);
        try {
          await fs.access(componentFilePath);
        } catch (error) {
          // Skip if component file doesn't exist
          console.log(`⚠️ Skipping ${componentName}: Component file not found`);
          skipped++;
          continue;
        }
        
        // Check if README already exists
        const readmePath = path.join(componentDir, 'README.md');
        try {
          await fs.access(readmePath);
          console.log(`ℹ️ ${componentName} already has a README.md`);
          skipped++;
          continue;
        } catch (error) {
          // README doesn't exist, create it
          processed++;
          
          // Read component file to extract props information
          const componentContent = await fs.readFile(componentFilePath, 'utf8');
          
          // Generate README content
          let readmeContent = readmeTemplateContent.replace(/\{\{ComponentName\}\}/g, componentName);
          
          // Attempt to extract a better description if possible
          const descriptionMatch = componentContent.match(/\/\*\*\s*\n\s*\*\s*([^@*]+)/);
          if (descriptionMatch && descriptionMatch[1]) {
            const description = descriptionMatch[1].trim();
            readmeContent = readmeContent.replace('Brief description of the component\'s purpose and functionality.', description);
          }
          
          // Write the README file
          await fs.writeFile(readmePath, readmeContent);
          console.log(`✅ Created README.md for ${componentName}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${componentName}:`, error.message);
        skipped++;
      }
    }
    
    console.log(`
📊 README Generation Summary:
- Components processed: ${processed}
- READMEs created: ${created}
- Components skipped: ${skipped}
    `);
    
  } catch (error) {
    console.error('❌ Error generating component READMEs:', error);
    process.exit(1);
  }
}

// Run the script
generateComponentReadmes(); 