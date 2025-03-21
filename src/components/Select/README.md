# Select Component

## Overview

Option interface for Select component items

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Select } from 'clipper-ui';

function MyComponent() {
  return (
    <Select 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Select>
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
<Select>Default Select</Select>
```

### Variants

```jsx
<Select variant="primary">Primary Select</Select>
<Select variant="secondary">Secondary Select</Select>
```

### Sizes

```jsx
<Select size="sm">Small Select</Select>
<Select size="md">Medium Select</Select>
<Select size="lg">Large Select</Select>
```

### Disabled State

```jsx
<Select disabled>Disabled Select</Select>
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