# Changelog

All notable changes to the Clipper UI project will be documented in this file.

## [Unreleased] - 2024-05-22

### Added
- Comprehensive accessibility documentation in `docs/ACCESSIBILITY.md`
- Detailed component README files with accessibility considerations for all components
- Enhanced Dialog component documentation with focus on keyboard navigation and ARIA attributes
- Enhanced Menu component documentation with detailed keyboard navigation guide
- Comprehensive Form components documentation with validation patterns and accessibility features
- Updated main README with prominent accessibility features section
- Added accessibility requirements to CONTRIBUTING.md
- Migrated entire test suite from Jest to Vitest
- Added Vitest configuration and setup files
- Created compatibility layer for legacy Jest usage in the test setup
- Enhanced performance test suite with additional component tests for Modal, DatePicker, Tooltip, and AutoSuggest
- Added detailed memory usage tracking and reporting to performance tests
- Implemented interactive component testing in performance suite to measure real user interactions

### Changed
- Improved component README template to include accessibility sections
- Updated all component documentation to highlight accessibility features
- Enhanced main README with quick links to documentation
- Updated CONTRIBUTING.md with detailed accessibility requirements for new components
- Refactored all test files to use Vitest syntax and imports
- Updated mocking strategies to use Vitest's vi instead of Jest's jest

### Fixed
- Standardized documentation format across all components
- Improved clarity in component API documentation
- Fixed component tests to work properly with Vitest
- Resolved test issues in portal-based components like Modal, Dialog, and DatePicker

## [0.1.0] - 2023-03-20

### Added
- Initial release of Clipper UI
- Core component library with 30+ components
- Basic documentation and Storybook integration
- Component generation scripts
- Testing infrastructure 