# Clipper UI

A modern, accessible, and customizable React component library built with TypeScript and Tailwind CSS.

## Features

- **Modern Design**: Clean, consistent design system
- **Accessibility**: WCAG 2.1 AA compliant components with full keyboard navigation and screen reader support
- **Customization**: Flexible theming with support for light and dark modes
- **TypeScript**: Full type definitions for enhanced developer experience
- **Well Documented**: Comprehensive documentation with Storybook and component-specific guides
- **Tree-Shaking**: Import only what you need to reduce bundle size
- **Cross-Browser Support**: Tested across all modern browsers

## Quick Links

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Accessibility Guide](docs/ACCESSIBILITY.md)
- [Component Categories](#component-categories)
- [Contributing](CONTRIBUTING.md)

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Usage

### Basic Usage

```jsx
import { Button, Card, Typography } from 'clipper-ui';

function App() {
  return (
    <Card>
      <Typography variant="headline2">Hello World</Typography>
      <Typography variant="body1">
        This is a sample component using Clipper UI.
      </Typography>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

### Using ThemeProvider

```jsx
import { ThemeProvider, Button, Card } from 'clipper-ui';

function App() {
  return (
    <ThemeProvider theme="light">
      <Card>
        <Button variant="primary">Light Theme Button</Button>
      </Card>
    </ThemeProvider>
  );
}
```

## Documentation

Each component in Clipper UI comes with its own detailed README documentation file that includes:

- **Component API**: Detailed props and options
- **Usage Examples**: Common use cases with code samples
- **Accessibility Guidelines**: WCAG compliance information and best practices
- **Keyboard Navigation**: Key commands and focus management details
- **Best Practices**: Recommendations for effective use

You can find these files in each component's directory:
`src/components/ComponentName/README.md`

For comprehensive documentation with live examples, run the Storybook:

```bash
npm run storybook
# or
yarn storybook
```

## Accessibility Features

Clipper UI is built with accessibility at its core:

- **Keyboard Navigation**: All interactive components can be used with keyboard alone
- **Screen Reader Support**: ARIA attributes and semantic HTML support assistive technologies
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: All components meet WCAG AA contrast requirements
- **Reduced Motion**: Support for users who prefer reduced motion
- **Form Validation**: Accessible error states and announcements
- **Responsive Design**: Components work across all device sizes

## Component Categories

### Core Components

- **Button**: Standard button with multiple variants and sizes
- **Card**: Content container with flexible layout options
- **Typography**: Text component with various styles and options
- **Link**: Navigation component with customization options
- **Icon**: Collection of common icons with customization

### Form Components

- **TextField**: Text input field with validation support
- **Select**: Dropdown selection component
- **Checkbox**: Selectable checkbox component
- **Radio**: Radio button component for single selection
- **Switch**: Toggle switch component
- **FormControl**: Wrapper for form elements with validation context
- **FormLabel**: Accessible form labels with required/optional indicators
- **FormErrorMessage**: Error messaging for form validation
- **FormHelperText**: Additional guidance for form fields

### Layout Components

- **Grid**: Responsive grid layout system with rows and columns
- **Container**: Content container with responsive padding
- **Divider**: Horizontal or vertical divider line

### Feedback Components

- **Toast**: Temporary notification messages
- **Dialog**: Modal dialog for confirmations and interactions
- **Alert**: Status messages with various severity levels
- **ProgressIndicator**: Loading states and progress visualization

### Navigation Components

- **Breadcrumbs**: Page location indicator
- **Tabs**: Content organization with tab navigation
- **Pagination**: Page navigation controls
- **Menu**: Dropdown menu for navigation and actions

### Data Display Components

- **Table**: Data table with sorting and pagination
- **Tag**: Content labeling and categorization
- **Badge**: Numerical indicators and status markers
- **Avatar**: User profile image representation
- **Tooltip**: Additional information on hover

## Development

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clipper-ui.git
   cd clipper-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development environment:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Run Storybook for component development:
   ```bash
   npm run storybook
   # or
   yarn storybook
   ```

### Creating a New Component

Use the generate script to create a new component with all required files:

```bash
npm run generate ComponentName
# or
yarn generate ComponentName
```

This will create:
- `src/components/ComponentName/ComponentName.tsx` - Component implementation
- `src/components/ComponentName/index.ts` - Export file
- `src/components/ComponentName/ComponentName.stories.tsx` - Storybook documentation
- `src/components/ComponentName/ComponentName.test.tsx` - Unit tests
- `src/components/ComponentName/README.md` - Component documentation

### Building

```bash
npm run build:all
# or
yarn build:all
```

### Testing

```bash
npm run test
# or
yarn test
```

For coverage reports:

```bash
npm run test:coverage
# or
yarn test:coverage
```

Clipper UI uses Vitest for testing all components. The test suite includes:

- Unit tests for all components
- Integration tests for component interactions
- Accessibility testing
- Test coverage reporting

All test files are located adjacent to their component files as `ComponentName.test.tsx`.

### Documentation

Generate README files for all components:

```bash
npm run generate:readmes
# or
yarn generate:readmes
```

### Linting

```bash
npm run lint
# or
yarn lint
```

### Bundle Size Analysis

```bash
npm run check:bundle
# or
yarn check:bundle
```

## Project Structure

```
clipper-ui/
├── dist/               # Built library output
├── src/
│   ├── components/     # Component definitions
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ...
│   ├── utils/          # Utility functions
│   └── index.ts        # Main export file
├── scripts/            # Build and utility scripts
│   ├── templates/      # Component templates
│   └── ...
├── .storybook/         # Storybook configuration
├── docs/               # Design system documentation
└── ...
```

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Contribution Standards

- Follow the existing code style and naming conventions
- Write tests for new components and features
- Document your components with Storybook stories and README files
- Ensure accessibility standards are met with WCAG AA compliance
- Keep bundle size in mind - avoid large dependencies
- Test for cross-browser compatibility

### Accessibility Requirements

All contributions must:
- Support keyboard navigation
- Include appropriate ARIA attributes
- Maintain proper focus management
- Provide adequate color contrast
- Work with screen readers
- Include documentation on accessibility features

### Development Workflow

1. Create a new component using the generator: `npm run generate ComponentName`
2. Implement the component functionality
3. Write comprehensive tests
4. Create Storybook documentation
5. Update the component README with usage examples and accessibility guidelines
6. Run validation before submitting: `npm run validate`

## License

MIT © [Your Company]
