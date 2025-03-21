# Menu Component

## Overview

The Menu component provides a dropdown list of options that appear when triggered by a button or other interactive element. It's commonly used for navigation, settings, actions, and displaying contextual lists of options.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Import

```jsx
import { Menu, MenuButton, MenuList, MenuItem } from 'clipper-ui';
```

## Usage

```jsx
import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from 'clipper-ui';

function Example() {
  return (
    <Menu>
      <MenuButton as={Button}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => console.log('Edit')}>Edit</MenuItem>
        <MenuItem onSelect={() => console.log('Duplicate')}>Duplicate</MenuItem>
        <MenuItem onSelect={() => console.log('Delete')}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
}
```

## Components

The Menu system consists of several components:

### Menu

The wrapper component that provides context for all menu components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | If provided, controls the open state of the menu |
| `defaultIsOpen` | `boolean` | `false` | Initial open state when uncontrolled |
| `onOpen` | `() => void` | - | Callback when menu opens |
| `onClose` | `() => void` | - | Callback when menu closes |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'auto'` | `'bottom'` | Placement of the menu |
| `autoSelect` | `boolean` | `true` | Auto focuses the first menu item when opened |
| `closeOnSelect` | `boolean` | `true` | Close the menu when an item is selected |
| `closeOnBlur` | `boolean` | `true` | Close the menu when focus leaves the menu |
| `children` | `ReactNode` | - | The MenuButton and MenuList components |

### MenuButton

The trigger button that opens/closes the menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `Button` | The component to render as |
| `children` | `ReactNode` | - | The content of the button |

### MenuList

The container for menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | MenuItem components |
| `maxHeight` | `string \| number` | - | Maximum height of the menu list |
| `minWidth` | `string \| number` | - | Minimum width of the menu list |

### MenuItem

An individual selectable item within the MenuList.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `() => void` | - | Callback when item is selected |
| `isDisabled` | `boolean` | `false` | If true, item is not selectable |
| `isFocused` | `boolean` | `false` | If true, item has visual focused style |
| `children` | `ReactNode` | - | The content of the menu item |
| `icon` | `ReactElement` | - | Icon to display before the label |
| `command` | `string` | - | Right-aligned label for keyboard command |

### MenuDivider

A horizontal divider for visually separating groups of menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### MenuGroup

A logical grouping of menu items with an optional label.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Title of the group |
| `children` | `ReactNode` | - | MenuItem components |
| `className` | `string` | - | Additional CSS classes |

## Keyboard Navigation

The Menu component provides comprehensive keyboard navigation support:

| Key | Action |
|-----|--------|
| <kbd>Enter</kbd> / <kbd>Space</kbd> | When focus is on `MenuButton`: Opens the menu<br>When focus is on `MenuItem`: Selects the item |
| <kbd>↓</kbd> / <kbd>Tab</kbd> | Moves focus to the next menu item |
| <kbd>↑</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to the previous menu item |
| <kbd>Home</kbd> | Moves focus to the first menu item |
| <kbd>End</kbd> | Moves focus to the last menu item |
| <kbd>Esc</kbd> | Closes the menu and returns focus to the `MenuButton` |
| <kbd>A</kbd> through <kbd>Z</kbd> | Moves focus to the next menu item starting with the pressed letter |

## Accessibility Features

The Menu component implements WCAG and WAI-ARIA guidelines for dropdown menus:

### ARIA Attributes

- `MenuButton` has `aria-haspopup="menu"` and `aria-expanded` attributes
- `MenuList` has `role="menu"` 
- `MenuItem` has `role="menuitem"`
- `MenuGroup` title has `role="group"` with `aria-labelledby`
- Proper `aria-disabled` for disabled items
- `aria-activedescendant` tracks the active menu item

### Focus Management

- Focus returns to the MenuButton when the menu is closed
- Menu items receive focus in a logical order
- Focus is trapped within the menu when open
- Active menu item is visually highlighted and announced to screen readers

### Announcements

- Menu open/close state changes are announced to screen readers
- Selection events are properly announced

## Examples

### Basic Menu

```jsx
<Menu>
  <MenuButton as={Button}>
    Options
  </MenuButton>
  <MenuList>
    <MenuItem onSelect={() => console.log('Option 1')}>Option 1</MenuItem>
    <MenuItem onSelect={() => console.log('Option 2')}>Option 2</MenuItem>
    <MenuItem onSelect={() => console.log('Option 3')}>Option 3</MenuItem>
  </MenuList>
