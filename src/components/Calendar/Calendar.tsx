import React, { useState, useEffect } from 'react';

export interface CalendarProps {
  /**
   * The selected date value
   */
  value?: Date | null;
  
  /**
   * Callback for when the date changes
   */
  onChange?: (date: Date | null) => void;
  
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
   * Whether to close the calendar when a date is selected
   * @default false
   */
  closeOnSelect?: boolean;
  
  /**
   * Initial month to display when no date is selected
   * @default current month
   */
  initialMonth?: Date;
  
  /**
   * Locale for the calendar
   * @default "en-US"
   */
  locale?: string;
  
  /**
   * Callback for when a date is selected
   */
  onDateSelect?: (date: Date) => void;
  
  /**
   * Callback for when the close action is triggered
   */
  onClose?: () => void;
  
  /**
   * Additional className for the calendar container
   */
  className?: string;
}

// Helper function to check if a date is disabled
const isDateDisabledHelper = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  customIsDateDisabled?: (date: Date) => boolean
): boolean => {
  // Check custom function first if provided
  if (customIsDateDisabled && customIsDateDisabled(date)) return true;
  
  // Check if date is within min and max bounds
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  
  // Check if date is in disabled dates array
  if (disabledDates && disabledDates.length > 0) {
    return disabledDates.some(disabledDate => 
      disabledDate.getFullYear() === date.getFullYear() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getDate() === date.getDate()
    );
  }
  
  return false;
};

// Generate calendar days for a given month
const generateCalendarDays = (
  currentMonth: Date,
  locale: string,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  customIsDateDisabled?: (date: Date) => boolean
): Array<{ date: Date; disabled: boolean; isCurrentMonth: boolean }> => {
  const result = [];
  
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  
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
      disabled: isDateDisabledHelper(date, minDate, maxDate, disabledDates, customIsDateDisabled),
      isCurrentMonth: false
    });
  }
  
  // Add days for current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    result.push({
      date,
      disabled: isDateDisabledHelper(date, minDate, maxDate, disabledDates, customIsDateDisabled),
      isCurrentMonth: true
    });
  }
  
  // Add days for next month to complete the calendar
  const remainingDays = 42 - result.length; // 6 rows of 7 days each
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    result.push({
      date,
      disabled: isDateDisabledHelper(date, minDate, maxDate, disabledDates, customIsDateDisabled),
      isCurrentMonth: false
    });
  }
  
  return result;
};

