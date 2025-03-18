# Contributing to Clipper UI

Thank you for your interest in contributing to Clipper UI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Adding a New Component](#adding-a-new-component)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/clipper-ui.git
   cd clipper-ui
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up remote upstream**
   ```bash
   git remote add upstream https://github.com/original-owner/clipper-ui.git
   ```

## Development Workflow

1. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bugfix-name
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Start Storybook** to develop and test components
   ```bash
   npm run storybook
   ```

4. **Make your changes** following our coding standards

5. **Test your changes**
   ```bash
   npm run test
   ```

6. **Build the library** to ensure your changes work in the final output
   ```bash
   npm run build:all
   ```

## Pull Request Process

1. **Update your fork** with the latest upstream changes
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Push your changes** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a pull request** from your branch to the main repository

4. **Follow the PR template** and provide detailed information about your changes

5. **Address review comments** and make necessary changes

6. **Wait for approval** from maintainers

## Adding a New Component

When adding a new component to the library:

1. Create a new directory in `src/components/YourComponentName/`
2. Component files should include:
   - `YourComponentName.tsx` - Main component
   - `YourComponentName.test.tsx` - Tests
   - `YourComponentName.stories.tsx` - Storybook stories
   - `index.ts` - Exports

Example component structure:

```
src/components/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

3. Follow the component structure pattern used in existing components
4. Add comprehensive tests and Storybook stories
5. Document props and examples
6. Build and test with the component build system

## Coding Standards

We follow strict coding standards to maintain consistency:

- Use TypeScript for all components and utilities
- Follow our ESLint and Prettier configurations
- Write functional components with React hooks
- Use proper type definitions for all props and functions
- Keep components focused on a single responsibility
- Follow accessibility best practices

## Testing Guidelines

All new code should be properly tested:

- Write unit tests for all components and utilities
- Test edge cases and accessibility
- Ensure tests pass before submitting a PR
- Maintain or improve code coverage

Run tests with:

```bash
npm run test
```

## Documentation

Good documentation is crucial:

- Document all props using JSDoc comments
- Create or update Storybook stories
- Update relevant documentation files
- For significant changes, update the README.md

---

Thank you for contributing to Clipper UI! If you have any questions, feel free to reach out to the maintainers. 