# ThemeProvider Component

## Overview

Brief description of the component's purpose and functionality.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { ThemeProvider } from 'clipper-ui';

function MyComponent() {
  return (
    <ThemeProvider 
      variant="primary" 
      size="md"
    >
      Content goes here
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary'` | `'default'` | Visual variant of the component |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the component |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `className` | `string` | `''` | Additional CSS class names |
| `onClick` | `(event: React.MouseEvent<HTMLElement>) => void` | - | Callback fired when the component is clicked |
| `children` | `React.ReactNode` | - | Content of the component |

## Examples

### Basic Usage

```jsx
<ThemeProvider>Default ThemeProvider</ThemeProvider>
```

### Variants

```jsx
<ThemeProvider variant="primary">Primary ThemeProvider</ThemeProvider>
<ThemeProvider variant="secondary">Secondary ThemeProvider</ThemeProvider>
```

### Sizes

```jsx
<ThemeProvider size="sm">Small ThemeProvider</ThemeProvider>
<ThemeProvider size="md">Medium ThemeProvider</ThemeProvider>
<ThemeProvider size="lg">Large ThemeProvider</ThemeProvider>
```

### Disabled State

```jsx
<ThemeProvider disabled>Disabled ThemeProvider</ThemeProvider>
```

## Accessibility

- The component sets appropriate `aria-disabled` attributes based on the `disabled` prop.
- Use the `aria-label` prop to provide accessible names when needed.

## Best Practices

- Use primary variant for main actions
- Use default variant for general content
- Ensure there is sufficient color contrast for all variants

## Design Considerations

- The component supports both light and dark themes
- Styling is based on a consistent design system
- Typography is handled automatically based on size 