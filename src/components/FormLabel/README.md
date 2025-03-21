# FormLabel Component

## Overview

Props for the FormLabel component

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { FormLabel } from 'clipper-ui';

function MyComponent() {
  return (
    <FormLabel 
      variant="primary" 
      size="md"
    >
      Content goes here
    </FormLabel>
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
<FormLabel>Default FormLabel</FormLabel>
```

### Variants

```jsx
<FormLabel variant="primary">Primary FormLabel</FormLabel>
<FormLabel variant="secondary">Secondary FormLabel</FormLabel>
```

### Sizes

```jsx
<FormLabel size="sm">Small FormLabel</FormLabel>
<FormLabel size="md">Medium FormLabel</FormLabel>
<FormLabel size="lg">Large FormLabel</FormLabel>
```

### Disabled State

```jsx
<FormLabel disabled>Disabled FormLabel</FormLabel>
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