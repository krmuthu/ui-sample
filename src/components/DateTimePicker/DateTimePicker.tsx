import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Calendar from '../Calendar/Calendar';
import TimeList, { TimeOption } from '../TimeList';

export interface DateTimePickerProps {
  /**
   * The selected date and time value
   */
  value?: Date | null;
  
  /**
   * Callback for when the date and time changes
   */
  onChange?: (date: Date | null) => void;
  
  /**
   * Label for the date time picker
   */
  label?: string;
  
  /**
   * Placeholder text for the input
   * @default "Select date and time"
   */
  placeholder?: string;
  
  /**
   * Whether the date time picker is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Format for displaying the date in the input
   * @default "MM/dd/yyyy"
   */
  dateDisplayFormat?: string;
  
  /**
   * Format for displaying the time in the input
   * @default "12h" (12-hour format with AM/PM)
   */
  timeDisplayFormat?: '12h' | '24h';
  
  /**
   * Minimum selectable date and time
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date and time
   */
  maxDate?: Date;
  
  /**
   * Minimum selectable time (applies to all days)
   */
  minTime?: Date;
  
  /**
   * Maximum selectable time (applies to all days)
   */
  maxTime?: Date;
  
  /**
   * Array of dates to disable
   */
  disabledDates?: Date[];
  
  /**
   * Custom function to determine if a date should be disabled
   */
  isDateDisabled?: (date: Date) => boolean;
  
  /**
   * Minute step interval
   * @default 5
   */
  minuteStep?: number;
  
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
   * The visual variant of the date time picker
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Additional class name for the date time picker container
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
   * Whether the date time picker is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Icon to show at the start of the input
   */
  startIcon?: React.ReactNode;
  
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
   * Callback for when the dropdown opens
   */
  onOpen?: () => void;
  
  /**
   * Callback for when the dropdown closes
   */
  onClose?: () => void;
}

// Helper functions for date and time formatting
const formatDateTime = (date: Date, dateFormat: string, timeFormat: '12h' | '24h', locale: string = 'en-US'): string => {
  if (!date) return '';
  
  // Format date part
  let result = '';
  
  // Support for simple date format patterns
  if (dateFormat === 'MM/dd/yyyy') {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    result = `${month}/${day}/${year}`;
  } else {
    // Default to locale string if format not recognized
    try {
      result = date.toLocaleDateString(locale);
    } catch {
      result = date.toLocaleDateString('en-US');
    }
  }
  
  // Format time part
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  if (timeFormat === '24h') {
    const hours = String(hours24).padStart(2, '0');
    result += ` ${hours}:${minutes}`;
  } else {
    // 12-hour format
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for 12 AM
    result += ` ${hours12}:${minutes} ${period}`;
  }
  
  return result;
};

const parseDateTime = (dateTimeString: string, dateFormat: string, timeFormat: '12h' | '24h'): Date | null => {
  if (!dateTimeString) return null;
  
  // Split into date and time parts
  const parts = dateTimeString.trim().split(' ');
  if (parts.length < 2) return null;
  
  const datePart = parts[0];
  const timePart = parts.slice(1).join(' ');
  
  // Parse date part
  let year = 0, month = 0, day = 0;
  
  if (dateFormat === 'MM/dd/yyyy') {
    const dateParts = datePart.split('/');
    if (dateParts.length === 3) {
      month = parseInt(dateParts[0], 10) - 1;
      day = parseInt(dateParts[1], 10);
      year = parseInt(dateParts[2], 10);
      
      if (isNaN(month) || isNaN(day) || isNaN(year)) {
        return null;
      }
    } else {
      return null;
    }
  } else {
    // For other formats, try standard date parsing
    const tempDate = new Date(datePart);
    if (isNaN(tempDate.getTime())) {
      return null;
    }
    year = tempDate.getFullYear();
    month = tempDate.getMonth();
    day = tempDate.getDate();
  }
  
  // Parse time part
  let hours = 0, minutes = 0;
  
  if (timeFormat === '24h') {
    // Parse 24-hour format (HH:MM)
    const match = timePart.match(/^(\d{1,2}):(\d{1,2})$/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      
      if (hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
        return null;
      }
    } else {
      return null;
    }
  } else {
    // Parse 12-hour format (hh:mm AM/PM)
    const match = timePart.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      
      if (hours <= 0 || hours > 12 || minutes < 0 || minutes >= 60) {
        return null;
      }
      
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    } else {
      return null;
    }
  }
  
  // Create and return the date object
  const date = new Date(year, month, day, hours, minutes, 0, 0);
  return date;
};

