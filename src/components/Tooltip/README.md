# Tooltip Component

## Overview

The element that triggers the tooltip

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Tooltip } from 'clipper-ui';

function MyComponent() {
  return (
    <Tooltip 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Tooltip>
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
<Tooltip>Default Tooltip</Tooltip>
```

### Variants

```jsx
<Tooltip variant="primary">Primary Tooltip</Tooltip>
<Tooltip variant="secondary">Secondary Tooltip</Tooltip>
```

### Sizes

```jsx
<Tooltip size="sm">Small Tooltip</Tooltip>
<Tooltip size="md">Medium Tooltip</Tooltip>
<Tooltip size="lg">Large Tooltip</Tooltip>
```

### Disabled State

```jsx
<Tooltip disabled>Disabled Tooltip</Tooltip>
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