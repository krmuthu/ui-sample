# Popover Component

## Overview

The trigger element that opens the popover

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Popover } from 'clipper-ui';

function MyComponent() {
  return (
    <Popover 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Popover>
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
<Popover>Default Popover</Popover>
```

### Variants

```jsx
<Popover variant="primary">Primary Popover</Popover>
<Popover variant="secondary">Secondary Popover</Popover>
```

### Sizes

```jsx
<Popover size="sm">Small Popover</Popover>
<Popover size="md">Medium Popover</Popover>
<Popover size="lg">Large Popover</Popover>
```

### Disabled State

```jsx
<Popover disabled>Disabled Popover</Popover>
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