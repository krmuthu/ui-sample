import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from '../Calendar/Calendar';

export interface DatePickerProps {
  /**
   * The selected date value
   */
  value?: Date | null;
  
  /**
   * Callback for when the date changes
   */
  onChange?: (date: Date | null) => void;
  
  /**
   * Label for the date picker
   */
  label?: string;
  
  /**
   * Placeholder text for the input
   * @default "Select date"
   */
  placeholder?: string;
  
  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Format for displaying the date in the input
   * @default "MM/dd/yyyy"
   */
  displayFormat?: string;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  
  /**
   * Array of dates to disable
   */
  disabledDates?: Date[];
  
  /**
   * Custom function to determine if a date should be disabled
   */
  isDateDisabled?: (date: Date) => boolean;
  
  /**
   * Whether to disable all dates before the current date
   * @default false
   */
  disablePast?: boolean;
  
  /**
   * Whether to disable all dates after the current date
   * @default false
   */
  disableFuture?: boolean;
  
  /**
   * Whether to display a clear button
   * @default true
   */
  clearable?: boolean;
  
  /**
   * Error state of the input
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Whether the input takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * The size of the input
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The visual variant of the date picker
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Additional class name for the date picker container
   */
  className?: string;
  
  /**
   * Additional class name for the input element
   */
  inputClassName?: string;
  
  /**
   * ID for the input element
   */
  id?: string;
  
  /**
   * Name for the input element
   */
  name?: string;
  
  /**
   * Whether the date picker is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Icon to show at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Whether to close the calendar when a date is selected
   * @default true
   */
  closeOnSelect?: boolean;
  
  /**
   * Initial month to display when no date is selected
   * @default current month
   */
  initialMonth?: Date;
  
  /**
   * Locale for the date picker
   * @default "en-US"
   */
  locale?: string;
  
  /**
   * Callback for when the calendar opens
   */
  onOpen?: () => void;
  
  /**
   * Callback for when the calendar closes
   */
  onClose?: () => void;
}

// Helper functions for date manipulation
const formatDate = (date: Date, format: string, locale: string = 'en-US'): string => {
  if (!date) return '';
  
  // Support for simple format patterns
  if (format === 'MM/dd/yyyy') {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  // Default to locale string if format not recognized
  try {
    return date.toLocaleDateString(locale);
  } catch {
    return date.toLocaleDateString('en-US');
  }
};

const parseDate = (dateString: string, format: string): Date | null => {
  if (!dateString) return null;
  
  // Handle MM/dd/yyyy format
  if (format === 'MM/dd/yyyy') {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const date = new Date(year, month, day);
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          return date;
        }
      }
    }
  }
  
  // Try standard date parsing as fallback
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Custom isDateDisabled function that combines all constraints
const isDateDisabledWithConstraints = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  customIsDateDisabled?: (date: Date) => boolean,
  disablePast?: boolean,
  disableFuture?: boolean
): boolean => {
  // Check custom isDateDisabled function
  if (customIsDateDisabled && customIsDateDisabled(date)) {
    return true;
  }
  
  // Check min date
  if (minDate && date < minDate) {
    return true;
  }
  
  // Check max date
  if (maxDate && date > maxDate) {
    return true;
  }
  
  // Check if date is in disabledDates array
  if (disabledDates) {
    for (const disabledDate of disabledDates) {
      if (
        date.getDate() === disabledDate.getDate() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getFullYear() === disabledDate.getFullYear()
      ) {
        return true;
      }
    }
  }
  
  // Check disablePast - compare dates without time
  if (disablePast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    if (dateToCheck < today) {
      return true;
    }
  }
  
  // Check disableFuture - compare dates without time
  if (disableFuture) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    if (dateToCheck > today) {
      return true;
    }
  }
  
  return false;
};