// DateTimePicker Component
const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value = null,
  onChange,
  label,
  placeholder = "Select date and time",
  disabled = false,
  dateDisplayFormat = "MM/dd/yyyy",
  timeDisplayFormat = '12h',
  minDate,
  maxDate,
  minTime,
  maxTime,
  disabledDates = [],
  isDateDisabled,
  minuteStep = 5,
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
  initialMonth,
  locale = "en-US",
  onOpen,
  onClose
}) => {
  // State hooks
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDateTime(value, dateDisplayFormat, timeDisplayFormat, locale) : '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [dropdownPosition, setDropdownPosition] = useState({ 
    translateX: -1000,
    translateY: -1000
  });
  const [mounted, setMounted] = useState(false);
  
  // Time selection state
  const [selectedHour, setSelectedHour] = useState<number>(
    value ? (timeDisplayFormat === '12h' ? (value.getHours() % 12 || 12) : value.getHours()) : 
    timeDisplayFormat === '12h' ? 12 : 0
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(value ? value.getMinutes() : 0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(
    value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM'
  );
  
  // Generate time options
  const hoursOptions = generateHoursOptions(
    timeDisplayFormat, 
    minTime, 
    maxTime
  );
  const minutesOptions = generateMinuteOptions(
    minuteStep, 
    selectedHour, 
    selectedPeriod, 
    minTime, 
    maxTime
  );
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef<boolean>(false);
  
  // Generate unique ID for accessibility
  const uniqueId = useRef(`datetimepicker-${Math.random().toString(36).substring(2, 11)}`);
  const inputId = id || uniqueId.current;
  const dropdownId = `${inputId}-dropdown`;
  
  // Effect hooks
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  useEffect(() => {
    if (value) {
      setInputValue(formatDateTime(value, dateDisplayFormat, timeDisplayFormat, locale));
      setSelectedDate(value);
      setSelectedHour(timeDisplayFormat === '12h' ? (value.getHours() % 12 || 12) : value.getHours());
      setSelectedMinute(value.getMinutes());
      setSelectedPeriod(value.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      setInputValue('');
      setSelectedDate(null);
    }
  }, [value, dateDisplayFormat, timeDisplayFormat, locale]);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    if (!isOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
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
  
  // Update dropdown position when it opens
  useEffect(() => {
    if (isOpen && inputRef.current && dropdownRef?.current) {
      const updatePosition = () => {
        if (!inputRef.current) return;
        
        const inputRect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const dropdownRect = dropdownRef?.current?.getBoundingClientRect();
        
        // Check if opening the dropdown below would push it off-screen
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 400; // Approximate height of calendar with time picker
        const spaceBelow = viewportHeight - inputRect.bottom;
        
        // Calculate transform values instead of absolute positioning
        // If there's not enough space below, position it above the input
        const translateY = spaceBelow < dropdownHeight && inputRect.top > dropdownHeight
          ? scrollY + inputRect.top - 4 - (dropdownRect?.height || 0)  // Position above with a small gap
          : scrollY + inputRect.bottom + 4 // Position below with a small gap
          
        setDropdownPosition({
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
      setSelectedDate(null);
      return;
    }
    
    const parsedDateTime = parseDateTime(newValue, dateDisplayFormat, timeDisplayFormat);
    if (parsedDateTime) {
      if (onChange) onChange(parsedDateTime);
      setSelectedDate(parsedDateTime);
      setSelectedHour(timeDisplayFormat === '12h' ? (parsedDateTime.getHours() % 12 || 12) : parsedDateTime.getHours());
      setSelectedMinute(parsedDateTime.getMinutes());
      setSelectedPeriod(parsedDateTime.getHours() >= 12 ? 'PM' : 'AM');
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setSelectedDate(null);
      setInputValue('');
      if (onChange) onChange(null);
      return;
    }
    
    // Preserve the time from the current selection
    const newDateTime = new Date(date);
    if (selectedDate) {
      newDateTime.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        0,
        0
      );
    }
    
    setSelectedDate(newDateTime);
    setInputValue(formatDateTime(newDateTime, dateDisplayFormat, timeDisplayFormat, locale));
    if (onChange) onChange(newDateTime);
    touchedRef.current = true;
  };
  
  // Time selection handlers
  const handleHourSelect = (hour: number) => {
    // When hour is selected, find the first available minute if current minute is disabled
    let minute = selectedMinute;
    const hourInFormat = hour;
    
    // Check if the currently selected minute is valid with the new hour
    let hour24 = hourInFormat;
    if (timeDisplayFormat === '12h') {
      if (selectedPeriod === 'PM' && hourInFormat !== 12) hour24 += 12;
      if (selectedPeriod === 'AM' && hourInFormat === 12) hour24 = 0;
    }
    
    if (isTimeDisabled(hour24, minute, minTime, maxTime)) {
      minute = findFirstEnabledMinute(hourInFormat, selectedPeriod, minuteStep, minTime, maxTime);
    }
    
    // Update state with new values
    setSelectedHour(hour);
    
    // Only update minute if it changed
    if (minute !== selectedMinute) {
      setSelectedMinute(minute);
    }
    
    // Update the selected date with the new time
    updateSelectedDateTime(hour, minute, selectedPeriod);
  };
  
  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    
    // Update the selected date with the new time
    updateSelectedDateTime(selectedHour, minute, selectedPeriod);
  };
  
  const handlePeriodSelect = (period: 'AM' | 'PM') => {
    // When period changes, check if current hour/minute combination is still valid
    const currentHour = selectedHour;
    let hour24 = currentHour;
    
    if (period === 'PM' && currentHour !== 12) hour24 += 12;
    if (period === 'AM' && currentHour === 12) hour24 = 0;
    
    let minute = selectedMinute;
    if (isTimeDisabled(hour24, minute, minTime, maxTime)) {
      minute = findFirstEnabledMinute(currentHour, period, minuteStep, minTime, maxTime);
      setSelectedMinute(minute);
    }
    
    setSelectedPeriod(period);
    
    // Update the selected date with the new time
    updateSelectedDateTime(selectedHour, minute, period);
  };
  
  // Helper function to update the datetime with selected time components
  const updateSelectedDateTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    // Use current date or initialize a new one if none is selected
    const baseDate = selectedDate || new Date();
    const newDateTime = new Date(baseDate);
    
    // Convert to 24-hour format for Date object
    let hours24 = hour;
    if (timeDisplayFormat === '12h') {
      if (period === 'PM' && hour !== 12) hours24 += 12;
      if (period === 'AM' && hour === 12) hours24 = 0;
    }
    
    newDateTime.setHours(hours24, minute, 0, 0);
    
    // Update state
    setSelectedDate(newDateTime);
    setInputValue(formatDateTime(newDateTime, dateDisplayFormat, timeDisplayFormat, locale));
    if (onChange) onChange(newDateTime);
    touchedRef.current = true;
  };
  
  const handleClear = () => {
    if (inputValue === '') return;
    
    setInputValue('');
    setSelectedDate(null);
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
  
  // Dropdown classes
  const dropdownContainerClasses = [
    'absolute z-50 shadow-lg mt-1',
    'w-auto'
  ].join(' ');
  
  // Calendar and TimeList rendering
  const dropdownComponent = isOpen && mounted ? (
    <div 
      ref={dropdownRef}
      id={dropdownId}
      className={dropdownContainerClasses}
      role="dialog"
      aria-modal="true"
      aria-label="Date and time picker"
      style={{
        transform: `translate(${dropdownPosition.translateX}px, ${dropdownPosition.translateY}px)`,
        inset: '0px auto auto 0px',
      }}
    >
      <div className="bg-[var(--background)] rounded-md border border-[var(--btn-secondary-border)] overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row">
          {/* Calendar */}
          <div className="w-full max-w-full sm:max-w-[350px] p-2">
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              isDateDisabled={isDateDisabled}
              closeOnSelect={false}
              initialMonth={selectedDate ? selectedDate : initialMonth}
              locale={locale}
            />
          </div>
          {/* Time Selection */}
          <div className="w-full max-w-full sm:max-w-[250px] p-2 border-t sm:border-t-0 sm:border-l border-[var(--btn-secondary-border)]">
            <div className="text-sm font-medium mb-2 text-[var(--foreground)] px-2">
              Select Time
            </div>
            
            <div className="px-2">
              <TimeList
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                selectedPeriod={selectedPeriod}
                hourOptions={hoursOptions}
                minuteOptions={minutesOptions}
                displayFormat={timeDisplayFormat}
                onHourSelect={handleHourSelect}
                onMinuteSelect={handleMinuteSelect}
                onPeriodSelect={handlePeriodSelect}
              />
            </div>

            {/* Current selection display */}
            <div className="mt-3 px-2 py-1 bg-[var(--background)] border border-[var(--btn-secondary-border)] rounded-md text-center">
              <p className="text-sm text-[var(--foreground)]">
                <span className="font-medium">Selected time:</span> 
                <span className="ml-1">
                  {selectedHour.toString().padStart(2, '0')}:
                  {selectedMinute.toString().padStart(2, '0')}
                  {timeDisplayFormat === '12h' ? ` ${selectedPeriod}` : ''}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="border-t border-[var(--btn-secondary-border)] px-4 py-2 flex justify-end space-x-2">
          <button
            type="button"
            className="px-3 py-1 rounded-md text-sm bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] text-[var(--btn-secondary-text)]"
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="px-3 py-1 rounded-md text-sm bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)]"
            onClick={() => {
              if (selectedDate) {
                setInputValue(formatDateTime(selectedDate, dateDisplayFormat, timeDisplayFormat, locale));
                if (onChange) onChange(selectedDate);
                touchedRef.current = true;
              }
              setIsOpen(false);
              if (onClose) onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
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
          aria-controls={isOpen ? dropdownId : undefined}
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
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3" 
            />
          </svg>
        </div>
        
        {clearable && inputValue && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-7 flex items-center text-[var(--btn-secondary-text)] hover:text-[var(--foreground)]"
            onClick={handleClear}
            aria-label="Clear date and time"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {mounted && isOpen && createPortal(dropdownComponent, document.body)}
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

// Add the time helper functions from TimePicker
const isTimeDisabled = (
  hours: number,
  minutes: number,
  minTime?: Date,
  maxTime?: Date
): boolean => {
  if (!minTime && !maxTime) return false;
  
  // Extract only the time part for comparison
  const timeValue = new Date();
  timeValue.setHours(hours, minutes, 0, 0);
  
  if (minTime) {
    const minTimeValue = new Date();
    minTimeValue.setHours(minTime.getHours(), minTime.getMinutes(), 0, 0);
    if (timeValue < minTimeValue) return true;
  }
  
  if (maxTime) {
    const maxTimeValue = new Date();
    maxTimeValue.setHours(maxTime.getHours(), maxTime.getMinutes(), 0, 0);
    if (timeValue > maxTimeValue) return true;
  }
  
  return false;
};

// Generate hours options based on 12h or 24h format
const generateHoursOptions = (
  format: '12h' | '24h',
  minTime?: Date,
  maxTime?: Date
): Array<TimeOption> => {
  const result: TimeOption[] = [];
  const maxHours = format === '12h' ? 12 : 23;
  const minHours = format === '12h' ? 1 : 0;
  
  for (let hour = minHours; hour <= maxHours; hour++) {
    // For 12-hour format, we need to check both AM and PM possibilities
    if (format === '12h') {
      // Check AM
      const amDisabled = isTimeDisabled(hour === 12 ? 0 : hour, 0, minTime, maxTime) && 
                          isTimeDisabled(hour === 12 ? 0 : hour, 30, minTime, maxTime) && 
                          isTimeDisabled(hour === 12 ? 0 : hour, 59, minTime, maxTime);
      
      // Check PM
      const pmDisabled = isTimeDisabled(hour === 12 ? 12 : hour + 12, 0, minTime, maxTime) && 
                          isTimeDisabled(hour === 12 ? 12 : hour + 12, 30, minTime, maxTime) && 
                          isTimeDisabled(hour === 12 ? 12 : hour + 12, 59, minTime, maxTime);
      
      // Only disable if both AM and PM versions are disabled
      const disabled = amDisabled && pmDisabled;
      
      result.push({
        value: hour,
        label: hour.toString().padStart(2, '0'),
        disabled
      });
    } else {
      // For 24-hour format, check if all minutes in this hour are disabled
      const disabled = isTimeDisabled(hour, 0, minTime, maxTime) && 
                       isTimeDisabled(hour, 30, minTime, maxTime) && 
                       isTimeDisabled(hour, 59, minTime, maxTime);
      
      result.push({
        value: hour,
        label: hour.toString().padStart(2, '0'),
        disabled
      });
    }
  }
  
  return result;
};

// Generate minute options
const generateMinuteOptions = (
  step: number = 5,
  selectedHour: number,
  period: 'AM' | 'PM',
  minTime?: Date,
  maxTime?: Date
): Array<TimeOption> => {
  const result: TimeOption[] = [];
  
  // Convert 12-hour format hour to 24-hour format for calculations
  let hour24 = selectedHour;
  if (period === 'PM' && selectedHour !== 12) hour24 += 12;
  if (period === 'AM' && selectedHour === 12) hour24 = 0;
  
  for (let minute = 0; minute < 60; minute += step) {
    const disabled = isTimeDisabled(hour24, minute, minTime, maxTime);
    
    result.push({
      value: minute,
      label: minute.toString().padStart(2, '0'),
      disabled
    });
  }
  
  return result;
};

// Helper function to find the first enabled minute for a given hour
const findFirstEnabledMinute = (
  hour: number,
  period: 'AM' | 'PM',
  minuteStep: number = 5,
  minTime?: Date,
  maxTime?: Date
): number => {
  // Convert to 24-hour format for calculations
  let hour24 = hour;
  if (period === 'PM' && hour !== 12) hour24 += 12;
  if (period === 'AM' && hour === 12) hour24 = 0;
  
  for (let minute = 0; minute < 60; minute += minuteStep) {
    if (!isTimeDisabled(hour24, minute, minTime, maxTime)) {
      return minute;
    }
  }
  
  // If no enabled minute found, return 0 as default
  return 0;
};

export default DateTimePicker; 