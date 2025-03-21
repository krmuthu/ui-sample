# Accordion Component

## Overview

Children must be AccordionItem components

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Accordion } from 'clipper-ui';

function MyComponent() {
  return (
    <Accordion 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Accordion>
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
<Accordion>Default Accordion</Accordion>
```

### Variants

```jsx
<Accordion variant="primary">Primary Accordion</Accordion>
<Accordion variant="secondary">Secondary Accordion</Accordion>
```

### Sizes

```jsx
<Accordion size="sm">Small Accordion</Accordion>
<Accordion size="md">Medium Accordion</Accordion>
<Accordion size="lg">Large Accordion</Accordion>
```

### Disabled State

```jsx
<Accordion disabled>Disabled Accordion</Accordion>
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