import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export type AutoSuggestOption = {
  /**
   * Unique identifier for the option
   */
  id: string | number;
  
  /**
   * Display value for the option
   */
  label: string;
  
  /**
   * Optional additional data to store with the option
   */
  data?: Record<string, unknown>;
};

export interface AutoSuggestProps {
  /**
   * Array of options to display in the suggestion list
   */
  options: AutoSuggestOption[];
  
  /**
   * Callback when an option is selected
   */
  onSelect: (option: AutoSuggestOption) => void;
  
  /**
   * Current input value
   */
  value: string;
  
  /**
   * Callback when input value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Callback to fetch suggestions when input changes
   * If provided, options prop will be ignored
   */
  onFetchSuggestions?: (query: string) => Promise<AutoSuggestOption[]>;
  
  /**
   * Delay in milliseconds before triggering onFetchSuggestions
   * @default 300
   */
  debounceDelay?: number;
  
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Maximum height for the suggestions dropdown in pixels
   * @default 250
   */
  maxHeight?: number;
  
  /**
   * Auto-highlights the first option in the dropdown
   * @default true
   */
  autoHighlight?: boolean;
  
  /**
   * Clear input on selection
   * @default false
   */
  clearOnSelect?: boolean;
  
  /**
   * No results message
   * @default "No results found"
   */
  noResultsMessage?: string;
  
  /**
   * Loading message
   * @default "Loading..."
   */
  loadingMessage?: string;
  
  /**
   * Icon to display on the left side of the input
   */
  icon?: React.ReactNode;
  
  /**
   * Whether to close dropdown on blur
   * @default true
   */
  closeOnBlur?: boolean;
  
  /**
   * Custom render function for options
   */
  renderOption?: (option: AutoSuggestOption, isHighlighted: boolean) => React.ReactNode;
}

export const AutoSuggest: React.FC<AutoSuggestProps> = ({
  options = [],
  onSelect,
  value,
  onChange,
  onFetchSuggestions,
  debounceDelay = 300,
  placeholder = '',
  disabled = false,
  className = '',
  maxHeight = 250,
  autoHighlight = true,
  clearOnSelect = false,
  noResultsMessage = 'No results found',
  loadingMessage = 'Loading...',
  icon,
  closeOnBlur = true,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(autoHighlight ? 0 : null);
  const [filteredOptions, setFilteredOptions] = useState<AutoSuggestOption[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset highlighted index when options change
  useEffect(() => {
    if (!onFetchSuggestions) {
      setFilteredOptions(options);
    }
    setHighlightedIndex(autoHighlight && filteredOptions.length > 0 ? 0 : null);
  }, [options, autoHighlight]);
  
  // Fetch suggestions when input value changes
  useEffect(() => {
    if (!onFetchSuggestions) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (value.trim() === '') {
      setFilteredOptions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    timeoutRef.current = setTimeout(async () => {
      try {
        const fetchedOptions = await onFetchSuggestions(value);
        setFilteredOptions(fetchedOptions);
        setHighlightedIndex(autoHighlight && fetchedOptions.length > 0 ? 0 : null);
      } catch (error) {
        setFilteredOptions([]);
        setError('Failed to fetch suggestions');
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onFetchSuggestions, debounceDelay, autoHighlight]);
  
  // Handle keydown events for keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (prev === null) return 0;
          return prev === filteredOptions.length - 1 ? 0 : prev + 1;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => {
          if (prev === null) return filteredOptions.length - 1;
          return prev === 0 ? filteredOptions.length - 1 : prev - 1;
        });
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex !== null && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };
  
  // Handle selection of an option
  const handleSelect = (option: AutoSuggestOption) => {
    onSelect(option);
    if (clearOnSelect) {
      onChange('');
    } else {
      onChange(option.label);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  // Handle focus and blur events
  const handleFocus = () => {
    if (value.trim() !== '' || filteredOptions.length > 0) {
      setIsOpen(true);
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (closeOnBlur && !dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };
  
  // Scroll to highlighted option when navigating with keyboard
  useEffect(() => {
    if (highlightedIndex !== null && isOpen && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);
  
  return (
    <div className={clsx('relative w-full', className)}>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-2 border border-gray-300 rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'bg-white text-gray-900 placeholder-gray-500',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            icon && 'pl-10'
          )}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        
        {value && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear input"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          style={{ maxHeight }}
          role="listbox"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-700">{loadingMessage}</div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-red-600">{error}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-700">{noResultsMessage}</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                data-index={index}
                className={clsx(
                  'px-4 py-2 cursor-pointer text-sm',
                  highlightedIndex === index
                    ? 'bg-blue-50 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-900'
                )}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {renderOption ? renderOption(option, highlightedIndex === index) : option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AutoSuggest; 