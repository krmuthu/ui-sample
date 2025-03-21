# Checkbox Component

## Overview

Props for the Checkbox component

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Checkbox } from 'clipper-ui';

function MyComponent() {
  return (
    <Checkbox 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Checkbox>
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
<Checkbox>Default Checkbox</Checkbox>
```

### Variants

```jsx
<Checkbox variant="primary">Primary Checkbox</Checkbox>
<Checkbox variant="secondary">Secondary Checkbox</Checkbox>
```

### Sizes

```jsx
<Checkbox size="sm">Small Checkbox</Checkbox>
<Checkbox size="md">Medium Checkbox</Checkbox>
<Checkbox size="lg">Large Checkbox</Checkbox>
```

### Disabled State

```jsx
<Checkbox disabled>Disabled Checkbox</Checkbox>
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