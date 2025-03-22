import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AutoSuggest } from './AutoSuggest';

describe('AutoSuggest', () => {
  const options = [
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Cherry' },
  ];
  
  const defaultProps = {
    options,
    value: '',
    onChange: jest.fn(),
    onSelect: jest.fn(),
    placeholder: 'Search fruits...',
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders input with placeholder', () => {
    render(<AutoSuggest {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search fruits...')).toBeInTheDocument();
  });
  
  test('shows options when input is focused', async () => {
    render(<AutoSuggest {...defaultProps} value="a" />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });
  
  test('calls onChange when input value changes', async () => {
    render(<AutoSuggest {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    await userEvent.type(input, 'a');
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('a');
  });
  
  test('calls onSelect when an option is clicked', async () => {
    render(<AutoSuggest {...defaultProps} value="a" />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);
    });
    
    expect(defaultProps.onSelect).toHaveBeenCalledWith(options[0]);
  });
  
  test('navigates options with keyboard', async () => {
    render(<AutoSuggest {...defaultProps} value="a" />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    fireEvent.focus(input);
    
    // Press down to highlight the first option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Press Enter to select the highlighted option
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(defaultProps.onSelect).toHaveBeenCalledWith(options[0]);
  });
  
  test('shows no results message', async () => {
    render(<AutoSuggest {...defaultProps} options={[]} value="z" noResultsMessage="No fruits found" />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      expect(screen.getByText('No fruits found')).toBeInTheDocument();
    });
  });
  
  test('renders icon when provided', () => {
    const testIcon = <div data-testid="test-icon">🔍</div>;
    render(<AutoSuggest {...defaultProps} icon={testIcon} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
  
  test('clears input on selection when clearOnSelect is true', async () => {
    render(<AutoSuggest {...defaultProps} value="a" clearOnSelect={true} />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    fireEvent.focus(input);
    
    await waitFor(() => {
      const appleOption = screen.getByText('Apple');
      fireEvent.click(appleOption);
    });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('');
  });
  
  test('disables input when disabled prop is true', () => {
    render(<AutoSuggest {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('Search fruits...');
    
    expect(input).toBeDisabled();
  });
}); 