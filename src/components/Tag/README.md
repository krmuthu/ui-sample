# Tag Component

## Overview

The text content of the tag

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Tag } from 'clipper-ui';

function MyComponent() {
  return (
    <Tag 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Tag>
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
<Tag>Default Tag</Tag>
```

### Variants

```jsx
<Tag variant="primary">Primary Tag</Tag>
<Tag variant="secondary">Secondary Tag</Tag>
```

### Sizes

```jsx
<Tag size="sm">Small Tag</Tag>
<Tag size="md">Medium Tag</Tag>
<Tag size="lg">Large Tag</Tag>
```

### Disabled State

```jsx
<Tag disabled>Disabled Tag</Tag>
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