# Contributing to Clipper UI

Thank you for your interest in contributing to Clipper UI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Component Development Guidelines](#component-development-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Guidelines](#commit-guidelines)
- [Documentation](#documentation)
- [Testing](#testing)
- [Release Process](#release-process)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/clipper-ui.git
   cd clipper-ui
   ```
3. Add the original repository as a remote to keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/original-owner/clipper-ui.git
   ```
4. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
5. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Component Generation**: Use our generator to create new component files:
   ```bash
   npm run generate ComponentName
   # or
   yarn generate ComponentName
   ```

2. **Development Server**: Run the development server to see changes in real-time:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Storybook**: Develop and test components in isolation:
   ```bash
   npm run storybook
   # or
   yarn storybook
   ```

4. **Linting**: Ensure your code follows our style guidelines:
   ```bash
   npm run lint
   # or
   yarn lint
   ```

5. **Testing**: Write and run tests for your components:
   ```bash
   npm run test
   # or
   yarn test
   ```

6. **Documentation**: Update or create documentation for your components:
   ```bash
   npm run generate:readmes
   # or
   yarn generate:readmes
   ```

## Component Development Guidelines

### Directory Structure

Each component should be structured as follows:

```
src/components/ComponentName/
├── ComponentName.tsx       # Main component implementation
├── ComponentName.test.tsx  # Test file
├── ComponentName.stories.tsx  # Storybook file
├── README.md               # Component documentation
└── index.ts                # Export file
```

### Component Implementation

- Use TypeScript for type safety
- Use functional components with hooks
- Follow the project's naming conventions
- Implement proper keyboard navigation and focus management
- Support all required accessibility features
- Follow the design system's visual guidelines
- Ensure components are responsive

### Code Style

- Follow the existing code style in the project
- Use consistent naming conventions
- Use comments to explain complex logic
- Keep components focused and maintainable
- Use appropriate TypeScript types
- Optimize for performance where needed

### TypeScript Guidelines

- Define proper interfaces for component props
- Export these interfaces for consumer use
- Use appropriate type annotations
- Avoid using `any` type
- Use generics where appropriate
- Use discriminated unions for complex state

Example:

```tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  children,
  onClick,
  className,
  ...rest
}) => {
  // Component implementation
};
```

## Accessibility Requirements

Accessibility is a core requirement for all components in Clipper UI. Each component must:

### Keyboard Navigation

- Be fully operable using only a keyboard
- Have logical tab order
- Support expected keyboard shortcuts (Enter/Space for buttons, Esc for dialogs, etc.)
- Implement focus trapping where appropriate (modals, menus)
- Have visible focus indicators

### Screen Reader Support

- Use semantic HTML elements where possible
- Include appropriate ARIA roles, states, and properties
- Ensure meaningful text alternatives for non-text content
- Announce state changes to screen readers
- Test with at least one screen reader (NVDA, JAWS, VoiceOver)

### Visual Considerations

- Maintain sufficient color contrast (WCAG Level AA - 4.5:1 for normal text)
- Don't rely solely on color to convey information
- Support different viewport sizes and zoom levels
- Consider users with different visual abilities
- Support reduced motion preferences

### Testing Requirements

- Test keyboard navigation
- Verify screen reader announcements
- Check color contrast
- Test with magnification
- Validate ARIA attributes

For more detailed guidance, refer to our [Accessibility Guide](docs/ACCESSIBILITY.md).

## Pull Request Process

1. **Update your fork**: Sync your fork with the upstream repository:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout your-branch-name
   git rebase main
   ```

2. **Create your PR**: Push your changes and create a pull request:
   ```bash
   git push origin your-branch-name
   ```

3. **PR Description**: Include a comprehensive description of your changes:
   - What problem does this PR solve?
   - How does it solve the problem?
   - Are there any alternative solutions?
   - What accessibility considerations have been addressed?

4. **Review Process**: All PRs need at least one approval from a maintainer.

5. **Continuous Integration**: All automated tests must pass.

6. **Requested Changes**: Address any feedback or requested changes promptly.

## Commit Guidelines

We use conventional commits to maintain a clean and meaningful commit history:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation-only changes
- **style**: Changes that don't affect the meaning of the code
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or fixing tests
- **chore**: Changes to the build process or auxiliary tools

Example:
```
feat(button): add disabled state styling

Add styling for disabled state to improve accessibility
and provide better visual feedback to users.

Closes #123
```

## Documentation

Documentation is crucial for the usability of our component library:

### Component Documentation

Each component should have a README.md file that includes:

1. **Overview**: A brief description of the component
2. **Installation**: How to install the component
3. **Usage**: Basic usage examples
4. **Props**: Detailed props table with types, defaults, and descriptions
5. **Examples**: Various examples demonstrating different use cases
6. **Accessibility**: Accessibility features and considerations
7. **Best Practices**: Guidelines for effective use

### Storybook Documentation

Storybook stories should demonstrate:

1. **Basic usage**: Default component rendering
2. **Variants**: Different visual styles and variants
3. **Sizes**: Different size options if applicable
4. **States**: Various states (hover, active, disabled, etc.)
5. **Examples**: Real-world usage examples
6. **Accessibility**: Accessibility features with notes

## Testing

We value comprehensive testing to ensure component quality:

### Unit Testing

- Write tests for all components using Vitest and Testing Library
- Test component rendering
- Test props and their effects
- Test user interactions
- Test keyboard navigation
- Test accessibility requirements

Example:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible with keyboard', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Working with Vitest

Our project uses Vitest for testing, which provides a modern, fast test runner compatible with the same API as Jest:

- **Running Tests**: 
  ```bash
  npm run test           # Run all tests
  npm run test:watch     # Run tests in watch mode
  npm run test:coverage  # Generate coverage reports
  ```

- **Mocking**:
  ```tsx
  // Mock a function
  const mockFn = vi.fn();
  
  // Mock a module
  vi.mock('./somePath', () => ({
    someFunction: vi.fn(),
    SomeComponent: () => <div>Mocked Component</div>
  }));
  
  // Mock timers
  vi.useFakeTimers();
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  ```

- **Testing Portals**:
  ```tsx
  // Mock createPortal for testing modals, dialogs, etc.
  vi.mock('react-dom', async () => {
    const actual = await vi.importActual('react-dom');
    return {
      ...actual,
      createPortal: (node) => node,
    };
  });
  ```

### Visual Testing

- Use Storybook for visual testing
- Consider adding visual regression tests
- Review component appearance across different viewports

### Accessibility Testing

- Use axe-react for automated accessibility testing
- Test keyboard navigation manually
- Test with screen readers
- Verify color contrast

## Release Process

Our release process follows these steps:

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md with new features and fixes
3. **Build**: Create a production build
4. **Tests**: Run all tests
5. **Documentation**: Update documentation if needed
6. **Release**: Publish to npm
7. **Tags**: Create a git tag for the release
8. **Announcement**: Announce the release in appropriate channels

## Questions and Support

If you have questions or need help, please:

1. Check our documentation
2. Search for existing issues
3. Create a new issue if needed

Thank you for contributing to Clipper UI! Your efforts help make this library better for everyone. 