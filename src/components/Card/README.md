# Card Component

## Overview

The content of the card

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Card } from 'clipper-ui';

function MyComponent() {
  return (
    <Card 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Card>
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
<Card>Default Card</Card>
```

### Variants

```jsx
<Card variant="primary">Primary Card</Card>
<Card variant="secondary">Secondary Card</Card>
```

### Sizes

```jsx
<Card size="sm">Small Card</Card>
<Card size="md">Medium Card</Card>
<Card size="lg">Large Card</Card>
```

### Disabled State

```jsx
<Card disabled>Disabled Card</Card>
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