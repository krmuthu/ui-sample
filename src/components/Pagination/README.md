# Pagination Component

## Overview

The current page number (1-based)

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Pagination } from 'clipper-ui';

function MyComponent() {
  return (
    <Pagination 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Pagination>
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
<Pagination>Default Pagination</Pagination>
```

### Variants

```jsx
<Pagination variant="primary">Primary Pagination</Pagination>
<Pagination variant="secondary">Secondary Pagination</Pagination>
```

### Sizes

```jsx
<Pagination size="sm">Small Pagination</Pagination>
<Pagination size="md">Medium Pagination</Pagination>
<Pagination size="lg">Large Pagination</Pagination>
```

### Disabled State

```jsx
<Pagination disabled>Disabled Pagination</Pagination>
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