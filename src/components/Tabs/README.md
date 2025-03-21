# Tabs Component

## Overview

Unique identifier for the tab

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Tabs } from 'clipper-ui';

function MyComponent() {
  return (
    <Tabs 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Tabs>
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
<Tabs>Default Tabs</Tabs>
```

### Variants

```jsx
<Tabs variant="primary">Primary Tabs</Tabs>
<Tabs variant="secondary">Secondary Tabs</Tabs>
```

### Sizes

```jsx
<Tabs size="sm">Small Tabs</Tabs>
<Tabs size="md">Medium Tabs</Tabs>
<Tabs size="lg">Large Tabs</Tabs>
```

### Disabled State

```jsx
<Tabs disabled>Disabled Tabs</Tabs>
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