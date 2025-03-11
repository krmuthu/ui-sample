# Using Figma Design Tokens

This document explains how to export design tokens from Figma and incorporate them into your project.

## Prerequisites

1. Install the "Tokens Studio for Figma" plugin (formerly known as Figma Tokens)
2. Set up your design tokens in Figma using the plugin

## Exporting Tokens from Figma

### Using Tokens Studio for Figma

1. Open your Figma file
2. Open the Tokens Studio for Figma plugin
3. Navigate to the "Export" tab
4. Select "JSON" as the export format
5. Click "Export" to download the JSON file

The JSON file will have a structure that looks like this:

```json
{
  "global": {
    "colors": {
      "primary": {
        "500": { "value": "#0EA5E9" }
      }
    }
  },
  "$themes": [],
  "$metadata": {
    "tokenSetOrder": ["global"]
  }
}
```

## Integrating Figma Tokens into the Project

1. Save the exported JSON file as `src/styles/design-tokens.json`
2. Run the token transformation process:

```bash
npm run tokens
```

This will:
1. Transform the Figma tokens format using our custom script
2. Generate a Tailwind-compatible theme using Style Dictionary
3. Output a `tailwind-theme.js` file that is automatically used by the Tailwind config

## Token Structure for Figma

The transformation process expects the following token structure from Figma:

```
global/
  ├── colors/
  │   ├── primary/
  │   │   ├── 50: { value: "#F0F9FF" }
  │   │   ├── 100: { value: "#E0F2FE" }
  │   │   └── ...
  │   └── ...
  ├── spacing/
  │   ├── 0: { value: "0" }
  │   ├── 1: { value: "0.25rem" }
  │   └── ...
  ├── typography/
  │   ├── fontSize/
  │   │   ├── xs: { value: "0.75rem" }
  │   │   └── ...
  │   └── ...
  └── ...
```

## Customizing the Transformation Process

If you need to customize how tokens are transformed:

1. Edit `scripts/transform-tokens.js` to change the token transformation logic
2. Edit `sd.config.js` to change how Style Dictionary processes the tokens

## Advanced: Creating Token Sets in Figma

In Tokens Studio for Figma, you can create different token sets (like "light", "dark", "brand"):

1. Click on the "+" button next to "Global" in the plugin
2. Name your new token set (e.g., "dark")
3. Add tokens specific to that theme

When exporting, all token sets will be included. Our transformation process currently uses the "global" set by default.

## Troubleshooting

- If your tokens aren't showing up correctly, check the structure of your Figma export
- Make sure token names in Figma match what the transformation script expects
- Inspect the generated `transformed-tokens.json` to see the intermediate format
- Run the transformation with `DEBUG=* npm run tokens` for more detailed logs 