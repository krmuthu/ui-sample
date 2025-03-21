import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TimeList } from '../TimeList';

export interface TimePickerProps {
  /**
   * The selected time value
   */
  value?: Date | null;
  
  /**
   * Callback for when the time changes
   */
  onChange?: (date: Date | null) => void;
  
  /**
   * Label for the time picker
   */
  label?: string;
  
  /**
   * Placeholder text for the input
   * @default "Select time"
   */
  placeholder?: string;
  
  /**
   * Whether the time picker is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Format for displaying the time in the input
   * @default "hh:mm A" (12-hour format with AM/PM)
   */
  displayFormat?: '12h' | '24h';
  
  /**
   * Minimum selectable time
   */
  minTime?: Date;
  
  /**
   * Maximum selectable time
   */
  maxTime?: Date;
  
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
   * The visual variant of the time picker
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Additional class name for the time picker container
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
   * Whether the time picker is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Icon to show at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Whether to close the time selector when a time is selected
   * @default true
   */
  closeOnSelect?: boolean;
  
  /**
   * Callback for when the time selector opens
   */
  onOpen?: () => void;
  
  /**
   * Callback for when the time selector closes
   */
  onClose?: () => void;

  /**
   * Whether to disable all times before the current time
   * @default false
   */
  disablePast?: boolean;
  
  /**
   * Whether to disable all times after the current time
   * @default false
   */
  disableFuture?: boolean;
  
  /**
   * Reference date for disablePast/disableFuture
   * If not provided, the current date/time will be used
   */
  referenceDate?: Date;
}

// Helper functions for time manipulation
const formatTime = (date: Date, format: '12h' | '24h'): string => {
  if (!date) return '';
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
};

const parseTime = (timeString: string, format: '12h' | '24h'): Date | null => {
  if (!timeString) return null;
  
  const now = new Date();
  let hours = 0;
  let minutes = 0;
  
  if (format === '24h') {
    // Parse 24-hour format (HH:MM)
    const match = timeString.match(/^(\d{1,2}):(\d{1,2})$/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
    }
  } else {
    // Parse 12-hour format (hh:mm AM/PM)
    const match = timeString.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      
      if (hours > 0 && hours <= 12 && minutes >= 0 && minutes < 60) {
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
    }
  }
  
  return null;
};

const isTimeDisabled = (
  hours: number,
  minutes: number,
  minTime?: Date,
  maxTime?: Date,
  disablePast?: boolean,
  disableFuture?: boolean,
  referenceDate?: Date
): boolean => {
  // Create a date object for comparison (only time part matters)
  const timeValue = new Date();
  timeValue.setHours(hours, minutes, 0, 0);
  
  // Check min time
  if (minTime) {
    const minTimeValue = new Date();
    minTimeValue.setHours(minTime.getHours(), minTime.getMinutes(), 0, 0);
    if (timeValue < minTimeValue) return true;
  }
  
  // Check max time
  if (maxTime) {
    const maxTimeValue = new Date();
    maxTimeValue.setHours(maxTime.getHours(), maxTime.getMinutes(), 0, 0);
    if (timeValue > maxTimeValue) return true;
  }
  
  // Check disablePast/disableFuture
  if (disablePast || disableFuture) {
    // Use reference date or current date
    const now = referenceDate ? new Date(referenceDate) : new Date();
    
    // For comparison, set the date part to be the same, we only care about time
    const compareDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      0,
      0
    );
    
    // Check if time is in the past
    if (disablePast && timeValue < compareDate) {
      return true;
    }
    
    // Check if time is in the future
    if (disableFuture && timeValue > compareDate) {
      return true;
    }
  }
  
  return false;
};

