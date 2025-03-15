import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
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

describe('TextField', () => {
  it('renders correctly with default props', () => {
    renderWithTheme(<TextField data-testid="input" />);
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe('INPUT');
  });

  it('renders with label correctly', () => {
    renderWithTheme(<TextField label="Name" data-testid="input" />);
    
    const labelElement = screen.getByText('Name');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('LABEL');
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeInTheDocument();
    
    // Check that label is associated with input
    expect(labelElement.getAttribute('for')).toBe(inputElement.getAttribute('id'));
  });

  it('renders with placeholder correctly', () => {
    renderWithTheme(<TextField placeholder="Enter your name" data-testid="input" />);
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('renders with helper text correctly', () => {
    renderWithTheme(<TextField helperText="This is helper text" data-testid="input" />);
    
    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    renderWithTheme(
      <TextField 
        error 
        errorMessage="This field is required" 
        data-testid="input" 
      />
    );
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement.className).toContain('border-[var(--btn-primary-negative-bg)]');
  });

  it('prioritizes error message over helper text when both are provided', () => {
    renderWithTheme(
      <TextField 
        error 
        errorMessage="This field is required" 
        helperText="This is helper text"
        data-testid="input" 
      />
    );
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    
    const helperText = screen.queryByText('This is helper text');
    expect(helperText).not.toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    renderWithTheme(<TextField disabled data-testid="input" />);
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toBeDisabled();
    expect(inputElement.className).toContain('cursor-not-allowed');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <TextField 
        onChange={handleChange} 
        data-testid="input" 
      />
    );
    
    const inputElement = screen.getByTestId('input');
    await userEvent.type(inputElement, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies different size classes correctly', () => {
    const { rerender } = renderWithTheme(
      <TextField 
        size="small" 
        data-testid="input" 
      />
    );
    
    let inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('py-1 px-2 text-sm');
    
    rerender(
      <ThemeProvider>
        <TextField 
          size="large" 
          data-testid="input" 
        />
      </ThemeProvider>
    );
    
    inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('py-3 px-4 text-lg');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    renderWithTheme(
      <TextField 
        fullWidth 
        data-testid="input" 
      />
    );
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('w-full');
  });

  it('renders with startIcon correctly', () => {
    renderWithTheme(
      <TextField 
        startIcon={<span data-testid="start-icon">🔍</span>}
        data-testid="input" 
      />
    );
    
    const startIcon = screen.getByTestId('start-icon');
    expect(startIcon).toBeInTheDocument();
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('pl-9');
  });

  it('renders with endIcon correctly', () => {
    renderWithTheme(
      <TextField 
        endIcon={<span data-testid="end-icon">✓</span>}
        data-testid="input" 
      />
    );
    
    const endIcon = screen.getByTestId('end-icon');
    expect(endIcon).toBeInTheDocument();
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('pr-9');
  });

  it('applies custom className to container correctly', () => {
    renderWithTheme(
      <TextField 
        className="custom-class"
        data-testid="input" 
      />
    );
    
    // Find the container (parent of the input)
    const inputElement = screen.getByTestId('input');
    const container = inputElement.parentElement?.parentElement;
    
    expect(container?.className).toContain('custom-class');
  });

  it('applies custom inputClassName to input correctly', () => {
    renderWithTheme(
      <TextField 
        inputClassName="custom-input-class"
        data-testid="input" 
      />
    );
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement.className).toContain('custom-input-class');
  });

  it('passes through additional props to input element', () => {
    renderWithTheme(
      <TextField 
        data-testid="input"
        maxLength={10}
        readOnly
        type="email"
      />
    );
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('maxlength', '10');
    expect(inputElement).toHaveAttribute('readonly');
    expect(inputElement).toHaveAttribute('type', 'email');
  });

  it('shows an asterisk when required is true', () => {
    renderWithTheme(<TextField label="Required Field" required />);
    
    const label = screen.getByText('Required Field');
    expect(label).toBeInTheDocument();
    
    // Check for the asterisk
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-[var(--btn-primary-negative-bg)]');
  });

  it('does not show an asterisk when required is false', () => {
    renderWithTheme(<TextField label="Optional Field" />);
    
    const label = screen.getByText('Optional Field');
    expect(label).toBeInTheDocument();
    
    // Asterisk should not be present
    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('passes the required attribute to the input element when required is true', () => {
    renderWithTheme(<TextField label="Required Field" required data-testid="input" />);
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('required');
  });

  it('combines required indicator with error state correctly', () => {
    renderWithTheme(
      <TextField 
        label="Required Field" 
        required
        error
        errorMessage="This field is required"
        data-testid="input"
      />
    );
    
    // Check for the asterisk
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    
    // Check for error state
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveAttribute('required');
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  });
}); 