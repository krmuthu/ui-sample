# Radio Component

## Overview

Props for the Radio component

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Radio } from 'clipper-ui';

function MyComponent() {
  return (
    <Radio 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Radio>
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
<Radio>Default Radio</Radio>
```

### Variants

```jsx
<Radio variant="primary">Primary Radio</Radio>
<Radio variant="secondary">Secondary Radio</Radio>
```

### Sizes

```jsx
<Radio size="sm">Small Radio</Radio>
<Radio size="md">Medium Radio</Radio>
<Radio size="lg">Large Radio</Radio>
```

### Disabled State

```jsx
<Radio disabled>Disabled Radio</Radio>
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