# Table Component

## Overview

Unique identifier for the column

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Table } from 'clipper-ui';

function MyComponent() {
  return (
    <Table 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Table>
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
<Table>Default Table</Table>
```

### Variants

```jsx
<Table variant="primary">Primary Table</Table>
<Table variant="secondary">Secondary Table</Table>
```

### Sizes

```jsx
<Table size="sm">Small Table</Table>
<Table size="md">Medium Table</Table>
<Table size="lg">Large Table</Table>
```

### Disabled State

```jsx
<Table disabled>Disabled Table</Table>
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