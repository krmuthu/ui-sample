# Clipper UI Integration Test

This is an integration test project for the Clipper UI component library. It serves as a way to verify that the component library builds correctly and can be imported and used in a real React application.

## Features

- Demonstrates all components from the Clipper UI library
- Shows different variants, sizes, and states of components
- Verifies that the theme and styling are correctly applied
- Displays version information from the library

## Setup

1. First, build the main Clipper UI library:
   ```bash
   # From the root of the clipper-ui project
   npm run build:lib:prod
   ```

2. Navigate to this integration test directory:
   ```bash
   cd examples/integration-test
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser at http://localhost:5173 to see the test app in action

## How It Works

This integration test project uses:

- Vite for fast development and building
- React for rendering the UI components
- Tailwind CSS for styling, configured to use the same theme as the main library
- Direct imports from the Clipper UI library

The app is structured to display each component in its own section, showing various props and configurations.

## Theme Integration

This project demonstrates how to consume the theme directly from the Clipper UI library:

```jsx
// App.jsx
import { theme } from 'clipper-ui';

// Use theme values to display color swatches
{Object.entries(theme.colors.primary).map(([shade, value]) => (
  <ColorSwatch key={shade} color="primary" shade={shade} value={value} />
))}
```

The Tailwind configuration is also set up to use the library's theme:

```js
// tailwind.config.js
import { theme } from 'clipper-ui';

export default {
  // ...
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      // ...other theme properties
    },
  },
};
```

This ensures that the integration test uses the exact same design tokens as the component library, providing a real-world example of how to consume the library in your own projects.

## Using This as a Template

You can use this project as a template for your own applications that use Clipper UI. Just modify the components and layouts to fit your needs.

## Troubleshooting

If you encounter any issues:

1. Make sure you've built the main library first with `npm run build:lib:prod`
2. Check that the path to the main library is correct in package.json
3. Verify that the Tailwind configuration correctly imports the theme values
4. Look for console errors that might indicate missing dependencies or import issues 