import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { FormLabel } from '../FormLabel/FormLabel';

/**
 * Option interface for Select component items
 */
export interface SelectOption {
  /**
   * The value of the option (used internally)
   */
  value: string;
  
  /**
   * The label to display for this option
   */
  label: string;
  
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
}

/**
 * Props for the Select component
 * @interface SelectProps
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLDivElement>, 'size' | 'value' | 'onChange'> {
  /**
   * Array of options to display in the select
   */
  options: SelectOption[];
  
  /**
   * The selected value
   */
  value?: string;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * The size of the select component
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the select
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the select shows an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Whether the select takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;

  /**
   * HTML name attribute
   */
  name?: string;
  
  /**
   * Label text to display above the select
   */
  label?: string;
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Select - A dropdown selection component
 * 
 * @example
 * ```tsx
 * <Select 
 *   label="Country"
 *   required
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]} 
 *   placeholder="Select an option"
 * />
 * ```
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options = [],
  value = '',
  placeholder = '',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  error = false,
  errorMessage,
  fullWidth = false,
  className = '',
  onChange,
  id,
  name,
  label,
  required = false,
  'data-testid': dataTestId,
  ...rest
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Keep internal state in sync with external value
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.filter(o => !o.disabled).length - 1 ? prev + 1 : prev
          );
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
          
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            const enabledOptions = options.filter(o => !o.disabled);
            if (enabledOptions[highlightedIndex]) {
              handleSelect(enabledOptions[highlightedIndex].value);
            }
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && optionsRef.current && highlightedIndex >= 0) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle selection
  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      setHighlightedIndex(-1);
    }
  };

  // Find the display label for the selected value
  const selectedOption = options.find(option => option.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Size classes
  const sizeClasses = {
    small: 'h-8 py-1 px-2 text-sm',
    medium: 'h-10 py-2 px-3 text-base',
    large: 'h-12 py-3 px-4 text-lg',
  };
  
  // Variant classes base (border and text colors)
  const variantBaseClasses = {
    primary: 'border-[var(--btn-primary-ring)] text-[var(--foreground)]',
    secondary: 'border-[var(--btn-secondary-ring)] text-[var(--btn-secondary-text)]',
    tertiary: 'border-[var(--btn-tertiary-ring)] text-[var(--btn-tertiary-text)]',
  };
  
  // Background classes
  const variantBgClasses = {
    primary: 'bg-[var(--input-background)]',
    secondary: 'bg-transparent',
    tertiary: 'border-transparent',
  };
  
  // Focus ring classes
  const focusRingClasses = {
    primary: 'focus:ring-[var(--btn-primary-ring)]',
    secondary: 'focus:ring-[var(--btn-secondary-ring)]',
    tertiary: 'focus:ring-[var(--btn-tertiary-ring)]',
  };
  
  // Error state overrides other styling
  const errorClass = error 
    ? 'border-[var(--btn-primary-negative-bg)] focus:ring-[var(--btn-primary-negative-ring)]' 
    : '';
    
  // Disabled state
  const disabledClass = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';
    
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes for the select container
  const selectClasses = [
    'rounded-md border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizeClasses[size],
    variantBaseClasses[variant],
    variantBgClasses[variant],
    focusRingClasses[variant],
    errorClass,
    disabledClass,
    widthClass,
    className,
  ].join(' ');

  // Dropdown classes
  const dropdownClasses = [
    'absolute mt-1 max-h-60 w-full overflow-y-auto rounded-md border',
    'shadow-lg z-10 divide-y divide-[var(--btn-secondary-border)]',
    variantBgClasses[variant],
    variantBaseClasses[variant],
  ].join(' ');

  // Generate a unique ID if one wasn't provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col" ref={containerRef}>
      {/* Hidden native select for form submission */}
      <input 
        type="hidden"
        name={name}
        value={selectedValue}
        id={selectId}
        required={required}
      />

      {/* Use FormLabel component for the label */}
      {label && (
        <FormLabel
          htmlFor={selectId}
          required={required}
          disabled={disabled}
          size={size}
        >
          {label}
        </FormLabel>
      )}

      <div className="relative">
        {/* Custom select button */}
        <div
          ref={ref}
          role="combobox"
          aria-controls="options-list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? selectId : undefined}
          aria-required={required}
          aria-invalid={error}
          className={selectClasses}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDropdown();
            }
          }}
          data-testid={dataTestId}
          {...rest}
        >
          <div className="flex items-center justify-between">
            <span className={!selectedValue && placeholder ? 'text-[var(--btn-secondary-text)] opacity-70' : ''}>
              {displayValue}
            </span>
            {/* Dropdown arrow */}
            <svg 
              className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>

        {/* Custom dropdown */}
        {isOpen && (
          <div 
            className={dropdownClasses}
            role="listbox"
            id="options-list"
            ref={optionsRef}
            aria-activedescendant={
              highlightedIndex >= 0 
                ? `option-${options.filter(o => !o.disabled)[highlightedIndex]?.value}` 
                : undefined
            }
          >
            {placeholder && !selectedValue && (
              <div 
                className={`${sizeClasses[size]} text-[var(--btn-secondary-text)] opacity-70`}
                role="option"
                aria-disabled
              >
                {placeholder}
              </div>
            )}
            {options.map((option, index) => {
              const isDisabled = !!option.disabled;
              const isSelected = option.value === selectedValue;
              const isHighlighted = index === highlightedIndex;

              // Option styling
              const optionClasses = [
                sizeClasses[size],
                'transition-colors duration-150',
                isSelected 
                  ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]' 
                  : 'hover:bg-[var(--btn-secondary-hover)]',
                isHighlighted && !isSelected ? 'bg-[var(--btn-secondary-hover)]' : '',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ');

              return (
                <div
                  key={option.value}
                  className={optionClasses}
                  role="option"
                  id={`option-${option.value}`}
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      handleSelect(option.value);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isDisabled) {
                      setHighlightedIndex(index);
                    }
                  }}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-[var(--btn-primary-negative-text)]">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 