# Accessibility Guidelines

Clipper UI is committed to providing accessible components that comply with [WCAG 2.1 AA standards](https://www.w3.org/TR/WCAG21/). This document outlines the accessibility requirements and best practices for developing with Clipper UI.

## Core Principles

1. **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.
2. **Operable**: User interface components and navigation must be operable.
3. **Understandable**: Information and the operation of the user interface must be understandable.
4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

## Component Requirements

All components in Clipper UI should meet the following requirements:

### Keyboard Accessibility

- All interactive elements must be accessible via keyboard
- Focus states must be visually obvious (use the built-in focus styles)
- Focus order should follow a logical sequence
- Keyboard traps must be avoided
- Provide keyboard shortcuts where appropriate

### Screen Reader Support

- Use semantic HTML elements where possible
- Add appropriate ARIA attributes when necessary
- Ensure all interactive elements have accessible names
- Provide context for screen reader users

### Color and Contrast

- Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
- Don't rely on color alone to convey meaning
- Support high contrast mode
- Offer sufficient color options for various needs

### Motion and Animation

- Respect user preferences for reduced motion
- Avoid flashing content that could trigger seizures
- Make animations optional when possible

## Implementation Guidelines

### Buttons

- Use the `Button` component instead of plain `<button>` elements
- Always provide a descriptive label
- Use aria-label when the button only contains an icon

```jsx
// Good
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

// Bad
<button>
  <CloseIcon />
</button>
```

### Forms

- Always use labels with form controls
- Group related form elements with fieldsets
- Provide error messages that are programmatically associated with inputs
- Ensure form validation errors are announced to screen readers

```jsx
// Good
<FormLabel htmlFor="name" required>Name</FormLabel>
<TextField 
  id="name" 
  aria-describedby="name-error"
  error={errors.name} 
/>
{errors.name && <span id="name-error" className="error">{errors.name}</span>}

// Bad
<input placeholder="Enter your name" />
```

### Images and Icons

- Always provide alt text for images
- Use empty alt text for decorative images
- Ensure icon buttons have accessible labels

```jsx
// Good
<img src="profile.jpg" alt="User profile picture" />

// For decorative images
<img src="decorative.jpg" alt="" role="presentation" />
```

### Modals and Dialogs

- Trap focus within modal dialogs
- Provide a clear way to dismiss the dialog
- Use appropriate ARIA roles
- Return focus to the trigger element when closed

```jsx
<Dialog 
  open={isOpen} 
  onClose={handleClose} 
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirmation</h2>
  <p id="dialog-description">Are you sure you want to continue?</p>
  <Button onClick={handleClose}>Cancel</Button>
  <Button onClick={handleConfirm}>Confirm</Button>
</Dialog>
```

### Tables

- Use proper table markup with headers
- Associate cells with headers
- Provide captions for tables when appropriate

```jsx
<Table caption="Monthly Budget">
  <TableHead>
    <TableRow>
      <TableHeader>Category</TableHeader>
      <TableHeader>Amount</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Rent</TableCell>
      <TableCell>$1,200</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Testing Accessibility

Before submitting your component, ensure you've tested it for accessibility:

1. **Keyboard Testing**: Test your component using only the keyboard
2. **Screen Reader Testing**: Test with VoiceOver (macOS), NVDA or JAWS (Windows), or TalkBack (Android)
3. **Color Contrast**: Check contrast ratios with tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
4. **Automated Testing**: Use tools like axe, lighthouse, or jest-axe

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/) 