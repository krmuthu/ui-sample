# Avatar Component

## Overview

The source URL for the avatar image

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Avatar } from 'clipper-ui';

function MyComponent() {
  return (
    <Avatar 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Avatar>
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
<Avatar>Default Avatar</Avatar>
```

### Variants

```jsx
<Avatar variant="primary">Primary Avatar</Avatar>
<Avatar variant="secondary">Secondary Avatar</Avatar>
```

### Sizes

```jsx
<Avatar size="sm">Small Avatar</Avatar>
<Avatar size="md">Medium Avatar</Avatar>
<Avatar size="lg">Large Avatar</Avatar>
```

### Disabled State

```jsx
<Avatar disabled>Disabled Avatar</Avatar>
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