import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): boolean => {
  // Check if date is within min and max bounds
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  
  // Check if date is in disabled dates array
  if (disabledDates) {
    return disabledDates.some(disabledDate => 
      disabledDate.getFullYear() === date.getFullYear() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getDate() === date.getDate()
    );
  }
  
  return false;
};

const generateCalendarDays = (
  month: number,
  year: number,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): Array<{ date: Date; disabled: boolean; isCurrentMonth: boolean }> => {
  const result = [];
  
  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();
  
  // Get the last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Add days from previous month to fill the first week
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    result.push({
      date,
      disabled: isDateDisabled(date, minDate, maxDate, disabledDates),
      isCurrentMonth: false
    });
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    result.push({
      date,
      disabled: isDateDisabled(date, minDate, maxDate, disabledDates),
      isCurrentMonth: true
    });
  }
  
  // Add days from next month to complete the last week
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const date = new Date(year, month + 1, i);
    result.push({
      date,
      disabled: isDateDisabled(date, minDate, maxDate, disabledDates),
      isCurrentMonth: false
    });
  }
  
  return result;
};

// Date Picker Component
const DatePicker: React.FC<DatePickerProps> = ({
  value = null,
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  displayFormat = "MM/dd/yyyy",
  minDate,
  maxDate,
  disabledDates = [],
  clearable = true,
  error = false,
  errorMessage,
  helperText,
  fullWidth = false,
  size = 'medium',
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
  const [currentMonth, setCurrentMonth] = useState(() => value || initialMonth || new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; disabled: boolean; isCurrentMonth: boolean }>>([]);
  const [mounted, setMounted] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ 
    translateX: -1000,
    translateY: -1000
  });
  
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
      if (!currentMonth || 
          value.getFullYear() !== currentMonth.getFullYear() || 
          value.getMonth() !== currentMonth.getMonth()) {
        setCurrentMonth(value);
      }
    } else {
      setInputValue('');
    }
  }, [value, displayFormat, locale]);
  
  useEffect(() => {
    if (!currentMonth) return;
    
    setCalendarDays(generateCalendarDays(
      currentMonth.getMonth(),
      currentMonth.getFullYear(),
      minDate,
      maxDate,
      disabledDates
    ));
  }, [currentMonth]);
  
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
    if (
      parsedDate &&
      !isDateDisabled(parsedDate, minDate, maxDate, disabledDates)
    ) {
      if (onChange) onChange(parsedDate);
    }
  };
  
  const handleDateSelect = (date: Date) => {
    if (value && 
        date.getFullYear() === value.getFullYear() && 
        date.getMonth() === value.getMonth() && 
        date.getDate() === value.getDate()) {
      if (closeOnSelect) {
        setIsOpen(false);
        if (onClose) onClose();
      }
      return;
    }
    
    const formattedDate = formatDate(date, displayFormat, locale);
    setInputValue(formattedDate);
    touchedRef.current = true;
    
    if (onChange) onChange(date);
    
    if (closeOnSelect) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handlePrevYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  };
  
  const handleNextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
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
    small: 'text-xs py-1 px-2',
    medium: 'text-sm py-2 px-3',
    large: 'text-base py-2.5 px-4',
  };
  
  const inputClasses = [
    'rounded-md',
    'border',
    'transition-colors',
    'duration-200',
    'w-full',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'dark:bg-gray-800',
    'dark:text-white',
    sizeClasses[size],
    error 
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
      : 'border-gray-300 focus:border-primary-500 dark:border-gray-600',
    disabled ? 'bg-gray-100 cursor-not-allowed opacity-60 dark:bg-gray-700' : 'bg-white',
    startIcon ? 'pl-8' : '',
    inputClassName
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    className
  ].filter(Boolean).join(' ');
  
  // Calendar day names
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 0, i + 1); // Using a Sunday in 2023 as a reference
    return date.toLocaleDateString(locale, { weekday: 'short' });
  });
  
  // Calendar rendering
  const calendar = isOpen && mounted ? (
    <div 
      ref={calendarRef}
      id={calendarId}
      className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg p-3 dark:bg-gray-800 dark:border-gray-700 w-64"
      role="dialog"
      aria-modal="true"
      aria-label="Date picker calendar"
      style={{
        transform: `translate(${calendarPosition.translateX}px, ${calendarPosition.translateY}px)`,
        inset: '0px auto auto 0px',
      }}
    >
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-1">
          <button 
            type="button"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button 
            type="button"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div className="text-sm font-medium">
          {currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            type="button"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button 
            type="button"
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            onClick={handleNextYear}
            aria-label="Next year"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day, index) => (
          <div 
            key={`header-${index}`} 
            className="text-xs font-medium text-center text-gray-500 dark:text-gray-400 py-1"
          >
            {day.substring(0, 1)}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isSelected = value && 
            day.date.getFullYear() === value.getFullYear() && 
            day.date.getMonth() === value.getMonth() && 
            day.date.getDate() === value.getDate();
          
          const isToday = (() => {
            const today = new Date();
            return day.date.getFullYear() === today.getFullYear() && 
              day.date.getMonth() === today.getMonth() && 
              day.date.getDate() === today.getDate();
          })();
          
          return (
            <button
              key={`day-${index}`}
              type="button"
              disabled={day.disabled}
              onClick={() => !day.disabled && handleDateSelect(day.date)}
              className={`
                text-center p-1 rounded text-sm
                ${day.isCurrentMonth ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
                ${day.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${isSelected ? 'bg-primary-500 text-white hover:bg-primary-600 dark:hover:bg-primary-600' : ''}
                ${isToday && !isSelected ? 'border border-primary-500' : ''}
              `}
              aria-label={day.date.toLocaleDateString(locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              aria-selected={isSelected || false}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium ${error ? 'text-error-500' : 'text-gray-700 dark:text-gray-300'} mb-1`}
        >
          {label}
          {required && <span className="ml-1 text-error-500">*</span>}
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
            className={`h-5 w-5 ${error ? 'text-error-500' : 'text-gray-400'}`} 
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
            className="absolute inset-y-0 right-7 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={handleClear}
            aria-label="Clear date"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {mounted && isOpen && createPortal(calendar, document.body)}
      </div>
      
      {error && errorMessage && (
        <p className="mt-1 text-xs text-error-500" id={`${inputId}-error`}>
          {errorMessage}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default DatePicker; 