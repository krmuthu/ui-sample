# Clipper UI

A modern UI component library with Figma design tokens integration and built-in versioning.

## Features

- React component library with TypeScript support
- Tailwind CSS for styling
- Storybook for component development and documentation
- Figma design tokens integration with automated transformation pipeline
- Automated versioning system with git commit integration
- ES Module and CommonJS build formats

## Components

The library includes the following components:

- **Button**: A versatile button component with multiple variants, sizes, and states
- **ButtonGroup**: For grouping related buttons with consistent styling and layout
- **Link**: Text links with different styles and variants
- **Avatar**: User avatars with image support, initials fallback, and status indicators
- More components coming soon!

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open Storybook to explore the components:

```bash
npm run storybook
```

## Building the Library

To build the library for production:

```bash
npm run build:lib:prod
```

This will:
1. Get the current git commit hash
2. Inject version information into the build
3. Generate both ES Module and CommonJS outputs
4. Create a `version.json` file with build details

For development builds without the git commit hash:

```bash
npm run build:lib
```

To watch for changes during development:

```bash
npm run build:watch
```

## Versioning System

The library includes a built-in versioning system that:

1. Tracks the package version from package.json
2. Includes the git commit hash in production builds
3. Records build date and timestamp
4. Makes version information available at runtime

### Accessing Version Information

Version information can be accessed at runtime:

```jsx
import { version, getVersion, getFormattedVersion } from 'clipper-ui';

// Access raw version object
console.log(version);
// { version: '0.1.0', name: 'clipper-ui', buildDate: '2023-...', ... }

// Get version string
console.log(getVersion());
// '0.1.0'

// Get formatted version string
console.log(getFormattedVersion());
// 'clipper-ui v0.1.0 (2023-...)'
```

## Figma Design Tokens Integration

This project includes a complete design tokens pipeline that can transform Figma design tokens into Tailwind CSS theme values.

### How It Works

1. Export design tokens from Figma using the "Tokens Studio for Figma" plugin
2. Save the exported JSON file as `src/styles/design-tokens.json`
3. Run the token transformation process:

```bash
npm run tokens
```

This will:
1. Transform the Figma tokens format to a Style Dictionary compatible format
2. Generate a Tailwind-compatible theme
3. Extract the simple values and create a clean theme file
4. Automatically use the generated theme in the Tailwind configuration

### Using Design Tokens in Components

Once the tokens are processed, you can use them in your components through Tailwind's utility classes:

```jsx
// Using primary color token
<div className="bg-primary-500 text-white">
  This uses our primary brand color
</div>

// Using spacing tokens
<div className="p-4 m-2">
  This uses our spacing scale
</div>
```

## Directory Structure

```
clipper-ui/
├── src/                   # Source code
│   ├── components/        # UI components
│   │   ├── Button/        # Button component and tests
│   │   ├── ButtonGroup/   # ButtonGroup component
│   │   ├── Link/          # Link component
│   │   └── Avatar/        # Avatar component
│   ├── styles/            # Global styles and tokens
│   │   ├── design-tokens.json       # Figma exported tokens
│   │   ├── tailwind-theme-simple.mjs # Generated theme
│   │   └── globals.css              # Global CSS
│   └── utils/             # Utility functions
│       ├── version.ts     # Version utilities
├── scripts/               # Build and transformation scripts
│   ├── transform-tokens.mjs          # Transforms Figma tokens
│   ├── extract-theme-values.mjs      # Extracts simple values
│   ├── version.js                    # Generates version information
│   ├── rollup-plugin-version.js      # Rollup plugin for versioning
│   └── build-prod.js                 # Production build script
├── .storybook/           # Storybook configuration
│   ├── manager.js         # Storybook theme customization
├── dist/                 # Built output (generated)
│   ├── index.js           # CommonJS bundle
│   ├── index.esm.js       # ES Module bundle
│   └── version.json       # Version information file
└── tailwind.config.ts    # Tailwind configuration
```

## Customizing the Tokens Pipeline

To customize how tokens are transformed:

1. Edit `scripts/transform-tokens.mjs` to change token transformation logic
2. Edit `sd.config.mjs` to change Style Dictionary processing
3. Edit `scripts/extract-theme-values.mjs` to change value extraction logic

For detailed documentation on using Figma design tokens, see `src/styles/README.md`.

## Contributing

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Implement your changes
4. Add tests for your changes
5. Submit a pull request

## License

[MIT License](LICENSE)
