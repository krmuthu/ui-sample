import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormLabel } from './FormLabel';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Helper function to render components with ThemeProvider
const renderWithTheme = (ui: React.ReactElement, options = {}) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
    options
  );
};

describe('FormLabel', () => {
  it('renders correctly with required props', () => {
    renderWithTheme(<FormLabel htmlFor="test-input">Test Label</FormLabel>);
    
    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('LABEL');
    expect(labelElement).toHaveAttribute('for', 'test-input');
  });

  it('shows an asterisk when required is true', () => {
    renderWithTheme(<FormLabel htmlFor="test-input" required>Required Field</FormLabel>);
    
    const label = screen.getByText('Required Field');
    expect(label).toBeInTheDocument();
    
    // Check for the asterisk
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-[var(--btn-primary-negative-bg)]');
  });

  it('does not show an asterisk when required is false', () => {
    renderWithTheme(<FormLabel htmlFor="test-input">Optional Field</FormLabel>);
    
    const label = screen.getByText('Optional Field');
    expect(label).toBeInTheDocument();
    
    // Asterisk should not be present
    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('applies disabled styling when disabled is true', () => {
    renderWithTheme(<FormLabel htmlFor="test-input" disabled>Disabled Field</FormLabel>);
    
    const label = screen.getByText('Disabled Field');
    expect(label.className).toContain('opacity-50');
  });

  it('applies size classes correctly', () => {
    const { rerender } = renderWithTheme(
      <FormLabel htmlFor="test-input" size="small">Small Label</FormLabel>
    );
    
    let label = screen.getByText('Small Label');
    expect(label.className).toContain('text-sm');
    
    rerender(
      <ThemeProvider>
        <FormLabel htmlFor="test-input" size="medium">Medium Label</FormLabel>
      </ThemeProvider>
    );
    
    label = screen.getByText('Medium Label');
    expect(label.className).toContain('text-base');
    
    rerender(
      <ThemeProvider>
        <FormLabel htmlFor="test-input" size="large">Large Label</FormLabel>
      </ThemeProvider>
    );
    
    label = screen.getByText('Large Label');
    expect(label.className).toContain('text-lg');
  });

  it('applies custom className correctly', () => {
    renderWithTheme(
      <FormLabel htmlFor="test-input" className="custom-class">Custom Class</FormLabel>
    );
    
    const label = screen.getByText('Custom Class');
    expect(label.className).toContain('custom-class');
  });
}); 