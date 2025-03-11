# Clipper UI

A modern UI component library with Figma design tokens integration.

## Features

- Next.js based component library
- Tailwind CSS for styling
- Storybook for component development and documentation
- Figma design tokens integration with automated transformation pipeline

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

4. Open Storybook:

```bash
npm run storybook
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
│   ├── styles/            # Global styles and tokens
│   │   ├── design-tokens.json       # Figma exported tokens
│   │   ├── tailwind-theme-simple.js # Generated theme (use this)
│   │   └── globals.css              # Global CSS
├── scripts/               # Build and transformation scripts
│   ├── transform-tokens.js          # Transforms Figma tokens
│   └── extract-theme-values.js      # Extracts simple values
├── .storybook/           # Storybook configuration
└── tailwind.config.ts    # Tailwind configuration
```

## Customizing the Tokens Pipeline

To customize how tokens are transformed:

1. Edit `scripts/transform-tokens.js` to change token transformation logic
2. Edit `sd.config.js` to change Style Dictionary processing
3. Edit `scripts/extract-theme-values.js` to change value extraction logic

For detailed documentation on using Figma design tokens, see `src/styles/FIGMA-TOKENS.md`.
