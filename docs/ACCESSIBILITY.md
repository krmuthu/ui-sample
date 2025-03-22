# Accessibility Guide

## Overview

Clipper UI is designed with accessibility at its core. We follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure that our components are usable by as many people as possible, including those with disabilities.

This guide provides best practices and guidelines for using Clipper UI components in an accessible way.

## Core Principles

### Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

- **Text Alternatives**: Provide text alternatives for non-text content
- **Time-based Media**: Provide alternatives for time-based media
- **Adaptable**: Create content that can be presented in different ways without losing information
- **Distinguishable**: Make it easier for users to see and hear content

### Operable

User interface components and navigation must be operable.

- **Keyboard Accessibility**: Make all functionality available from a keyboard
- **Enough Time**: Provide users enough time to read and use content
- **Seizures and Physical Reactions**: Do not design content in a way that is known to cause seizures
- **Navigable**: Provide ways to help users navigate, find content, and determine where they are

### Understandable

Information and the operation of the user interface must be understandable.

- **Readable**: Make text content readable and understandable
- **Predictable**: Make Web pages appear and operate in predictable ways
- **Input Assistance**: Help users avoid and correct mistakes

### Robust

Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

- **Compatible**: Maximize compatibility with current and future user agents, including assistive technologies

## Component-specific Guidelines

### Buttons and Interactive Elements

- Always include a descriptive label for buttons and interactive elements
- Use the appropriate semantic element (button, link, etc.)
- Ensure all interactive elements are keyboard accessible
- Provide visible focus states for all interactive elements
- Use appropriate ARIA roles and attributes for custom interactive elements

```jsx
// Good
<Button aria-label="Close dialog">×</Button>

// Bad
<div onClick={closeDialog}>×</div>
```

### Forms

- Associate labels with form controls using htmlFor/id
- Group related form controls with fieldset and legend
- Provide clear error messages that don't rely solely on color
- Use FormControl components to handle form state and validation
- Ensure form controls have descriptive names
- Use appropriate input types (email, tel, number, etc.)

```jsx
// Good
<FormControl isRequired isInvalid={!!error}>
  <FormLabel htmlFor="email">Email Address</FormLabel>
  <TextField
    id="email"
    type="email"
    aria-describedby="email-error email-hint"
    value={email}
    onChange={handleChange}
  />
  {error && (
    <FormErrorMessage id="email-error">{error}</FormErrorMessage>
  )}
  <FormHelperText id="email-hint">
    We'll never share your email.
  </FormHelperText>
</FormControl>

// Bad
<div>
  <div>Email Address</div>
  <input value={email} onChange={handleChange} />
  <div style={{ color: 'red' }}>{error}</div>
</div>
```

### Navigation

- Use semantic elements like nav for navigation
- Implement proper focus management
- Provide skip links to bypass repeated navigation
- Use ARIA landmarks to identify page regions
- Ensure menu items are keyboard navigable

```jsx
// Good
<nav aria-label="Main Navigation">
  <Menu>
    <MenuButton as={Button}>
      Navigation
    </MenuButton>
    <MenuList>
      <MenuItem onSelect={() => navigate('/home')}>Home</MenuItem>
      <MenuItem onSelect={() => navigate('/about')}>About</MenuItem>
    </MenuList>
  </Menu>
</nav>

// Skip link example
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Dialog and Modal

- Trap focus within the dialog when open
- Return focus to the triggering element when closed
- Use appropriate ARIA roles and attributes
- Allow closing via Escape key
- Ensure dialog is announced to screen readers

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  initialFocus={initialFocusRef}
  finalFocus={finalFocusRef}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirmation</h2>
  <p id="dialog-description">
    Are you sure you want to proceed with this action?
  </p>
</Dialog>
```

### Images and Icons

- Provide alternative text for all images
- Use decorative images appropriately
- Ensure icons have proper accessible names
- Make sure icon-only buttons have descriptive accessible names

```jsx
// Good
<img src="logo.png" alt="Company Logo" />

// Decorative image
<img src="decoration.png" alt="" role="presentation" />

// Icon button
<IconButton
  aria-label="Search"
  icon={<SearchIcon />}
  onClick={handleSearch}
/>
```

### Tables

- Use semantic table elements (table, thead, tbody, th, etc.)
- Include proper table headers with scope attributes
- Use caption or aria-labelledby to provide table description
- Avoid complex nested tables

```jsx
<Table aria-labelledby="table-title">
  <caption id="table-title">Monthly Budget Report</caption>
  <thead>
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Budget</th>
      <th scope="col">Actual</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Groceries</th>
      <td>$500</td>
      <td>$450</td>
    </tr>
  </tbody>
</Table>
```

