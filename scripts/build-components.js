import { rollup } from 'rollup';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const componentsDir = path.join(__dirname, '../src/components');
const componentsOutputDir = path.join(__dirname, '../dist/components');

/**
 * Finds all valid component directories
 */
async function getValidComponents() {
  const componentDirs = await fs.readdir(componentsDir);
  const validComponents = [];

  for (const dir of componentDirs) {
    const componentPath = path.join(componentsDir, dir);
    try {
      const stats = await fs.stat(componentPath);
      if (stats.isDirectory()) {
        const componentFile = path.join(componentPath, `${dir}.tsx`);
        await fs.access(componentFile); // Check if the file exists
        validComponents.push(dir);
      }
    } catch {
      // File doesn't exist or isn't accessible
      console.log(`Skipping ${dir}: Not a valid component`);
    }
  }

  console.log(`✅ Found ${validComponents.length} valid components`);
  return validComponents;
}

/**
 * Creates a temporary tsconfig for a component
 */
async function createTempTsConfig(componentName) {
  const tsConfigPath = path.join(componentsOutputDir, componentName, 'tsconfig.json');
  const tsConfig = {
    compilerOptions: {
      target: "es2015",
      module: "esnext",
      moduleResolution: "node",
      jsx: "react",
      declaration: true,
      emitDeclarationOnly: true,
      outDir: "./",
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: [`../../../src/components/${componentName}/${componentName}.tsx`],
    exclude: ["**/*.stories.tsx", "**/*.test.tsx"]
  };
  
  await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  return tsConfigPath;
}

/**
 * Generates type declarations for a specific component
 */
async function generateComponentTypes(componentName) {
  const componentOutputDir = path.join(componentsOutputDir, componentName);
  const tsConfigPath = await createTempTsConfig(componentName);
  
  try {
    const { stderr } = await execPromise(`cd ${componentOutputDir} && npx tsc -p tsconfig.json`);
    if (stderr && !stderr.includes('TS5023')) {
      console.error(`TypeScript warning for ${componentName}:`, stderr);
    }
    
    // Create the index.d.ts file that re-exports the types
    const dtsContent = `export * from './${componentName}';
export { default } from './${componentName}';
`;
    
    await fs.writeFile(path.join(componentOutputDir, 'index.d.ts'), dtsContent);
    
    // Clean up temporary tsconfig
    await fs.unlink(tsConfigPath);
    
    return true;
  } catch (error) {
    console.error(`❌ Error generating types for ${componentName}:`, error);
    return false;
  }
}

/**
 * Builds an individual component
 */
async function buildComponent(dir) {
  console.log(`🔨 Building component: ${dir}`);
  const componentInput = path.join(componentsDir, dir, `${dir}.tsx`);
  const componentOutputDir = path.join(componentsOutputDir, dir);
  await fs.mkdir(componentOutputDir, { recursive: true });

  const config = {
    input: componentInput,
    output: [
      { file: `dist/components/${dir}/index.js`, format: 'cjs', sourcemap: true, exports: 'named' },
      { file: `dist/components/${dir}/index.esm.js`, format: 'esm', sourcemap: true, exports: 'named' },
    ],
    plugins: [
      external(),
      resolve({ extensions: ['.tsx', '.ts', '.jsx', '.js'] }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        extensions: ['.ts', '.tsx'],
        exclude: 'node_modules/**',
      }),
      postcss({ minimize: true, inject: { insertAt: 'top' } }),
      terser(),
    ],
    external: ['react', 'react-dom'],
  };

  try {
    const bundle = await rollup(config);
    await Promise.all(config.output.map(output => bundle.write(output)));
    await bundle.close();
    
    // Generate component-specific type declarations
    const typesSuccess = await generateComponentTypes(dir);
    
    if (typesSuccess) {
      console.log(`✅ Successfully built ${dir} with type declarations`);
    } else {
      console.log(`⚠️ Built ${dir} but type generation had issues`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error building ${dir}:`, error);
    return false;
  }
}

/**
 * Builds all components in parallel
 */
async function buildComponents() {
  console.log(`📦 Starting component build...`);
  await fs.mkdir(componentsOutputDir, { recursive: true });

  const validComponents = await getValidComponents();
  const results = await Promise.allSettled(validComponents.map(buildComponent));
  
  const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
  const failed = validComponents.length - successful;
  
  console.log(`🎉 Component build complete! ${successful} succeeded, ${failed} failed.`);
}

/**
 * Runs the full build process
 */
async function run() {
  try {
    await buildComponents();
    console.log('🚀 Build process completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

run();
