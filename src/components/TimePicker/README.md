# TimePicker Component

## Overview

The selected time value

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { TimePicker } from 'clipper-ui';

function MyComponent() {
  return (
    <TimePicker 
      variant="primary" 
      size="md"
    >
      Content goes here
    </TimePicker>
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
<TimePicker>Default TimePicker</TimePicker>
```

### Variants

```jsx
<TimePicker variant="primary">Primary TimePicker</TimePicker>
<TimePicker variant="secondary">Secondary TimePicker</TimePicker>
```

### Sizes

```jsx
<TimePicker size="sm">Small TimePicker</TimePicker>
<TimePicker size="md">Medium TimePicker</TimePicker>
<TimePicker size="lg">Large TimePicker</TimePicker>
```

### Disabled State

```jsx
<TimePicker disabled>Disabled TimePicker</TimePicker>
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