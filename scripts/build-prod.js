#!/usr/bin/env node

/**
 * This script handles the production build process for the library
 * It gets the current git commit hash and passes it to rollup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const execAsync = promisify(exec);

// Get the directory name in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function getGitCommitHash() {
  try {
    const { stdout } = await execAsync('git rev-parse --short HEAD', { cwd: rootDir });
    return stdout.trim();
  } catch (error) {
    console.warn('Failed to get git commit hash. Using "development" instead.');
    console.error('Error details:', error.message);
    return 'development';
  }
}

async function buildLibrary() {
  try {
    const commitHash = await getGitCommitHash();
    console.log(`Building library with commit hash: ${commitHash}`);
    
    // Run rollup with the COMMIT_HASH environment variable
    const env = { ...process.env, COMMIT_HASH: commitHash };
    
    // Use spawn to run rollup
    const buildProcess = spawn('rollup', ['-c'], { 
      env,
      stdio: 'inherit',
      shell: true,
      cwd: rootDir
    });
    
    buildProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✓ Build completed successfully!');
      } else {
        console.error(`\n✗ Build failed with code ${code}`);
        process.exit(code || 1);
      }
    });
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildLibrary(); 