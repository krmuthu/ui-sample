import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DatePicker } from './DatePicker';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Mock createPortal to make testing portals possible
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Wrap components in ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement, { theme = 'light' } = {}) => {
  return render(
    <ThemeProvider defaultTheme={theme as 'light' | 'dark'}>
      {ui}
    </ThemeProvider>
  );
};

describe('DatePicker Component', () => {
  // Mock date to ensure consistent tests
  const mockDate = new Date(2023, 1, 15); // February 15, 2023
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });
  
  beforeEach(() => {
    // Mock the Date constructor to return a fixed date for new Date()
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('renders with default props', () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Select date');
    expect(input).not.toBeDisabled();
  });
  
  it('renders with a label', () => {
    renderWithTheme(<DatePicker label="Select a date" />);
    
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });
  
  it('renders with a required indicator when required prop is true', () => {
    renderWithTheme(<DatePicker label="Select a date" required />);
    
    const label = screen.getByText('Select a date');
    expect(label.parentElement).toHaveTextContent('*');
  });
  
  it('renders with an initial value', () => {
    const initialDate = new Date(2023, 0, 15); // January 15, 2023
    renderWithTheme(<DatePicker value={initialDate} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('01/15/2023');
  });
  
  it('renders in disabled state', () => {
    renderWithTheme(<DatePicker disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
  
  it('shows the calendar when input is clicked', async () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Calendar should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument(); // Current month title
    expect(screen.getByText('2023')).toBeInTheDocument(); // Current year title
  });
  
  it('allows selecting a date from the calendar', async () => {
    const handleChange = vi.fn();
    renderWithTheme(<DatePicker onChange={(handleChange)} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Find and click on a date
    const dayButton = screen.getByRole('button', { name: /february 10, 2023/i });
    await user.click(dayButton);
    
    // onChange should be called with the selected date
    expect(handleChange).toHaveBeenCalledTimes(1);
    const selectedDate = handleChange.mock.calls[0][0];
    expect(selectedDate.getFullYear()).toBe(2023);
    expect(selectedDate.getMonth()).toBe(1); // February
    expect(selectedDate.getDate()).toBe(10);
    
    // Input should be updated with the selected date
    expect(input).toHaveValue('02/10/2023');
  });
  
  it('allows manually typing a date', async () => {
    const handleChange = vi.fn();
    renderWithTheme(<DatePicker onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    
    // Clear the input and type a date
    await user.clear(input);
    await user.type(input, '03/20/2023');
    
    // onChange should be called with the entered date
    expect(handleChange).toHaveBeenCalled();
    const enteredDate = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
    expect(enteredDate.getFullYear()).toBe(2023);
    expect(enteredDate.getMonth()).toBe(2); // March
    expect(enteredDate.getDate()).toBe(20);
  });
  
  it('handles invalid date input gracefully', async () => {
    const handleChange = vi.fn();
    renderWithTheme(<DatePicker onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    
    // Clear the input and type an invalid date
    await user.clear(input);
    await user.type(input, 'invalid-date');
    
    // onChange should not be called with an invalid date
    expect(handleChange).not.toHaveBeenCalled();
  });
  
  it('clears the date when clear button is clicked', async () => {
    const initialDate = new Date(2023, 0, 15); // January 15, 2023
    const handleChange = vi.fn();
    renderWithTheme(
      <DatePicker 
        value={initialDate} 
        onChange={handleChange} 
        clearable
      />
    );
    
    // Find and click the clear button
    const clearButton = screen.getByLabelText('Clear date');
    await user.click(clearButton);
    
    // Input should be cleared
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    
    // onChange should be called with null
    expect(handleChange).toHaveBeenCalledWith(null);
  });
  
  it('navigates to previous and next month', async () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Initial month should be February 2023
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    
    // Click previous month button
    const prevMonthButton = screen.getByLabelText('Previous month');
    await user.click(prevMonthButton);
    
    // Calendar should show January 2023
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    
    // Click next month button twice to go to March
    const nextMonthButton = screen.getByLabelText('Next month');
    await user.click(nextMonthButton);
    await user.click(nextMonthButton);
    
    // Calendar should show March 2023
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('March')).toBeInTheDocument();
  });
  
  it('navigates to previous and next year', async () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Initial month should be February 2023
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    
    // Click previous year button
    const prevYearButton = screen.getByLabelText('Previous year');
    await user.click(prevYearButton);
    
    // Calendar should show February 2022
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    
    // Click next year button twice to go to 2024
    const nextYearButton = screen.getByLabelText('Next year');
    await user.click(nextYearButton);
    await user.click(nextYearButton);
    
    // Calendar should show February 2024
    
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });
  
  it('respects min and max date constraints', async () => {
    const minDate = new Date(2023, 1, 5); // February 5, 2023
    const maxDate = new Date(2023, 1, 25); // February 25, 2023
    
    renderWithTheme(
      <DatePicker 
        minDate={minDate}
        maxDate={maxDate}
      />
    );
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Dates before min date should be disabled
    const disabledBeforeMin = screen.getByRole('button', { name: /february 4, 2023/i });
    expect(disabledBeforeMin).toHaveAttribute('disabled');
    
    // Dates after max date should be disabled
    const disabledAfterMax = screen.getByRole('button', { name: /february 26, 2023/i });
    expect(disabledAfterMax).toHaveAttribute('disabled');
    
    // Dates between min and max should be enabled
    const enabledDate = screen.getByRole('button', { name: /february 15, 2023/i });
    expect(enabledDate).not.toHaveAttribute('disabled');
  });
  
  it('renders with error state', () => {
    renderWithTheme(
      <DatePicker 
        error 
        errorMessage="Please select a valid date"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-[var(--btn-primary-negative-bg)]');
    
    // Error message should be displayed
    expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
  });
  
  it('renders with helper text', () => {
    renderWithTheme(
      <DatePicker 
        helperText="Select your preferred date"
      />
    );
    
    expect(screen.getByText('Select your preferred date')).toBeInTheDocument();
  });
  
  it('closes the calendar when clicking outside', async () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    
    // Calendar should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Click outside the calendar
    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    });
    
    // Calendar should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('handles keyboard navigation', async () => {
    renderWithTheme(<DatePicker />);
    
    const input = screen.getByRole('textbox');
    
    // Press Enter to open calendar
    await user.type(input, '{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Press Escape to close calendar
    await user.type(input, '{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}); 