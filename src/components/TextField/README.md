# TextField Component

## Overview

Props for the TextField component

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { TextField } from 'clipper-ui';

function MyComponent() {
  return (
    <TextField 
      variant="primary" 
      size="md"
    >
      Content goes here
    </TextField>
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
<TextField>Default TextField</TextField>
```

### Variants

```jsx
<TextField variant="primary">Primary TextField</TextField>
<TextField variant="secondary">Secondary TextField</TextField>
```

### Sizes

```jsx
<TextField size="sm">Small TextField</TextField>
<TextField size="md">Medium TextField</TextField>
<TextField size="lg">Large TextField</TextField>
```

### Disabled State

```jsx
<TextField disabled>Disabled TextField</TextField>
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