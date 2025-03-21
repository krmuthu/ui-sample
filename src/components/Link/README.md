# Link Component

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
import { Link } from 'clipper-ui';

function MyComponent() {
  return (
    <Link 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Link>
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
<Link>Default Link</Link>
```

### Variants

```jsx
<Link variant="primary">Primary Link</Link>
<Link variant="secondary">Secondary Link</Link>
```

### Sizes

```jsx
<Link size="sm">Small Link</Link>
<Link size="md">Medium Link</Link>
<Link size="lg">Large Link</Link>
```

### Disabled State

```jsx
<Link disabled>Disabled Link</Link>
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