// Calendar Component
const Calendar: React.FC<CalendarProps> = ({
  value = null,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  isDateDisabled,
  closeOnSelect = false,
  initialMonth,
  locale = "en-US",
  onDateSelect,
  onClose,
  className = '',
}) => {
  // State for view mode
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  
  // State for current month and calendar days
  const [currentMonth, setCurrentMonth] = useState<Date>(() => value || initialMonth || new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; disabled: boolean; isCurrentMonth: boolean }>>([]);
  
  // Generate years for the year selector (10 years before and after current year)
  const generateYearRange = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = currentYear - 10;
    const years = [];
    
    for (let i = 0; i < 21; i++) {
      years.push(startYear + i);
    }
    
    return years;
  };
  
  // Generate months for the month selector
  const generateMonths = () => {
    const months = [];
    const currentYear = currentMonth.getFullYear();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      months.push({
        index: i,
        name: date.toLocaleDateString(locale, { month: 'short' })
      });
    }
    
    return months;
  };
  
  const years = generateYearRange();
  const months = generateMonths();
  
  // Update calendar days when currentMonth changes
  useEffect(() => {
    setCalendarDays(generateCalendarDays(
      currentMonth,
      locale,
      minDate,
      maxDate,
      disabledDates,
      isDateDisabled
    ));
  }, [currentMonth]);
  
  // Handlers for navigation
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
  
  // Handler for selecting a month
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setViewMode('days');
  };
  
  // Handler for selecting a year
  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setViewMode('months');
  };
  
  // Handler for month header click to switch to months view
  const handleMonthHeaderClick = () => {
    setViewMode(viewMode === 'days' ? 'months' : 'days');
  };
  
  // Handler for year header click to switch to years view
  const handleYearHeaderClick = () => {
    setViewMode(viewMode === 'months' ? 'years' : 'months');
  };
  
  // Handler for date selection
  const handleDateSelect = (date: Date) => {
    if (isDateDisabledHelper(date, minDate, maxDate, disabledDates, isDateDisabled)) return;
    
    if (onChange) onChange(date);
    if (onDateSelect) onDateSelect(date);
    
    if (closeOnSelect && onClose) {
      onClose();
    }
  };
  
  // Get weekday names
  const dayNames = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(2023, 0, i + 1); // Jan 1, 2023 is a Sunday
    return day.toLocaleDateString(locale, { weekday: 'short' });
  });
  
  // Calendar button classes
  const calendarButtonClasses = [
    'p-1 rounded-full hover:bg-[var(--btn-secondary-hover)]',
    'text-[var(--btn-secondary-text)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--btn-primary-ring)]',
  ].join(' ');
  
  // Calendar header classes
  const calendarHeaderClasses = [
    'text-sm font-medium',
    'cursor-pointer',
    'hover:text-[var(--btn-primary-text)]',
  ].join(' ');
  
  // Month/Year grid item class
  const gridItemClasses = (isActive: boolean) => [
    'flex items-center justify-center rounded-md p-2 text-sm',
    'transition-colors duration-150',
    isActive
      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
      : 'hover:bg-[var(--btn-secondary-hover)] text-[var(--btn-secondary-text)]',
    'cursor-pointer',
  ].join(' ');
  
  // Calendar day classes
  const getCalendarDayClasses = (day: { date: Date; disabled: boolean; isCurrentMonth: boolean }, isSelected: boolean, isToday: boolean) => {
    return [
      'flex items-center justify-center p-1 sm:p-2 rounded-full text-xs sm:text-sm',
      'transition-colors duration-150',
      day.isCurrentMonth 
        ? 'text-[var(--foreground)]' 
        : 'text-[var(--btn-secondary-text)] opacity-70',
      day.disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:bg-[var(--btn-secondary-hover)] cursor-pointer',
      isSelected 
        ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)]' 
        : '',
      isToday && !isSelected 
        ? 'border border-[var(--btn-primary-ring)]' 
        : ''
    ].filter(Boolean).join(' ');
  };
  
  // Main calendar class
  const calendarClasses = [
    'bg-[var(--background)] p-3 rounded-md',
    'border border-[var(--btn-secondary-border)]',
    className
  ].join(' ');

  return (
    <div className={calendarClasses}>
      <div className="flex flex-col">
        {/* Calendar header with navigation */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-1">
            <button 
              type="button"
              className={calendarButtonClasses}
              onClick={viewMode === 'years' ? () => handleYearSelect(years[0] - 21) : handlePrevYear}
              aria-label={viewMode === 'years' ? "Previous year range" : "Previous year"}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            
            {viewMode === 'days' && (
              <button 
                type="button"
                className={calendarButtonClasses}
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <span 
              className={calendarHeaderClasses}
              onClick={handleYearHeaderClick}
            >
              {currentMonth.getFullYear()}
            </span>
            
            {viewMode === 'days' && (
              <span 
                className={calendarHeaderClasses}
                onClick={handleMonthHeaderClick}
              >
                {currentMonth.toLocaleDateString(locale, { month: 'long' })}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {viewMode === 'days' && (
              <button 
                type="button"
                className={calendarButtonClasses}
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            <button 
              type="button"
              className={calendarButtonClasses}
              onClick={viewMode === 'years' ? () => handleYearSelect(years[years.length - 1] + 1) : handleNextYear}
              aria-label={viewMode === 'years' ? "Next year range" : "Next year"}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Year selector */}
        {viewMode === 'years' && (
          <div className="grid grid-cols-4 gap-1">
            {years.map(year => (
              <div
                key={`year-${year}`}
                className={gridItemClasses(currentMonth.getFullYear() === year)}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}
        
        {/* Month selector */}
        {viewMode === 'months' && (
          <div className="grid grid-cols-3 gap-2">
            {months.map(month => (
              <div
                key={`month-${month.index}`}
                className={gridItemClasses(currentMonth.getMonth() === month.index)}
                onClick={() => handleMonthSelect(month.index)}
              >
                {month.name}
              </div>
            ))}
          </div>
        )}

        {/* Days view */}
        {viewMode === 'days' && (
          <>
            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((day, index) => (
                <div 
                  key={`header-${index}`} 
                  className="text-xs font-medium text-center text-[var(--btn-secondary-text)] py-1"
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
                    className={getCalendarDayClasses(day, isSelected || false, isToday)}
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
            
            {/* Today button */}
            <div className="mt-3">
              <button
                type="button"
                className="w-full text-center py-1 text-sm bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] rounded-md text-[var(--btn-secondary-text)]"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  if (!isDateDisabledHelper(today, minDate, maxDate, disabledDates, isDateDisabled)) {
                    handleDateSelect(today);
                  }
                }}
              >
                Today
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar; 