import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentTemplate } from './ComponentTemplate';
import { ThemeProvider } from '../components/ThemeProvider/ThemeProvider';

// Helper function to render components with ThemeProvider
const renderWithTheme = (ui: React.ReactElement, { theme = 'light', ...options } = {}) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
    options
  );
};

describe('ComponentTemplate', () => {
  it('renders correctly with default props', () => {
    renderWithTheme(<ComponentTemplate>Test Content</ComponentTemplate>);
    
    const component = screen.getByText('Test Content');
    expect(component).toBeInTheDocument();
    // Add more specific assertions based on default styling
  });

  it('applies correct styling for different variants', () => {
    const { rerender } = renderWithTheme(
      <ComponentTemplate variant="primary">Primary Variant</ComponentTemplate>
    );
    
    expect(screen.getByText('Primary Variant')).toBeInTheDocument();
    // Check primary variant styling
    
    rerender(
      <ThemeProvider>
        <ComponentTemplate variant="secondary">Secondary Variant</ComponentTemplate>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Secondary Variant')).toBeInTheDocument();
    // Check secondary variant styling
    
    rerender(
      <ThemeProvider>
        <ComponentTemplate variant="tertiary">Tertiary Variant</ComponentTemplate>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Tertiary Variant')).toBeInTheDocument();
    // Check tertiary variant styling
  });

  it('applies correct styling for different sizes', () => {
    const { rerender } = renderWithTheme(
      <ComponentTemplate size="small">Small Size</ComponentTemplate>
    );
    
    expect(screen.getByText('Small Size')).toBeInTheDocument();
    // Check small size styling
    
    rerender(
      <ThemeProvider>
        <ComponentTemplate size="medium">Medium Size</ComponentTemplate>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Medium Size')).toBeInTheDocument();
    // Check medium size styling
    
    rerender(
      <ThemeProvider>
        <ComponentTemplate size="large">Large Size</ComponentTemplate>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Large Size')).toBeInTheDocument();
    // Check large size styling
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    renderWithTheme(<ComponentTemplate fullWidth>Full Width</ComponentTemplate>);
    
    expect(screen.getByText('Full Width')).toBeInTheDocument();
    // Check that fullWidth styling is applied
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <ComponentTemplate onClick={handleClick}>Click Me</ComponentTemplate>
    );
    
    const component = screen.getByText('Click Me');
    await userEvent.click(component);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders correctly in dark theme', () => {
    renderWithTheme(
      <ComponentTemplate>Dark Theme Component</ComponentTemplate>
    );
    
    expect(screen.getByText('Dark Theme Component')).toBeInTheDocument();
    // Check dark theme styling
  });

  it('passes additional props to the underlying element', () => {
    renderWithTheme(
      <ComponentTemplate data-testid="test-component">With Data Attribute</ComponentTemplate>
    );
    
    const component = screen.getByTestId('test-component');
    expect(component).toHaveTextContent('With Data Attribute');
  });
}); 