</Menu>
```

### Menu with Groups

```jsx
<Menu>
  <MenuButton as={Button}>File</MenuButton>
  <MenuList>
    <MenuGroup title="Document">
      <MenuItem onSelect={() => console.log('New')}>New</MenuItem>
      <MenuItem onSelect={() => console.log('Open')}>Open</MenuItem>
      <MenuItem onSelect={() => console.log('Save')}>Save</MenuItem>
    </MenuGroup>
    <MenuDivider />
    <MenuGroup title="Export">
      <MenuItem onSelect={() => console.log('PDF')}>PDF</MenuItem>
      <MenuItem onSelect={() => console.log('PNG')}>PNG</MenuItem>
    </MenuGroup>
  </MenuList>
</Menu>
```

### Menu with Icons and Keyboard Shortcuts

```jsx
<Menu>
  <MenuButton as={Button}>Edit</MenuButton>
  <MenuList>
    <MenuItem 
      icon={<Icon name="cut" />} 
      command="⌘X" 
      onSelect={() => console.log('Cut')}
    >
      Cut
    </MenuItem>
    <MenuItem 
      icon={<Icon name="copy" />} 
      command="⌘C" 
      onSelect={() => console.log('Copy')}
    >
      Copy
    </MenuItem>
    <MenuItem 
      icon={<Icon name="paste" />} 
      command="⌘V" 
      onSelect={() => console.log('Paste')}
    >
      Paste
    </MenuItem>
  </MenuList>
</Menu>
```

### Multi-Level Menu (Nested)

```jsx
<Menu>
  <MenuButton as={Button}>Insert</MenuButton>
  <MenuList>
    <MenuItem onSelect={() => console.log('Image')}>Image</MenuItem>
    <MenuItem onSelect={() => console.log('Table')}>Table</MenuItem>
    <SubMenu label="Chart">
      <MenuItem onSelect={() => console.log('Bar Chart')}>Bar Chart</MenuItem>
      <MenuItem onSelect={() => console.log('Pie Chart')}>Pie Chart</MenuItem>
      <MenuItem onSelect={() => console.log('Line Chart')}>Line Chart</MenuItem>
    </SubMenu>
    <MenuItem onSelect={() => console.log('Shape')}>Shape</MenuItem>
  </MenuList>
</Menu>
```

### Controlled Menu

```jsx
function ControlledMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Menu 
      isOpen={isOpen} 
      onOpen={() => setIsOpen(true)} 
      onClose={() => setIsOpen(false)}
    >
      <MenuButton as={Button}>
        {isOpen ? 'Close' : 'Open'} Menu
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => console.log('Option 1')}>Option 1</MenuItem>
        <MenuItem onSelect={() => console.log('Option 2')}>Option 2</MenuItem>
        <MenuItem onSelect={() => console.log('Option 3')}>Option 3</MenuItem>
      </MenuList>
    </Menu>
  );
}
```

## Accessibility Patterns

### Screen Reader Description

```jsx
<Menu>
  <MenuButton 
    as={Button}
    aria-label="File operations menu"
  >
    File
  </MenuButton>
  <MenuList aria-label="File operations">
    <MenuItem onSelect={() => console.log('New')}>New</MenuItem>
    <MenuItem onSelect={() => console.log('Open')}>Open</MenuItem>
    <MenuItem onSelect={() => console.log('Save')}>Save</MenuItem>
  </MenuList>
</Menu>
```

### Disabled Items with Explanation

```jsx
<Menu>
  <MenuButton as={Button}>
    Edit Document
  </MenuButton>
  <MenuList>
    <MenuItem onSelect={() => console.log('Edit')}>Edit</MenuItem>
    <MenuItem 
      isDisabled 
      aria-disabled="true"
      aria-description="You need editor permissions to delete this document"
    >
      Delete
    </MenuItem>
  </MenuList>
</Menu>
```

## Best Practices

### Usage Guidelines

- Use short, descriptive labels for menu items
- Group related actions under logical categories
- Use dividers to separate different groups of actions
- Include keyboard shortcuts for common actions
- Keep menus focused and not too deep or broad
- Provide clear visual feedback for hover/focus states

### Placement

- For actions related to a specific item, place the menu near that item
- For global actions, place menus in consistently expected locations
- Ensure menus don't overflow outside the viewport
- Consider mobile viewports and touch targets when designing menus

### Accessibility

- Include proper ARIA roles, states, and properties
- Always provide keyboard navigation
- Ensure menu items have sufficient contrast
- Use consistent positioning and behavior across the application
- Avoid using menus for navigation when standard navigation controls would be more appropriate

## Related Components

- **Dropdown**: Simpler version for selection from a list of options
- **Select**: Form control for selecting from predefined options
- **Popover**: More general purpose overlay for any content
- **CommandMenu**: Advanced menu with search capabilities and sections 