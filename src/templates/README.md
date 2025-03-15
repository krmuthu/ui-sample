# Clipper UI Component Templates

This directory contains templates and guidelines for developing new components for the Clipper UI library.

## Component Structure

Follow this structure for new components:

```
src/components/ComponentName/
├── ComponentName.tsx        # Main component implementation
├── ComponentName.test.tsx   # Component tests
└── ComponentName.stories.tsx # Storybook stories
```

## Best Practices

### 1. Interface and Component Structure

```tsx
// Define the props interface with JSDoc comments
export interface ButtonProps {
  /** Description of the prop */
  variant?: 'primary' | 'secondary';
  // Other props...
}

// Define the component with default props
export const Button = ({
  variant = 'primary',
  // Other props with defaults...
  ...rest
}: ButtonProps) => {
  // Implementation
};

export default Button;
```

### 2. Styling Approach

- Use Tailwind utility classes directly in components
- Leverage CSS variables for theming (defined in `src/styles/globals.css`)
- For complex styling logic, consider utility functions:

```tsx
const getButtonClasses = (variant, size, fullWidth) => {
  // Logic to build class string
  return `${variantClasses} ${sizeClasses} ${fullWidth ? 'w-full' : ''}`;
};
```

### 3. Documentation

- Use JSDoc comments on interface properties
- Include examples in component documentation
- Export types/interfaces that consumers might need
- Add sensible default values for optional props

## Example Component

See `ComponentTemplate.tsx` in this directory for a complete example that follows these practices.

## Testing Guidelines

- Test all component variants
- Test interactivity where applicable
- Use the `renderWithTheme` helper for theme-aware testing

## Story Guidelines

- Create a default story with controls
- Showcase all variants and important prop combinations
- Use the global theme decorator (no need to add ThemeProvider in each story) 