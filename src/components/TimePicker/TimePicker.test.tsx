import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimePicker from './TimePicker';

// Helper function to render with theme context if needed
const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui);
};

describe('TimePicker Component', () => {
  beforeEach(() => {
    // Mock createPortal to render content in the document for testing
    jest.spyOn(require('react-dom'), 'createPortal').mockImplementation((element) => {
      return element;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    renderWithTheme(<TimePicker />);
    expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    renderWithTheme(<TimePicker label="Select a time" />);
    expect(screen.getByText('Select a time')).toBeInTheDocument();
  });

  it('renders with a required label', () => {
    renderWithTheme(<TimePicker label="Select a time" required />);
    expect(screen.getByText('Select a time')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays the correct time when value is provided', () => {
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0); // 2:30 PM
    
    renderWithTheme(<TimePicker value={initialTime} />);
    expect(screen.getByDisplayValue('02:30 PM')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    renderWithTheme(<TimePicker disabled />);
    expect(screen.getByPlaceholderText('Select time')).toBeDisabled();
  });

  it('opens dropdown when input is clicked', async () => {
    renderWithTheme(<TimePicker />);
    const input = screen.getByPlaceholderText('Select time');
    
    fireEvent.click(input);
    
    // Wait for the dropdown to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('calls onChange when a time is selected', async () => {
    const handleChange = jest.fn();
    renderWithTheme(<TimePicker onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Select time');
    fireEvent.click(input);
    
    // Wait for the dropdown to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    // Click on a time option (e.g., 3:00 PM)
    const timeOption = screen.getByText('03:00 PM');
    fireEvent.click(timeOption);
    
    expect(handleChange).toHaveBeenCalled();
    const selectedDate = handleChange.mock.calls[0][0];
    expect(selectedDate.getHours()).toBe(15); // 3 PM = 15 hours
    expect(selectedDate.getMinutes()).toBe(0);
  });

  it('calls onChange with null when cleared', async () => {
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0); // 2:30 PM
    
    const handleChange = jest.fn();
    renderWithTheme(
      <TimePicker 
        value={initialTime} 
        onChange={handleChange} 
      />
    );
    
    // Find and click the clear button
    const clearButton = screen.getByLabelText('Clear time');
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('displays time in 24-hour format when displayFormat is 24h', () => {
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0); // 14:30
    
    renderWithTheme(
      <TimePicker 
        value={initialTime} 
        displayFormat="24h" 
      />
    );
    
    expect(screen.getByDisplayValue('14:30')).toBeInTheDocument();
  });

  it('displays error message when error prop is true', () => {
    renderWithTheme(
      <TimePicker 
        error={true} 
        errorMessage="Invalid time" 
      />
    );
    
    expect(screen.getByText('Invalid time')).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    renderWithTheme(
      <TimePicker 
        helperText="Select your preferred time" 
      />
    );
    
    expect(screen.getByText('Select your preferred time')).toBeInTheDocument();
  });

  it('allows manual time input', async () => {
    const handleChange = jest.fn();
    renderWithTheme(<TimePicker onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Select time');
    fireEvent.change(input, { target: { value: '03:45 PM' } });
    
    expect(handleChange).toHaveBeenCalled();
    const selectedDate = handleChange.mock.calls[0][0];
    expect(selectedDate.getHours()).toBe(15); // 3 PM = 15 hours
    expect(selectedDate.getMinutes()).toBe(45);
  });

  it('closes dropdown when time is selected and closeOnSelect is true', async () => {
    renderWithTheme(<TimePicker closeOnSelect={true} />);
    
    const input = screen.getByPlaceholderText('Select time');
    fireEvent.click(input);
    
    // Wait for the dropdown to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    // Click on a time option
    const timeOption = screen.getByText('03:00 PM');
    fireEvent.click(timeOption);
    
    // Dropdown should be closed
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
}); 