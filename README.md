# Clipper UI

A modern, lightweight React component library optimized for performance and developer experience.

![npm version](https://img.shields.io/npm/v/clipper-ui)
![bundle size](https://img.shields.io/bundlephobia/minzip/clipper-ui)
![license](https://img.shields.io/npm/l/clipper-ui)

## Features

- 🚀 **Optimized for Performance**: Component-specific builds for smaller bundles
- 🎨 **Modern Design System**: Clean, consistent UI components
- 📱 **Fully Responsive**: Works on mobile, tablet, and desktop
- 🔧 **Highly Customizable**: Theming support and flexible props
- 📦 **Tree-Shakable**: Import only what you need
- 🔍 **Accessibility Focused**: WCAG 2.1 compliant components
- 📝 **TypeScript Support**: Full type definitions included

## Installation

```bash
# Using npm
npm install clipper-ui

# Using yarn
yarn add clipper-ui

# Using pnpm
pnpm add clipper-ui
```

## Quick Start

```jsx
import React from 'react';
import { Button, Container, TextField } from 'clipper-ui';

function App() {
  return (
    <Container>
      <h1>Hello Clipper UI!</h1>
      <TextField label="Username" placeholder="Enter your username" />
      <Button variant="primary">Login</Button>
    </Container>
  );
}
```

## Optimized Component Imports

For better performance, you can import individual components directly:

```jsx
// Import specific components (smaller bundles)
import Button from 'clipper-ui/dist/components/Button';
import Table from 'clipper-ui/dist/components/Table';
import TextField from 'clipper-ui/dist/components/TextField';

// Instead of importing from the main bundle (larger)
// import { Button, Table, TextField } from 'clipper-ui';
```

### Bundle Size Comparison

| Import Method | Size |
|---------------|------|
| Full Library | ~84KB |
| Table Component Only | ~16KB |
| Button Component Only | ~4KB |

## Core Components

Clipper UI includes a wide range of components:

### Layout
- `Container` - Responsive container with maxWidth control
- `Grid` - Powerful 12-column grid system (Row/Col)

### Form Controls
- `Button` - Multiple variants, sizes, and states
- `TextField` - Text input with validation
- `Checkbox` - Custom checkbox with label
- `Radio` - Radio button groups
- `Select` - Dropdown selection
- `Switch` - Toggle switch control

### Data Display
- `Table` - Feature-rich data table with sorting and pagination
- `Calendar` - Date selection and display
- `DatePicker` - Date selection with popover
- `TimePicker` - Time selection interface

### Feedback & Overlays
- `Dialog` - Modal dialogs and alerts
- `Avatar` - User avatar display

### Utilities
- `ThemeProvider` - Theme context provider
- `Link` - Enhanced anchor element

## Documentation

For detailed documentation on each component, please refer to:

- [Grid System Documentation](docs/grid-system.md)
- [Table Component Documentation](docs/table-component.md)
- [Form Controls Documentation](docs/form-controls.md)

## Development

### Project Structure

```
clipper-ui/
├── dist/               # Built distribution files
│   ├── components/     # Component-specific builds
│   ├── index.js        # CJS bundle
│   └── index.esm.js    # ESM bundle
├── src/
│   ├── components/     # React components
│   ├── styles/         # Global styles & themes
│   └── utils/          # Utility functions
├── scripts/            # Build scripts
└── docs/               # Documentation
```

### Build Commands

```bash
# Build the entire library (full bundle + component-specific builds)
npm run build:all

# Build only component-specific bundles
npm run build:components

# Build only the main library bundle
npm run build:lib

# Development mode with hot reloading
npm run dev

# Run Storybook
npm run storybook
```

## Performance Optimizations

Clipper UI includes several performance optimizations:

1. **Component-Specific Builds**
   - Each component is built separately for optimal tree-shaking
   - CommonJS and ESM bundles with full TypeScript support
   - Significantly smaller bundle sizes for selective imports

2. **Runtime Optimizations**
   - React.memo for complex components
   - Debounced event handlers
   - Virtualization for large datasets (Table component)

3. **Developer Tools**
   - Performance monitoring utilities
   - Bundle size analysis
   - Component benchmarking

For detailed information on performance features, see our [Performance Guide](docs/performance-optimizations.md).

## Browser Support

Clipper UI supports all modern browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Organization]
