# Design Tokens System

This directory contains our design tokens system that bridges Figma design tokens with Tailwind CSS.

## Overview

The system works in the following way:

1. Design tokens are defined in `design-tokens.json` (these could be exported from Figma)
2. We use `token-transformer` to transform these tokens into a format Style Dictionary can use
3. Style Dictionary processes the transformed tokens and generates a Tailwind theme file
4. The Tailwind config imports this theme and uses it for styling

## How to Use

### Updating Design Tokens from Figma

If you have design tokens from Figma:

1. Export them from Figma (using a plugin like "Tokens Studio for Figma")
2. Update the `design-tokens.json` file with the exported tokens

### Generating the Tailwind Theme

Run the following command to process the design tokens and generate the Tailwind theme:

```bash
npm run tokens
```

This will:
1. Transform the tokens using `token-transformer`
2. Build the tokens using Style Dictionary
3. Output a `tailwind-theme.js` file that is automatically used by the Tailwind config

### Using Tokens in your Components

Once your tokens are processed, you can use them in your components through Tailwind's utility classes:

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

### Consuming the Theme in Applications

The theme is exported from the library, allowing consumers of the component library to use the same design tokens in their applications:

```jsx
// In your application code
import { theme, getThemeColor } from 'clipper-ui';

// Use theme values directly
const primaryColor = theme.colors.primary[500];

// Use helper functions
const errorColor = getThemeColor('error', 600);
```

To use the theme with Tailwind CSS in your application:

```js
// tailwind.config.js in your application
import { theme } from 'clipper-ui';

export default {
  // ...
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      fontSize: theme.fontSize,
    },
  },
};
```

This ensures consistent styling between the component library and your application.

## Troubleshooting

If you encounter issues with the tokens:

1. Make sure `design-tokens.json` is properly formatted
2. Run `npm run tokens` to regenerate the Tailwind theme
3. Check for any errors in the console during the transformation process

## File Structure

- `design-tokens.json`: Source design tokens (from Figma)
- `transformed-tokens.json`: Intermediate file (generated)
- `tailwind-theme.js`: Final output that Tailwind uses (generated)
- `globals.css`: Global styles and Tailwind imports

## Further Customization

To customize the token transformation process:

1. Edit `sd.config.js` in the project root to change how Style Dictionary processes the tokens
2. Modify the token-transformer options in package.json scripts to change token transformation behavior 