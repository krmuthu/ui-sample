# Component-Specific Builds

This document details the component-specific build system in Clipper UI, explaining how it works and how to leverage it for optimal performance.

## Overview

Clipper UI uses a sophisticated build system that creates individual bundles for each component, allowing applications to import only what they need. This approach significantly reduces bundle sizes and improves application performance.

## Benefits

- **Reduced Bundle Size**: Only import the components you actually use
- **Faster Load Times**: Smaller bundles lead to faster page loads
- **Better Tree Shaking**: Modern bundlers can eliminate unused code more effectively
- **Optimized Development**: Easier to track component dependencies

## Bundle Comparison

| Component | Size (CJS) | Size (ESM) | Dependencies Included |
|-----------|------------|------------|----------------------|
| Full Library | 84KB | 80KB | All components |
| Button | 4KB | 3.8KB | No other components |
| Table | 16KB | 15KB | No other components |
| Grid | 8KB | 7.5KB | No other components |
| Avatar | 5KB | 4.7KB | No other components |
| TextField | 8KB | 7.6KB | No other components |

## Usage Examples

### Importing Individual Components

```jsx
// Import specific components directly
import Button from 'clipper-ui/dist/components/Button';
import TextField from 'clipper-ui/dist/components/TextField';

function LoginForm() {
  return (
    <form>
      <TextField label="Username" />
      <TextField label="Password" type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### Using with Modern Bundlers (webpack, Rollup, etc.)

Modern bundlers will automatically optimize imports:

```jsx
// Your application code
import { Button, TextField } from 'clipper-ui';

// If your bundler supports path mapping, you can configure it to
// automatically use component-specific builds:

// webpack.config.js example
module.exports = {
  // ...
  resolve: {
    alias: {
      'clipper-ui/Button': 'clipper-ui/dist/components/Button',
      'clipper-ui/TextField': 'clipper-ui/dist/components/TextField',
      // etc.
    }
  }
};
```

### Using with Next.js

```jsx
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'clipper-ui/Button': 'clipper-ui/dist/components/Button',
      'clipper-ui/Table': 'clipper-ui/dist/components/Table',
      // Add more components as needed
    };
    return config;
  },
};
```

## Technical Implementation

The Clipper UI build system uses several technical approaches to create optimized component bundles:

### Build Pipeline

1. **Component Discovery**: The build system scans the `src/components` directory to identify all available components
2. **Parallel Building**: Each component is built concurrently for faster build times
3. **Babel Transpilation**: TypeScript is transpiled to JavaScript using Babel
4. **Bundle Generation**: Both CommonJS and ESM bundles are created
5. **Type Declaration**: TypeScript declarations are generated for each component
6. **Optimization**: Bundles are minified and optimized

### Directory Structure

Each component's build output follows this structure:

```
dist/components/
├── Button/
│   ├── index.js         # CommonJS bundle
│   ├── index.js.map     # Source map
│   ├── index.esm.js     # ES Module bundle
│   ├── index.esm.js.map # ESM source map
│   ├── Button.d.ts      # Component type declarations
│   └── index.d.ts       # Type re-exports
├── Table/
│   ├── ...
└── ...
```

### How It Works

The build process is managed by a custom script (`scripts/build-components.js`) that:

1. Identifies all valid component directories
2. Creates a Rollup configuration for each component
3. Runs the build process in parallel
4. Generates TypeScript declarations
5. Creates index files that re-export from the main component file

## Customizing the Build Process

If you're contributing to Clipper UI, you can customize the component build process:

### Adding a New Component

1. Create your component in `src/components/YourComponent/YourComponent.tsx`
2. The build system will automatically include it in the next build

### Modifying Build Settings

Edit `scripts/build-components.js` to customize:

- Output formats
- Bundle optimization settings
- TypeScript declaration generation

## Best Practices

1. **Direct Imports**: Always use direct component imports for the best performance
2. **Bundle Analysis**: Use tools like `webpack-bundle-analyzer` to verify bundle sizes
3. **Path Mapping**: Set up path aliases in your bundler for cleaner imports
4. **Import Disclosure**: Document which components you're using for better maintenance

## Troubleshooting

### Common Issues

1. **Missing Components**: Make sure you've imported the correct path
2. **Type Errors**: If you encounter type errors, check that you're importing both the component and its types
3. **Build Failures**: If components fail to build, check the component validation rules

## Future Improvements

The Clipper UI team is working on several improvements to the component build system:

1. **Automatic Dependency Resolution**: Smart detection of component dependencies
2. **Standalone Component Packages**: Publishing each component as its own npm package
3. **CDN Distribution**: Making components available via CDN for direct browser usage

## Contributing

If you have ideas for improving the build system, we welcome contributions! See our [Contributing Guide](../CONTRIBUTING.md) for details. 