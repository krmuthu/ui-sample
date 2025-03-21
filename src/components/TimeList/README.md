# TimeList Component

## Overview

The selected hour

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { TimeList } from 'clipper-ui';

function MyComponent() {
  return (
    <TimeList 
      variant="primary" 
      size="md"
    >
      Content goes here
    </TimeList>
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
<TimeList>Default TimeList</TimeList>
```

### Variants

```jsx
<TimeList variant="primary">Primary TimeList</TimeList>
<TimeList variant="secondary">Secondary TimeList</TimeList>
```

### Sizes

```jsx
<TimeList size="sm">Small TimeList</TimeList>
<TimeList size="md">Medium TimeList</TimeList>
<TimeList size="lg">Large TimeList</TimeList>
```

### Disabled State

```jsx
<TimeList disabled>Disabled TimeList</TimeList>
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