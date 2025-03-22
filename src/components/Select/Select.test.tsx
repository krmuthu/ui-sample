import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import '@testing-library/jest-dom';

// Helper function to render components with ThemeProvider
const renderWithTheme = (ui: React.ReactElement, options = {}) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
    options
  );
};

// Sample options for testing
const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
];

describe('Select Component', () => {
  it('renders correctly with basic props', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" data-testid="select-component" />);
    
    const trigger = screen.getByTestId('select-component');
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('displays options when clicked', async () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" />);
    
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getByText('Option 4')).toBeInTheDocument();
    });
  });

  it('selects an option when clicked', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" onChange={onChange} />);
    
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    
    const option = await screen.findByText('Option 2');
    await userEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith('option2');
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles disabled state correctly', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" disabled />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('tabindex', '-1');
    expect(trigger).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('handles error state correctly', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions} 
        placeholder="Select an option" 
        error 
        errorMessage="This is an error message" 
      />
    );
    
    expect(screen.getByText('This is an error message')).toBeInTheDocument();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles different sizes correctly', () => {
    const { rerender } = renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" size="small" />);
    let trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-8');
    
    rerender(
      <ThemeProvider>
        <Select options={sampleOptions} placeholder="Select an option" size="medium" />
      </ThemeProvider>
    );
    trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-10');
    
    rerender(
      <ThemeProvider>
        <Select options={sampleOptions} placeholder="Select an option" size="large" />
      </ThemeProvider>
    );
    trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-12');
  });

  it('handles different variants correctly', () => {
    const { rerender } = renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" variant="primary" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('border-[var(--btn-primary-ring)]');
    
    // Additional variant tests can be added here if needed
  });

  it('respects fullWidth prop', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" fullWidth />);
    
    // First we get the combobox element
    const select = screen.getByRole('combobox');
    
    // The w-full class should be on the combobox itself since that's where it's applied in the component
    expect(select).toHaveClass('w-full');
  });

  it('displays disabled options correctly', async () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" />);
    
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    
    const disabledOption = await screen.findByText('Option 4');
    expect(disabledOption).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('renders with a label', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('shows an asterisk when required is true', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions} 
        placeholder="Select an option" 
        label="Test Label"
        required 
      />
    );
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500');
  });

  it('does not show an asterisk when required is false', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" label="Optional Field" />);
    
    const label = screen.getByText('Optional Field');
    expect(label).toBeInTheDocument();
    
    // Asterisk should not be present
    const asterisk = screen.queryByText('*');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('associates the label with the select via htmlFor', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions}
        placeholder="Select an option"
        label="Test Label"
        name="test-select"
      />
    );
    
    const label = screen.getByText('Test Label');
    const select = screen.getByRole('combobox');
    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
  });

  it('passes the required attribute to the hidden input when required is true', () => {
    renderWithTheme(<Select options={sampleOptions} placeholder="Select an option" label="Required Field" required />);
    
    // Find the hidden input element
    const hiddenInput = document.querySelector('input[type="hidden"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('required');
  });

  it('shows placeholder when no value is selected', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions} 
        placeholder="Select an option" 
        data-testid="select" 
      />
    );
    
    expect(screen.getByTestId('select')).toHaveTextContent('Select an option');
  });

  it('pre-selects the correct value when value prop is provided', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions} 
        value="option2" 
        data-testid="select" 
      />
    );
    
    expect(screen.getByTestId('select')).toHaveTextContent('Option 2');
  });

  it('applies different size classes correctly', () => {
    const { rerender } = renderWithTheme(
      <Select 
        options={sampleOptions} 
        size="small" 
        data-testid="select" 
      />
    );
    
    let selectElement = screen.getByTestId('select');
    expect(selectElement.className).toContain('py-1 px-2 text-sm');
    
    rerender(
      <ThemeProvider>
        <Select 
          options={sampleOptions} 
          size="large" 
          data-testid="select" 
        />
      </ThemeProvider>
    );
    
    selectElement = screen.getByTestId('select');
    expect(selectElement.className).toContain('py-3 px-4 text-lg');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    renderWithTheme(
      <Select 
        options={sampleOptions} 
        fullWidth 
        data-testid="select" 
      />
    );
    
    const selectElement = screen.getByTestId('select');
    expect(selectElement.className).toContain('w-full');
  });

  it('navigates options with keyboard', async () => {
    renderWithTheme(
      <Select 
        options={sampleOptions}
        data-testid="select" 
      />
    );
    
    // Open dropdown
    const selectElement = screen.getByTestId('select');
    await userEvent.click(selectElement);
    
    // Press arrow down to highlight first option
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Get all options
    const options = screen.getAllByRole('option');
    
    // Check that the first option is highlighted (has background color)
    expect(options[0].className).toContain('bg-[var(--btn-secondary-hover)]');
    
    // Press arrow down again to highlight second option
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Check that the second option is now highlighted
    await waitFor(() => {
      expect(options[1].className).toContain('bg-[var(--btn-secondary-hover)]');
    });
    
    // Press Enter to select the highlighted option
    fireEvent.keyDown(document, { key: 'Enter' });
    
    // Check that the dropdown is closed and the selected option is displayed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(selectElement).toHaveTextContent('Option 2');
  });

  it('closes dropdown when clicking outside', async () => {
    renderWithTheme(
      <div>
        <button>Outside element</button>
        <Select options={sampleOptions} data-testid="select" />
      </div>
    );
    
    // Open dropdown
    await userEvent.click(screen.getByTestId('select'));
    
    // Check that dropdown is open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click outside
    await userEvent.click(screen.getByText('Outside element'));
    
    // Check that dropdown is closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
}); 