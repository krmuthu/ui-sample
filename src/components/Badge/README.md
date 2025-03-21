# Badge Component

## Overview

The Badge component is designed to display small counts, labels, or status indicators. It's commonly used for notification counts, status indicators, or marking items with labels.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

```jsx
import { Badge } from 'clipper-ui';

function Example() {
  return (
    <div>
      <Badge variant="primary">New</Badge>
      <Badge variant="secondary" size="sm">5</Badge>
      <Badge variant="default" size="lg">Status</Badge>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary'` | `'default'` | Visual variant of the badge |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the badge |
| `disabled` | `boolean` | `false` | Whether the badge is disabled |
| `className` | `string` | `''` | Additional CSS class names |
| `onClick` | `(event: React.MouseEvent<HTMLElement>) => void` | - | Callback fired when the badge is clicked |
| `children` | `React.ReactNode` | - | Content of the badge |

## Examples

### Basic Usage

```jsx
<Badge>Default Badge</Badge>
```

### Variants

```jsx
<Badge variant="primary">Primary Badge</Badge>
<Badge variant="secondary">Secondary Badge</Badge>
```

### Sizes

```jsx
<Badge size="sm">Small Badge</Badge>
<Badge size="md">Medium Badge</Badge>
<Badge size="lg">Large Badge</Badge>
```

### Interactive Badge

```jsx
<Badge 
  variant="primary" 
  onClick={() => console.log('Badge clicked')}
>
  Click me
</Badge>
```

### With Icons

```jsx
import { Icon } from 'clipper-ui';

<Badge variant="primary">
  <Icon name="check" />
  Verified
</Badge>
```

### Notification Badge

```jsx
<button className="relative">
  <Icon name="bell" />
  <Badge 
    variant="primary" 
    size="sm" 
    className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
  >
    5
  </Badge>
</button>
```

## Accessibility

- When using a Badge purely as a visual indicator without interaction, ensure it has an appropriate `aria-label` if the content doesn't clearly convey its purpose.
- If the Badge is interactive, ensure it has appropriate focus styling and keyboard interaction.
- Avoid relying solely on color to convey information; use text or icons as well.
- When using badges for status indicators, consider using appropriate ARIA roles and states:

```jsx
<Badge 
  variant="primary"
  role="status"
  aria-label="User account status: active"
>
  Active
</Badge>
```

## Best Practices

- Use badges sparingly to avoid visual clutter
- Keep badge content concise (ideally 1-3 characters for number badges)
- Use consistent badge styles across your application
- Choose badge colors that provide sufficient contrast against the background
- When used for notification counts, consider accessibility for screen readers

## Design Considerations

- Badge background colors should maintain at least a 3:1 contrast ratio with their container
- Text within badges should maintain a 4.5:1 contrast ratio with the badge background
- For notification badges, position consistently (typically top-right of the related element)
- Size badges appropriately for their content (don't make them too tight or too large) 