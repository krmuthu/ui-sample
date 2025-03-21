# Grid Component

## Overview

Content to be rendered inside the container

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Grid } from 'clipper-ui';

function MyComponent() {
  return (
    <Grid 
      variant="primary" 
      size="md"
    >
      Content goes here
    </Grid>
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
<Grid>Default Grid</Grid>
```

### Variants

```jsx
<Grid variant="primary">Primary Grid</Grid>
<Grid variant="secondary">Secondary Grid</Grid>
```

### Sizes

```jsx
<Grid size="sm">Small Grid</Grid>
<Grid size="md">Medium Grid</Grid>
<Grid size="lg">Large Grid</Grid>
```

### Disabled State

```jsx
<Grid disabled>Disabled Grid</Grid>
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