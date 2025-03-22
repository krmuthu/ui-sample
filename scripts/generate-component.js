#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const templatesDir = path.join(__dirname, 'templates');
const componentsDir = path.join(__dirname, '..', 'src', 'components');

/**
 * Creates a new component from templates
 */
async function generateComponent() {
  const componentName = process.argv[2];
  
  if (!componentName) {
    console.error('❌ Please specify a component name!');
    console.log('Usage: node scripts/generate-component.js ComponentName');
    process.exit(1);
  }
  
  // Ensure component name starts with uppercase letter
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    console.error('❌ Component name must start with an uppercase letter and contain only letters and numbers!');
    process.exit(1);
  }
  
  console.log(`🔨 Generating component: ${componentName}`);
  
  // Define file mappings: template file -> destination file
  const files = [
    {
      templateFile: 'component.tsx.template',
      destFile: `${componentName}.tsx`
    },
    {
      templateFile: 'index.ts.template',
      destFile: 'index.ts'
    },
    {
      templateFile: 'component.stories.tsx.template',
      destFile: `${componentName}.stories.tsx`
    },
    {
      templateFile: 'component.test.tsx.template',
      destFile: `${componentName}.test.tsx`
    },
    {
      templateFile: 'README.md.template',
      destFile: 'README.md'
    }
  ];
  
  try {
    // Create component directory
    const componentDir = path.join(componentsDir, componentName);
    await fs.mkdir(componentDir, { recursive: true });
    
    // Process each file
    for (const file of files) {
      // Read template content
      const templatePath = path.join(templatesDir, file.templateFile);
      let content = await fs.readFile(templatePath, 'utf8');
      
      // Replace template placeholders
      content = content.replace(/\{\{ComponentName\}\}/g, componentName);
      
      // Write to destination
      const destPath = path.join(componentDir, file.destFile);
      await fs.writeFile(destPath, content);
      
      console.log(`✅ Created: ${path.relative(process.cwd(), destPath)}`);
    }
    
    console.log(`
🎉 Component "${componentName}" created successfully!

📁 Location: src/components/${componentName}/
📄 Files:
  - ${componentName}.tsx - Main component implementation
  - index.ts - Exports for the component
  - ${componentName}.stories.tsx - Storybook documentation
  - ${componentName}.test.tsx - Unit tests
  - README.md - Component documentation
    `);
    
    // Update index.ts export
    console.log('🔄 Updating main index.ts exports...');
    await updateMainIndex(componentName);
    
  } catch (error) {
    console.error('❌ Error generating component:', error);
    process.exit(1);
  }
}

/**
 * Updates the main index.ts file to include the new component
 */
async function updateMainIndex(componentName) {
  const indexPath = path.join(__dirname, '..', 'src', 'index.ts');
  
  try {
    let content = await fs.readFile(indexPath, 'utf8');
    
    // Check if the component is already exported
    if (content.includes(`export { ${componentName} }`)) {
      console.log('⚠️ Component already exported in index.ts');
      return;
    }
    
    // Find the last export statement
    const lines = content.split('\n');
    let lastExportIndex = lines.length - 1;
    
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].startsWith('export ')) {
        lastExportIndex = i;
        break;
      }
    }
    
    // Insert new export
    const newExport = `export { ${componentName} } from './components/${componentName}/${componentName}';`;
    lines.splice(lastExportIndex + 1, 0, newExport);
    
    // Write updated content
    await fs.writeFile(indexPath, lines.join('\n'));
    console.log('✅ Updated main index.ts exports');
    
  } catch (error) {
    console.error('❌ Error updating index.ts:', error);
    console.log('Please manually add the component export to src/index.ts');
  }
}

// Run the script
generateComponent(); 