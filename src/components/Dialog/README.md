# Dialog Component

## Overview

The Dialog component displays content that requires user attention or interaction in an overlay window. It's commonly used for confirmations, forms, alerts, and other content that should interrupt the user's current workflow.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Import

```jsx
import { Dialog } from 'clipper-ui';
```

## Usage

```jsx
import React, { useState } from 'react';
import { Dialog, Button } from 'clipper-ui';

function Example() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmation"
      >
        <p>Are you sure you want to continue with this action?</p>
        
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            // Perform action
            setIsOpen(false);
          }}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Whether the dialog is displayed |
| `onClose` | `() => void` | - | Callback fired when the dialog is closed |
| `title` | `ReactNode` | - | Dialog title content |
| `description` | `ReactNode` | - | Secondary description text |
| `children` | `ReactNode` | - | Dialog body content |
| `closeOnEsc` | `boolean` | `true` | Whether pressing the Escape key closes the dialog |
| `closeOnOverlayClick` | `boolean` | `true` | Whether clicking the overlay closes the dialog |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Controls the size/width of the dialog |
| `initialFocus` | `React.RefObject<HTMLElement>` | - | Element to receive focus when the dialog opens |
| `finalFocus` | `React.RefObject<HTMLElement>` | - | Element to receive focus when the dialog closes |
| `overlayClassName` | `string` | - | CSS class for the overlay |
| `contentClassName` | `string` | - | CSS class for the dialog content |
| `hideCloseButton` | `boolean` | `false` | Whether to hide the close button in the corner |
| `preventScroll` | `boolean` | `true` | Whether to prevent scrolling of the page behind the dialog |

## Accessibility Features

The Dialog component implements WAI-ARIA best practices for dialogs and modals:

### Focus Management

- When opened, focus moves to the dialog or an element inside it (set with `initialFocus`)
- Focus is trapped within the dialog while open - users can't Tab to elements outside
- When closed, focus returns to the element that opened it (or element set with `finalFocus`)
- The close button is focusable and keyboard-accessible

### Keyboard Navigation

- <kbd>Escape</kbd>: Closes the dialog (unless `closeOnEsc` is `false`)
- <kbd>Tab</kbd>: Moves focus to the next focusable element within the dialog
- <kbd>Shift</kbd>+<kbd>Tab</kbd>: Moves focus to the previous focusable element within the dialog

### ARIA Attributes

- `role="dialog"` identifies the element as a dialog
- `aria-modal="true"` indicates it's a modal dialog
- `aria-labelledby` links to the dialog title for screen readers
- `aria-describedby` links to the dialog description (if available)

### Screen Reader Announcements

- Dialog opening and closing is announced
- The dialog title is announced when opened
- Dialog size and position allow for readability on screen magnifiers

## Accessibility Examples

### Properly Labeled Dialog

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Delete Confirmation"
  description="This action cannot be undone."
>
  <p>Are you sure you want to delete this item?</p>
  <div className="flex justify-end gap-3 mt-4">
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </div>
</Dialog>
```

### Alert Dialog

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Warning"
  role="alertdialog" // Changes role to alertdialog
  description="You have unsaved changes that will be lost."
>
  <p>If you leave this page, all unsaved changes will be lost.</p>
  <div className="flex justify-end gap-3 mt-4">
    <Button variant="secondary" onClick={handleStay}>Stay on Page</Button>
    <Button variant="danger" onClick={handleLeave}>Leave Page</Button>
  </div>
</Dialog>
```

### Custom Initial Focus

```jsx
function CustomFocusExample() {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocus={cancelRef}
        title="Custom Focus"
      >
        <p>This dialog focuses the cancel button when opened.</p>
        
        <div className="flex gap-3 justify-end mt-6">
          <Button 
            ref={cancelRef} 
            variant="secondary" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
}
```

## Best Practices

### Content Structure

- Use the `title` prop for the main heading
- Use the `description` prop for secondary description text
- Place action buttons at the bottom of the dialog
- Place the primary action button on the right (in LTR languages)
- Place the secondary/cancel action button to the left of the primary button

### Dialog Types

- **Confirmation Dialog**: Asks the user to confirm or cancel an action
- **Form Dialog**: Contains a form for user input
- **Information Dialog**: Provides information to the user
- **Alert Dialog**: Warns the user about a critical situation

### Accessibility Considerations

- Always provide a descriptive title
- Add a description for complex dialogs
- Ensure all interactive elements are keyboard accessible
- Use clear, action-oriented button labels
- Avoid overloading dialogs with too much content
- Test with screen readers to ensure proper announcements
- Test keyboard navigation within the dialog

### Visual Design

- Ensure sufficient contrast between the dialog and the overlay
- Provide visual indication that the rest of the UI is inaccessible
- Use consistent styling for similar types of dialogs
- Size the dialog appropriately for the content
- Consider mobile viewport sizes when designing dialogs

## Examples

### Confirmation Dialog

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Deletion"
>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  <div className="flex justify-end gap-3 mt-4">
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </div>
</Dialog>
```

### Form Dialog

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Edit Profile"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div>
        <FormLabel htmlFor="name">Name</FormLabel>
        <TextField id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    </div>
    
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary" type="submit">Save Changes</Button>
    </div>
  </form>
</Dialog>
```

### Full-Screen Dialog

```jsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="Image Preview"
  size="full"
>
  <div className="flex items-center justify-center h-full">
    <img src={imageUrl} alt="Preview" className="max-h-full max-w-full" />
  </div>
  <Button
    variant="secondary"
    className="absolute top-4 right-4"
    onClick={onClose}
    aria-label="Close preview"
  >
    Close
  </Button>
</Dialog>
```

## Related Components

- **Modal**: More flexible container without predefined header/footer
- **Drawer**: Side panel that slides in from the edge of the screen
- **Toast**: For non-blocking notifications that don't require user interaction 