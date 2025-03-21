# Button Component

## Overview

The Button component is a versatile interactive element used for triggering actions, submitting forms, and navigating between pages. It supports various visual styles, sizes, and states to meet different design requirements and use cases.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Import

```jsx
import { Button } from 'clipper-ui';
```

## Usage

```jsx
// Basic button
<Button>Click me</Button>

// Primary button
<Button variant="primary">Primary Action</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'outline' \| 'danger'` | `'primary'` | The visual style of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the button |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | The HTML button type attribute |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `fullWidth` | `boolean` | `false` | Whether the button should take full width of its container |
| `loading` | `boolean` | `false` | Whether to show a loading indicator |
| `loadingText` | `string` | - | Text to show when in loading state |
| `leftIcon` | `ReactNode` | - | Icon to show before the button text |
| `rightIcon` | `ReactNode` | - | Icon to show after the button text |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Function called when the button is clicked |
| `children` | `ReactNode` | - | Content of the button |
| `className` | `string` | - | Additional CSS classes |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | - | Additional HTML button attributes |

## Examples

### Variants

```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
```

### Sizes

```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### With Icons

```jsx
import { Icon } from 'clipper-ui';

<Button leftIcon={<Icon name="plus" />}>Add Item</Button>
<Button rightIcon={<Icon name="arrow-right" />}>Next</Button>
<Button leftIcon={<Icon name="download" />} rightIcon={<Icon name="arrow-down" />}>
  Download
</Button>
```

### Loading State

```jsx
<Button loading>Loading</Button>
<Button loading loadingText="Submitting...">Submit</Button>
```

### Full Width

```jsx
<Button fullWidth>Full Width Button</Button>
```

### As a Link

```jsx
<Button as="a" href="https://example.com" target="_blank">
  Visit Website
</Button>
```

### Form Submission

```jsx
<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <Button type="submit">Submit Form</Button>
</form>
```

## Accessibility

- Buttons are focusable by default and can be activated with keyboard
- When using the `as` prop to render as a different element, ensure proper accessibility attributes are maintained
- Use appropriate text for screen readers:
  - Avoid generic labels like "Click Here"
  - Consider the action the button performs
  - If the button only contains an icon, provide an `aria-label`
- Loading states are announced to screen readers using `aria-busy` and `aria-live`

```jsx
// Button with icon only
<Button 
  variant="ghost" 
  aria-label="Close dialog"
  onClick={closeDialog}
>
  <Icon name="x" />
</Button>
```

## Best Practices

- Use the `primary` variant for the main call-to-action on a page
- Use the `secondary` variant for less prominent actions
- Use the `danger` variant for destructive actions (e.g., delete)
- Maintain a logical tab order for keyboard users
- Group related buttons together (visually and in DOM order)
- Use appropriate sizing:
  - `lg` for main page actions
  - `md` for most interface actions
  - `sm` for compact UIs or less important actions
- Provide visual feedback for hover, focus, and active states
- Avoid using too many primary buttons on the same page

## Design Considerations

- Maintain a minimum touch target size of 44×44px for mobile interfaces
- Ensure text has sufficient contrast against the button background
- Consider button width and padding for different label lengths
- Be consistent with button styling across the application
- Ensure disabled states are visually distinct but maintain sufficient contrast
- Consider button placement in the overall layout
  - Primary actions typically go on the right in Western interfaces
  - Secondary actions typically go on the left
  - Form submission buttons usually align with the form fields

## Related Components

- **ButtonGroup**: For grouping related buttons
- **IconButton**: For buttons that only contain an icon
- **LinkButton**: For navigation-specific buttons

## Component API Examples

### Basic Button Props

```jsx
<Button
  variant="primary"
  size="md"
  disabled={false}
  loading={isLoading}
  onClick={handleClick}
  type="button"
  fullWidth={false}
>
  Button Text
</Button>
```

### Complete Example with All Props

```jsx
<Button
  variant="primary"
  size="md"
  type="button"
  disabled={false}
  fullWidth={false}
  loading={isLoading}
  loadingText="Processing..."
  leftIcon={<Icon name="save" />}
  rightIcon={<Icon name="arrow-right" />}
  className="my-custom-class"
  onClick={handleClick}
  aria-label="Save and continue"
  data-testid="save-button"
>
  Save and Continue
</Button>
``` 