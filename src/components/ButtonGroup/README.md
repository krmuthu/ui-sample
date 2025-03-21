# ButtonGroup Component

## Overview

The buttons to be rendered inside the group

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { ButtonGroup } from 'clipper-ui';

function MyComponent() {
  return (
    <ButtonGroup 
      variant="primary" 
      size="md"
    >
      Content goes here
    </ButtonGroup>
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
<ButtonGroup>Default ButtonGroup</ButtonGroup>
```

### Variants

```jsx
<ButtonGroup variant="primary">Primary ButtonGroup</ButtonGroup>
<ButtonGroup variant="secondary">Secondary ButtonGroup</ButtonGroup>
```

### Sizes

```jsx
<ButtonGroup size="sm">Small ButtonGroup</ButtonGroup>
<ButtonGroup size="md">Medium ButtonGroup</ButtonGroup>
<ButtonGroup size="lg">Large ButtonGroup</ButtonGroup>
```

### Disabled State

```jsx
<ButtonGroup disabled>Disabled ButtonGroup</ButtonGroup>
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