### Color and Contrast

- Don't rely solely on color to convey information
- Ensure text has sufficient contrast with its background
- Test color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Provide visual indicators beyond color for states like error, success, etc.

```jsx
// Good - Uses both color and icon/text to indicate state
<Alert status="error">
  <AlertIcon />
  There was an error processing your request
</Alert>

// Bad - Relies only on color
<div style={{ color: 'red' }}>
  There was an error processing your request
</div>
```

## Testing for Accessibility

### Automated Testing

Automated testing tools can help identify many common accessibility issues:

- **ESLint with jsx-a11y**: Add to your development workflow
- **Axe-core**: Include in your unit and integration tests
- **Lighthouse**: Run accessibility audits during development

### Manual Testing

Manual testing is essential for thorough accessibility evaluation:

- **Keyboard Testing**: Test all functionality using only a keyboard
- **Screen Reader Testing**: Test with popular screen readers (NVDA, JAWS, VoiceOver)
- **Zoom Testing**: Test with page zoomed to 200% and 400%
- **Reduced Motion**: Test with reduced motion preferences enabled
- **High Contrast**: Test with high contrast mode enabled

## Keyboard Shortcuts and Navigation

| Component          | Key         | Action                                 |
|-------------------|-------------|----------------------------------------|
| Buttons           | Space/Enter | Activate button                         |
| Menu              | Space/Enter | Open menu                               |
|                   | Escape      | Close menu                              |
|                   | Arrow Keys  | Navigate between menu items             |
| Dialog            | Escape      | Close dialog                           |
|                   | Tab         | Navigate within dialog (focus trapped)  |
| Tabs              | Arrow Keys  | Navigate between tabs                   |
| Accordion         | Space/Enter | Toggle panel                           |
|                   | Arrow Keys  | Navigate between accordion items        |
| Select            | Space/Enter | Open dropdown                          |
|                   | Arrow Keys  | Navigate between options                |
|                   | Escape      | Close dropdown                         |
| DatePicker        | Arrow Keys  | Navigate between dates                 |
|                   | Space/Enter | Select date                            |
|                   | Escape      | Close calendar                         |

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [MDN Web Docs: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components by Heydon Pickering](https://inclusive-components.design/)

## Clipper UI Accessibility Features

Clipper UI includes several built-in features to support accessibility:

- **Focus Management**: Automatic focus trapping in modals and menus
- **Keyboard Navigation**: Full keyboard support for all interactive components
- **ARIA Attributes**: Proper ARIA roles, states, and properties
- **Color Contrast**: All components meet WCAG AA contrast requirements
- **Screen Reader Support**: Components announce their state changes
- **Reduced Motion**: Support for users who prefer reduced motion
- **Form Validation**: Accessible error states and announcements

## Frequently Asked Questions

### How do I make my forms accessible?

Use the Form components provided by Clipper UI, which handle proper labeling, validation, and error messaging:

- Always use FormLabel components for form controls
- Associate labels with controls using the htmlFor and id attributes
- Use FormErrorMessage for validation errors
- Use FormControl isRequired and isInvalid props for states

### How can I make my images accessible?

- Always provide alternative text with the alt attribute
- Use empty alt attributes (alt="") for decorative images
- Make sure complex images have detailed descriptions

### How do I handle keyboard navigation for custom components?

- Ensure all interactive elements can receive focus (tabIndex="0")
- Implement keyboard event handlers (Enter, Space, Arrow keys)
- Follow established patterns from WAI-ARIA Authoring Practices
- Test thoroughly with keyboard-only navigation

### How do I handle focus management in modals and dialogs?

Clipper UI's Dialog component handles this automatically, but for custom implementations:

- Trap focus within the modal when open
- Return focus to the triggering element when closed
- Provide a way to close the modal with the Escape key
- Ensure the first focusable element receives focus when the modal opens

### How do I make tables accessible?

- Use proper table markup (table, thead, tbody, th, etc.)
- Use scope attributes on th elements (scope="col" or scope="row")
- Provide captions or ARIA labels for tables
- Keep tables simple and avoid complex nesting

## Conclusion

Accessibility is not just a checklist but a continuous process. By following these guidelines and using Clipper UI components as intended, you can create web applications that are usable by as many people as possible, regardless of their abilities or disabilities.

Remember that accessible design benefits everyone, not just users with disabilities. An accessible interface is often more usable, more maintainable, and reaches a wider audience. 