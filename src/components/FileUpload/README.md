# FileUpload Component

## Overview

Unique identifier for the file

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { FileUpload } from 'clipper-ui';

function MyComponent() {
  return (
    <FileUpload 
      variant="primary" 
      size="md"
    >
      Content goes here
    </FileUpload>
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
<FileUpload>Default FileUpload</FileUpload>
```

### Variants

```jsx
<FileUpload variant="primary">Primary FileUpload</FileUpload>
<FileUpload variant="secondary">Secondary FileUpload</FileUpload>
```

### Sizes

```jsx
<FileUpload size="sm">Small FileUpload</FileUpload>
<FileUpload size="md">Medium FileUpload</FileUpload>
<FileUpload size="lg">Large FileUpload</FileUpload>
```

### Disabled State

```jsx
<FileUpload disabled>Disabled FileUpload</FileUpload>
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