// Generate hours options based on 12h or 24h format
const generateHoursOptions = (
  format: '12h' | '24h',
  minTime?: Date,
  maxTime?: Date,
  disablePast?: boolean,
  disableFuture?: boolean,
  referenceDate?: Date
): Array<{ value: number; label: string; disabled: boolean }> => {
  const result = [];
  const maxHours = format === '12h' ? 12 : 23;
  const minHours = format === '12h' ? 1 : 0;
  
  for (let hour = minHours; hour <= maxHours; hour++) {
    // For 12-hour format, we need to check both AM and PM possibilities
    if (format === '12h') {
      // Check AM
      const amDisabled = isTimeDisabled(hour === 12 ? 0 : hour, 0, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                          isTimeDisabled(hour === 12 ? 0 : hour, 30, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                          isTimeDisabled(hour === 12 ? 0 : hour, 59, minTime, maxTime, disablePast, disableFuture, referenceDate);
      
      // Check PM
      const pmDisabled = isTimeDisabled(hour === 12 ? 12 : hour + 12, 0, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                          isTimeDisabled(hour === 12 ? 12 : hour + 12, 30, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                          isTimeDisabled(hour === 12 ? 12 : hour + 12, 59, minTime, maxTime, disablePast, disableFuture, referenceDate);
      
      // Only disable if both AM and PM versions are disabled
      const disabled = amDisabled && pmDisabled;
      
      result.push({
        value: hour,
        label: hour.toString().padStart(2, '0'),
        disabled
      });
    } else {
      // For 24-hour format, check if all minutes in this hour are disabled
      const disabled = isTimeDisabled(hour, 0, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                       isTimeDisabled(hour, 30, minTime, maxTime, disablePast, disableFuture, referenceDate) && 
                       isTimeDisabled(hour, 59, minTime, maxTime, disablePast, disableFuture, referenceDate);
      
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
  maxTime?: Date,
  disablePast?: boolean,
  disableFuture?: boolean,
  referenceDate?: Date
): Array<{ value: number; label: string; disabled: boolean }> => {
  const result = [];
  
  // Convert 12-hour format hour to 24-hour format for calculations
  let hour24 = selectedHour;
  if (period === 'PM' && selectedHour !== 12) hour24 += 12;
  if (period === 'AM' && selectedHour === 12) hour24 = 0;
  
  for (let minute = 0; minute < 60; minute += step) {
    const disabled = isTimeDisabled(hour24, minute, minTime, maxTime, disablePast, disableFuture, referenceDate);
    
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
  maxTime?: Date,
  disablePast?: boolean,
  disableFuture?: boolean,
  referenceDate?: Date
): number => {
  // Convert to 24-hour format for calculations
  let hour24 = hour;
  if (period === 'PM' && hour !== 12) hour24 += 12;
  if (period === 'AM' && hour === 12) hour24 = 0;
  
  for (let minute = 0; minute < 60; minute += minuteStep) {
    if (!isTimeDisabled(hour24, minute, minTime, maxTime, disablePast, disableFuture, referenceDate)) {
      return minute;
    }
  }
  
  // If no enabled minute found, return 0 as default
  return 0;
};

// TimePicker Component
export const TimePicker: React.FC<TimePickerProps> = ({
  value = null,
  onChange,
  label,
  placeholder = "Select time",
  disabled = false,
  displayFormat = '12h',
  minTime,
  maxTime,
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
  closeOnSelect = true,
  onOpen,
  onClose,
  disablePast = false,
  disableFuture = false,
  referenceDate
}) => {
  // State for input and dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatTime(value, displayFormat) : '');
  const [mounted, setMounted] = useState(false);
  
  // State for selected time components
  const [selectedHour, setSelectedHour] = useState<number>(
    value ? (displayFormat === '12h' ? (value.getHours() % 12 || 12) : value.getHours()) : 
    displayFormat === '12h' ? 12 : 0
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(value ? value.getMinutes() : 0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(
    value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM'
  );
  
  // Dropdown positioning
  const [dropdownPosition, setDropdownPosition] = useState({ 
    top: 0, 
    left: 0,
    translateX: 0,
    translateY: 0
  });
  
  // Generated options
  const hoursOptions = generateHoursOptions(
    displayFormat, 
    minTime, 
    maxTime,
    disablePast,
    disableFuture,
    referenceDate
  );
  
  const minutesOptions = generateMinuteOptions(
    minuteStep, 
    selectedHour, 
    selectedPeriod, 
    minTime, 
    maxTime,
    disablePast,
    disableFuture,
    referenceDate
  );
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchedRef = useRef<boolean>(false);
  
  // Generate unique ID for accessibility
  const uniqueId = useRef(`timepicker-${Math.random().toString(36).substring(2, 11)}`);
  const inputId = id || uniqueId.current;
  const dropdownId = `${inputId}-dropdown`;
  
  // Effect hooks
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(formatTime(value, displayFormat));
      setSelectedHour(displayFormat === '12h' ? (value.getHours() % 12 || 12) : value.getHours());
      setSelectedMinute(value.getMinutes());
      setSelectedPeriod(value.getHours() >= 12 ? 'PM' : 'AM');
    } else {
      setInputValue('');
    }
  }, [value, displayFormat]);
  
  // Update minutes options when hour or period changes
  useEffect(() => {
    // No need to do anything, as minutesOptions are calculated on the fly
  }, [selectedHour, selectedPeriod, minTime, maxTime]);
  
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
    if (isOpen && inputRef.current) {
      const updatePosition = () => {
        if (!inputRef.current) return;
        
        const inputRect = inputRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        
        // Check if opening the dropdown below would push it off-screen
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 260; // Approximate height of dropdown
        const spaceBelow = viewportHeight - inputRect.bottom;
        
        // Calculate transform values instead of absolute positioning
        // If there's not enough space below, position it above the input
        const translateY = spaceBelow < dropdownHeight && inputRect.top > dropdownHeight
          ? -(dropdownHeight + 4) // Position above with a small gap
          : inputRect.height + 4; // Position below with a small gap
          
        setDropdownPosition({
          top: inputRect.top + scrollY,
          left: inputRect.left + scrollX,
          translateX: 0,
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
  
  const handleHourSelect = (hour: number) => {
    // When hour is selected, find the first available minute if current minute is disabled
    let minute = selectedMinute;
    const hourInFormat = hour;
    
    // Check if the currently selected minute is valid with the new hour
    let hour24 = hourInFormat;
    if (displayFormat === '12h') {
      if (selectedPeriod === 'PM' && hourInFormat !== 12) hour24 += 12;
      if (selectedPeriod === 'AM' && hourInFormat === 12) hour24 = 0;
    }
    
    if (isTimeDisabled(hour24, minute, minTime, maxTime, disablePast, disableFuture, referenceDate)) {
      minute = findFirstEnabledMinute(hourInFormat, selectedPeriod, minuteStep, minTime, maxTime, disablePast, disableFuture, referenceDate);
    }
    
    // Update state with new values synchronously
    setSelectedHour(hour);
    
    // Only update minute if it changed
    if (minute !== selectedMinute) {
      setSelectedMinute(minute);
    }
    
    // Use a single nested setState to ensure all state is updated before creating the date
    const date = new Date();
    date.setHours(
      displayFormat === '12h' 
        ? (selectedPeriod === 'PM' && hour !== 12 ? hour + 12 : (selectedPeriod === 'AM' && hour === 12 ? 0 : hour)) 
        : hour,
      minute, 
      0, 
      0
    );
    
    // Update input value and call onChange
    setInputValue(formatTime(date, displayFormat));
    if (onChange) onChange(date);
    touchedRef.current = true;
    
    if (closeOnSelect) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };
  
  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    
    // Create the date object directly with the most current state values
    const date = new Date();
    let hours = selectedHour;
    
    // Convert from 12-hour to 24-hour format if needed
    if (displayFormat === '12h') {
      if (selectedPeriod === 'PM' && hours !== 12) hours += 12;
      if (selectedPeriod === 'AM' && hours === 12) hours = 0;
    }
    
    date.setHours(hours, minute, 0, 0);
    
    // Update input value and call onChange
    setInputValue(formatTime(date, displayFormat));
    if (onChange) onChange(date);
    touchedRef.current = true;
    
    if (closeOnSelect) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };
  
  const handlePeriodSelect = (period: 'AM' | 'PM') => {
    // When period changes, check if current hour/minute combination is still valid
    const currentHour = selectedHour;
    let hour24 = currentHour;
    
    if (period === 'PM' && currentHour !== 12) hour24 += 12;
    if (period === 'AM' && currentHour === 12) hour24 = 0;
    
    let minute = selectedMinute;
    if (isTimeDisabled(hour24, minute, minTime, maxTime, disablePast, disableFuture, referenceDate)) {
      minute = findFirstEnabledMinute(currentHour, period, minuteStep, minTime, maxTime, disablePast, disableFuture, referenceDate);
      setSelectedMinute(minute);
    }
    
    setSelectedPeriod(period);
    
    // Use setTimeout to ensure state updates are reflected
    setTimeout(() => {
      const date = new Date();
      date.setHours(hour24, minute, 0, 0);
      
      if (onChange) onChange(date);
      setInputValue(formatTime(date, displayFormat));
      touchedRef.current = true;
      
      if (closeOnSelect) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    }, 0);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    touchedRef.current = true;
    
    if (!newValue) {
      if (onChange) onChange(null);
      return;
    }
    
    const parsedTime = parseTime(newValue, displayFormat);
    if (parsedTime) {
      if (onChange) onChange(parsedTime);
      
      // Update selected values based on parsed time
      setSelectedHour(displayFormat === '12h' ? (parsedTime.getHours() % 12 || 12) : parsedTime.getHours());
      setSelectedMinute(parsedTime.getMinutes());
      setSelectedPeriod(parsedTime.getHours() >= 12 ? 'PM' : 'AM');
    }
  };
  
  const handleClear = () => {
    if (inputValue === '') return;
    
    setInputValue('');
    setSelectedHour(displayFormat === '12h' ? 12 : 0);
    setSelectedMinute(0);
    setSelectedPeriod('AM');
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
  
  // Dropdown classes from Select
  const dropdownClasses = [
    'fixed z-50 rounded-md shadow-lg p-3 mt-1 max-h-60',
    'border divide-y divide-[var(--btn-secondary-border)]',
    'bg-[var(--background)]',
    'border-[var(--btn-primary-ring)]',
  ].join(' ');
  
  // Time dropdown rendering
  const dropdown = isOpen && mounted ? (
    <div 
      ref={dropdownRef}
      id={dropdownId}
      className={dropdownClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={inputId}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        transform: `translate(${dropdownPosition.translateX}px, ${dropdownPosition.translateY}px)`,
        width: inputRef.current ? `${inputRef.current.offsetWidth}px` : 'auto',
      }}
    >
      <TimeList
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        selectedPeriod={selectedPeriod}
        hourOptions={hoursOptions}
        minuteOptions={minutesOptions}
        displayFormat={displayFormat}
        onHourSelect={handleHourSelect}
        onMinuteSelect={handleMinuteSelect}
        onPeriodSelect={handlePeriodSelect}
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        {clearable && inputValue && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-7 flex items-center text-[var(--btn-secondary-text)] hover:text-[var(--foreground)]"
            onClick={handleClear}
            aria-label="Clear time"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {mounted && isOpen && createPortal(dropdown, document.body)}
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