// Date Picker Component
export const DatePicker: React.FC<DatePickerProps> = ({
  value = null,
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  displayFormat = "MM/dd/yyyy",
  minDate,
  maxDate,
  disabledDates = [],
  isDateDisabled,
  disablePast = false,
  disableFuture = false,
  clearable = true,
  error = false,
  errorMessage,
  helperText,
  fullWidth = false,
  size = 'medium',
  variant = 'primary',
  className = '',
  inputClassName = '',
  id,
  name,
  required = false,
  startIcon,
  closeOnSelect = true,
  initialMonth,
  locale = "en-US",
  onOpen,
  onClose
}) => {
  // State hooks
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDate(value, displayFormat, locale) : '');
  const [calendarPosition, setCalendarPosition] = useState({ 
    translateX: -1000,
    translateY: -1000
  });
  const [mounted, setMounted] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef<boolean>(false);
  
  // Generate unique ID for accessibility
  const uniqueId = useRef(`datepicker-${Math.random().toString(36).substring(2, 11)}`);
  const inputId = id || uniqueId.current;
  const calendarId = `${inputId}-calendar`;
  
  // Effect hooks
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value, displayFormat, locale));
    } else {
      setInputValue('');
    }
  }, [value, displayFormat, locale]);
  
  // Handle outside click to close calendar
  useEffect(() => {
    if (!isOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // Update calendar position when it opens
  useEffect(() => {
    if (isOpen && inputRef.current && calendarRef?.current) {
      const updatePosition = () => {
        if (!inputRef.current) return;
        
        const inputRect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const calRect = calendarRef?.current?.getBoundingClientRect();
        
        // Check if opening the calendar below would push it off-screen
        const viewportHeight = window.innerHeight;
        const calendarHeight = 300; // Approximate height of calendar
        const spaceBelow = viewportHeight - inputRect.bottom;
        
        // Calculate transform values instead of absolute positioning
        // If there's not enough space below, position it above the input
        const translateY = spaceBelow < calendarHeight && inputRect.top > calendarHeight
          ? scrollY + inputRect.top - 4 - (calRect?.height || 0)  // Position above with a small gap
          : scrollY + inputRect.bottom + 4 // Position below with a small gap
          
        setCalendarPosition({
          translateX: scrollX + inputRect.left,
          translateY
        });
      };
      
      updatePosition();
      // Update position when window is resized or scrolled
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen]);
  
  // Methods
  const handleInputClick = () => {
    if (disabled) return;
    
    if (!isOpen) {
      setIsOpen(true);
      if (onOpen) onOpen();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    touchedRef.current = true;
    
    if (!newValue) {
      if (onChange) onChange(null);
      return;
    }
    
    const parsedDate = parseDate(newValue, displayFormat);
    if (parsedDate) {
      if (onChange) onChange(parsedDate);
    }
  };
  
  const handleDateSelect = (date: Date) => {
    setInputValue(formatDate(date, displayFormat, locale));
    touchedRef.current = true;
    
    if (onChange) onChange(date);
    
    if (closeOnSelect) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };
  
  const handleClear = () => {
    if (inputValue === '') return;
    
    setInputValue('');
    if (onChange) onChange(null);
    touchedRef.current = true;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        if (onOpen) onOpen();
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    } else if (e.key === 'Tab') {
      if (isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    }
  };
  
  // Style classes
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-3 text-base',
    large: 'py-3 px-4 text-lg',
  };
  
  // Separate text and border colors
  const variantTextClasses = {
    primary: 'text-[var(--foreground)]',
    secondary: 'text-[var(--btn-secondary-text)]',
    tertiary: 'text-[var(--btn-tertiary-text)]',
  };
  
  // Border classes - only applied when not in error state
  const variantBorderClasses = {
    primary: 'border-[var(--btn-primary-ring)]',
    secondary: 'border-[var(--btn-secondary-ring)]',
    tertiary: 'border-[var(--btn-tertiary-ring)]',
  };
  
  // Background classes
  const variantBgClasses = {
    primary: 'bg-[var(--input-background)]',
    secondary: 'bg-transparent',
    tertiary: 'border-transparent',
  };
  
  // Padding adjustments for icons
  const startIconPadding = startIcon ? 'pl-9' : '';
  
  const inputClasses = [
    'rounded-md',
    'border',
    'transition-colors',
    'duration-200',
    'w-full',
    'focus:outline-none',
    'focus:ring-2',
    variantTextClasses[variant],
    variantBgClasses[variant],
    sizeClasses[size],
    startIconPadding,
    error 
      ? 'border-[var(--btn-primary-negative-bg)] focus:border-[var(--btn-primary-negative-bg)] focus:ring-[var(--btn-primary-negative-ring)]' 
      : variantBorderClasses[variant] + ' focus:border-[var(--btn-primary-ring)] focus:ring-[var(--btn-primary-ring)]',
    disabled ? 'cursor-not-allowed opacity-60 bg-[var(--btn-disabled-bg)]' : '',
    inputClassName
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    className
  ].filter(Boolean).join(' ');
  
  // Calendar classes
  const calendarContainerClasses = [
    'absolute z-50 shadow-lg mt-1',
    'w-auto'
  ].join(' ');
  
  // Create a wrapper for the isDateDisabled function that includes all constraints
  const handleIsDateDisabled = (date: Date) => {
    return isDateDisabledWithConstraints(
      date, 
      minDate, 
      maxDate, 
      disabledDates, 
      isDateDisabled,
      disablePast,
      disableFuture
    );
  };
  
  // Calendar rendering
  const calendarComponent = isOpen && mounted ? (
    <div 
      ref={calendarRef}
      id={calendarId}
      className={calendarContainerClasses}
      role="dialog"
      aria-modal="true"
      aria-label="Date picker calendar"
      style={{
        transform: `translate(${calendarPosition.translateX}px, ${calendarPosition.translateY}px)`,
        inset: '0px auto auto 0px',
      }}
    >
      <Calendar
        value={value}
        //onChange={onChange} disable onchange from calender
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        isDateDisabled={handleIsDateDisabled}
        closeOnSelect={closeOnSelect}
        initialMonth={value || initialMonth}
        locale={locale}
        onDateSelect={date => handleDateSelect(date)}
        onClose={() => {
          setIsOpen(false);
          if (onClose) onClose();
        }}
      />
    </div>
  ) : null;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium ${error ? 'text-[var(--btn-primary-negative-text)]' : 'text-[var(--foreground)]'} mb-1`}
        >
          {label}
          {required && <span className="ml-1 text-[var(--btn-primary-negative-text)]">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          id={inputId}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={
            error && errorMessage 
              ? `${inputId}-error` 
              : helperText 
                ? `${inputId}-helper` 
                : undefined
          }
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? calendarId : undefined}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className={`h-5 w-5 ${error ? 'text-[var(--btn-primary-negative-text)]' : 'text-[var(--btn-secondary-text)]'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
        
        {clearable && inputValue && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-7 flex items-center text-[var(--btn-secondary-text)] hover:text-[var(--foreground)]"
            onClick={handleClear}
            aria-label="Clear date"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {mounted && isOpen && createPortal(calendarComponent, document.body)}
      </div>
      
      {error && errorMessage && (
        <p className="mt-1 text-xs text-[var(--btn-primary-negative-text)]" id={`${inputId}-error`}>
          {errorMessage}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-[var(--btn-secondary-text)]" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
