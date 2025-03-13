// Rollup plugin to inject version information into the build
import { versionInfo, writeVersionInfoToFile } from './version.js';

export default function versionPlugin(options = {}) {
  const {
    filename = 'version.json',
    include = '',
    writeToFile = true
  } = options;
  
  // Virtual module ID that will be imported
  const virtualModuleId = 'virtual:version-info';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  
  return {
    name: 'version-info',
    
    // Called when a module imports the virtual module
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return null;
    },
    
    // Load the virtual module content
    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Generate code to export version information
        return `export default ${JSON.stringify(versionInfo, null, 2)};`;
      }
      return null;
    },
    
    // Add version info to the banner of included files
    renderChunk(code, chunk) {
      if (include && !chunk.fileName.includes(include)) {
        return null;
      }
      
      const banner = `/**
 * ${versionInfo.name} v${versionInfo.version}
 * Built on: ${versionInfo.buildDate}
 * Commit: ${versionInfo.commitHash}
 */\n`;
      
      return {
        code: banner + code,
        map: null
      };
    },
    
    // Write version info to file when bundle is generated
    generateBundle() {
      if (writeToFile) {
        try {
          // Write version info to a JSON file in the output directory
          this.emitFile({
            type: 'asset',
            fileName: filename,
            source: JSON.stringify(versionInfo, null, 2)
          });
          
          // Also write to dist/version.json for reference outside of the bundle
          writeVersionInfoToFile();
        } catch (error) {
          console.error('Error in version plugin:', error);
        }
      }
    }
  };
} 