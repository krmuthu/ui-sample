import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import versionPlugin from './scripts/rollup-plugin-version.js';
import replace from '@rollup/plugin-replace';
import { versionInfo } from './scripts/version.js';

// Log the version info for debugging
console.log('Building with version:', versionInfo.version);
console.log('Commit hash:', versionInfo.commitHash);

export default {
  input: 'src/index.ts', // Your components entry point
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      banner: `/**
 * ${versionInfo.name} v${versionInfo.version}
 * Built on: ${versionInfo.buildDate}
 * Commit: ${versionInfo.commitHash}
 */`
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      banner: `/**
 * ${versionInfo.name} v${versionInfo.version}
 * Built on: ${versionInfo.buildDate}
 * Commit: ${versionInfo.commitHash}
 */`
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    // Replace version values in code
    replace({
      preventAssignment: true,
      delimiters: ['', ''],
      include: ['src/**/*.ts'],
      values: {
        'const versionInfo: VersionInfo = {': `const versionInfo: VersionInfo = ${JSON.stringify(versionInfo, null, 2).replace(/^{/, '{')}`,
        'version: \'0.0.0\'': `version: '${versionInfo.version}'`,
        'name: \'clipper-ui\'': `name: '${versionInfo.name}'`,
        'buildDate: \'development\'': `buildDate: '${versionInfo.buildDate}'`,
        'buildTimestamp: 0': `buildTimestamp: ${versionInfo.buildTimestamp}`,
        'commitHash: \'development\'': `commitHash: '${versionInfo.commitHash}'`,
      }
    }),
    // Add version information
    versionPlugin(),
    typescript({
      tsconfig: './tsconfig.build.json',
      exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
    }),
    postcss({
      config: {
        path: './postcss.config.mjs',
      },
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
}; 