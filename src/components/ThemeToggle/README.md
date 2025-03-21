# ThemeToggle Component

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
import { ThemeToggle } from 'clipper-ui';

function MyComponent() {
  return (
    <ThemeToggle 
      variant="primary" 
      size="md"
    >
      Content goes here
    </ThemeToggle>
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
<ThemeToggle>Default ThemeToggle</ThemeToggle>
```

### Variants

```jsx
<ThemeToggle variant="primary">Primary ThemeToggle</ThemeToggle>
<ThemeToggle variant="secondary">Secondary ThemeToggle</ThemeToggle>
```

### Sizes

```jsx
<ThemeToggle size="sm">Small ThemeToggle</ThemeToggle>
<ThemeToggle size="md">Medium ThemeToggle</ThemeToggle>
<ThemeToggle size="lg">Large ThemeToggle</ThemeToggle>
```

### Disabled State

```jsx
<ThemeToggle disabled>Disabled ThemeToggle</ThemeToggle>
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