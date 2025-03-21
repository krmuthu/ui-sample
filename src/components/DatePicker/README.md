# DatePicker Component

## Overview

The selected date value

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { DatePicker } from 'clipper-ui';

function MyComponent() {
  return (
    <DatePicker 
      variant="primary" 
      size="md"
    >
      Content goes here
    </DatePicker>
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
<DatePicker>Default DatePicker</DatePicker>
```

### Variants

```jsx
<DatePicker variant="primary">Primary DatePicker</DatePicker>
<DatePicker variant="secondary">Secondary DatePicker</DatePicker>
```

### Sizes

```jsx
<DatePicker size="sm">Small DatePicker</DatePicker>
<DatePicker size="md">Medium DatePicker</DatePicker>
<DatePicker size="lg">Large DatePicker</DatePicker>
```

### Disabled State

```jsx
<DatePicker disabled>Disabled DatePicker</DatePicker>
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