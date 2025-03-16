/**
 * Time utility functions for time-related components like TimePicker and TimeList
 */

// Type for time constraints
export interface TimeConstraints {
  // Minimum selectable time
  minTime?: Date;
  
  // Maximum selectable time
  maxTime?: Date;
  
  // Specific disabled hours (0-23)
  disabledHours?: number[];
  
  // Specific disabled minutes (0-59)
  disabledMinutes?: number[];
  
  // Disabled hour-minute combinations
  // Format: ["13:30", "14:45"] for 1:30 PM and 2:45 PM
  disabledTimes?: string[];
  
  // Custom function to determine if a time should be disabled
  isTimeDisabled?: (hours: number, minutes: number) => boolean;
  
  // Option to disable specific times on specific days of the week
  // Sunday = 0, Monday = 1, etc.
  dayOfWeekRestrictions?: Array<{
    dayOfWeek: number;
    minTime?: Date;
    maxTime?: Date;
    disabledHours?: number[];
    disabledMinutes?: number[];
  }>;
  
  // Disable all past times (before current time)
  disablePast?: boolean;
  
  // Disable all future times (after current time)
  disableFuture?: boolean;
  
  // Custom reference date for disablePast/disableFuture
  // If not provided, the current date/time will be used
  referenceDate?: Date;
}

/**
 * Determines if a specific time should be disabled based on various constraints
 * 
 * @param hours Hours in 24-hour format (0-23)
 * @param minutes Minutes (0-59)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns Whether the specified time should be disabled
 */
export const isTimeDisabled = (
  hours: number,
  minutes: number,
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): boolean => {
  const { 
    minTime, 
    maxTime, 
    disabledHours, 
    disabledMinutes, 
    disabledTimes,
    isTimeDisabled: customIsTimeDisabled,
    dayOfWeekRestrictions,
    disablePast,
    disableFuture,
    referenceDate
  } = constraints;
  
  // Check custom disabling function first
  if (customIsTimeDisabled && customIsTimeDisabled(hours, minutes)) {
    return true;
  }
  
  // Check if the hour is in the disabled hours list
  if (disabledHours && disabledHours.includes(hours)) {
    return true;
  }
  
  // Check if the minute is in the disabled minutes list
  if (disabledMinutes && disabledMinutes.includes(minutes)) {
    return true;
  }
  
  // Check if the specific time combination is in the disabled times list
  if (disabledTimes) {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    if (disabledTimes.includes(timeString)) {
      return true;
    }
  }
  
  // Create a date object for comparison (only time part matters)
  const timeValue = new Date();
  timeValue.setHours(hours, minutes, 0, 0);
  
  // Check day of week restrictions if provided
  if (dayOfWeek !== undefined && dayOfWeekRestrictions && dayOfWeekRestrictions.length > 0) {
    const restriction = dayOfWeekRestrictions.find(r => r.dayOfWeek === dayOfWeek);
    
    if (restriction) {
      // Check day-specific disabled hours
      if (restriction.disabledHours && restriction.disabledHours.includes(hours)) {
        return true;
      }
      
      // Check day-specific disabled minutes
      if (restriction.disabledMinutes && restriction.disabledMinutes.includes(minutes)) {
        return true;
      }
      
      // Check day-specific min time
      if (restriction.minTime) {
        const dayMinTime = new Date();
        dayMinTime.setHours(
          restriction.minTime.getHours(),
          restriction.minTime.getMinutes(),
          0,
          0
        );
        
        if (timeValue < dayMinTime) {
          return true;
        }
      }
      
      // Check day-specific max time
      if (restriction.maxTime) {
        const dayMaxTime = new Date();
        dayMaxTime.setHours(
          restriction.maxTime.getHours(),
          restriction.maxTime.getMinutes(),
          0,
          0
        );
        
        if (timeValue > dayMaxTime) {
          return true;
        }
      }
    }
  }
  
  // Check global min time
  if (minTime) {
    const minTimeValue = new Date();
    minTimeValue.setHours(minTime.getHours(), minTime.getMinutes(), 0, 0);
    if (timeValue < minTimeValue) {
      return true;
    }
  }
  
  // Check global max time
  if (maxTime) {
    const maxTimeValue = new Date();
    maxTimeValue.setHours(maxTime.getHours(), maxTime.getMinutes(), 0, 0);
    if (timeValue > maxTimeValue) {
      return true;
    }
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

/**
 * Determines if an hour should be disabled in the TimeList
 * For 12-hour format, checks both AM and PM variants
 * 
 * @param hour Hour value (1-12 for 12h format, 0-23 for 24h format)
 * @param format Time format (12h or 24h)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns Whether the hour should be disabled
 */
export const isHourDisabled = (
  hour: number,
  format: '12h' | '24h',
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): boolean => {
  // For 12-hour format, check both AM and PM possibilities
  if (format === '12h') {
    // Check AM version (0 for 12 AM, else hour value)
    const amHour = hour === 12 ? 0 : hour;
    const amDisabled = isTimeDisabled(amHour, 0, constraints, dayOfWeek) && 
                       isTimeDisabled(amHour, 30, constraints, dayOfWeek) && 
                       isTimeDisabled(amHour, 59, constraints, dayOfWeek);
    
    // Check PM version (12 for 12 PM, else hour + 12)
    const pmHour = hour === 12 ? 12 : hour + 12;
    const pmDisabled = isTimeDisabled(pmHour, 0, constraints, dayOfWeek) && 
                       isTimeDisabled(pmHour, 30, constraints, dayOfWeek) && 
                       isTimeDisabled(pmHour, 59, constraints, dayOfWeek);
    
    // Only disable if both AM and PM versions are disabled
    return amDisabled && pmDisabled;
  } else {
    // For 24-hour format, check if all minutes in this hour are disabled
    return isTimeDisabled(hour, 0, constraints, dayOfWeek) && 
           isTimeDisabled(hour, 30, constraints, dayOfWeek) && 
           isTimeDisabled(hour, 59, constraints, dayOfWeek);
  }
};

/**
 * Determines if a minute should be disabled within a specific hour
 * 
 * @param minute Minute value (0-59)
 * @param hour Hour in 12-hour format (1-12) or 24-hour format (0-23)
 * @param period AM/PM period (only for 12h format)
 * @param format Time format (12h or 24h)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns Whether the minute should be disabled
 */
export const isMinuteDisabled = (
  minute: number,
  hour: number,
  period: 'AM' | 'PM' = 'AM',
  format: '12h' | '24h' = '12h',
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): boolean => {
  // Convert to 24-hour format for calculations
  let hour24 = hour;
  if (format === '12h') {
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
  }
  
  return isTimeDisabled(hour24, minute, constraints, dayOfWeek);
};

/**
 * Find the first enabled minute for a given hour
 * 
 * @param hour Hour in 12-hour format (1-12) or 24-hour format (0-23) 
 * @param period AM/PM period (only for 12h format)
 * @param minuteStep Step interval for minutes (default: 5)
 * @param format Time format (12h or 24h)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns The first enabled minute or 0 if none found
 */
export const findFirstEnabledMinute = (
  hour: number,
  period: 'AM' | 'PM' = 'AM',
  minuteStep: number = 5,
  format: '12h' | '24h' = '12h',
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): number => {
  // Convert to 24-hour format for calculations
  let hour24 = hour;
  if (format === '12h') {
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
  }
  
  for (let minute = 0; minute < 60; minute += minuteStep) {
    if (!isTimeDisabled(hour24, minute, constraints, dayOfWeek)) {
      return minute;
    }
  }
  
  // If no enabled minute found, return 0 as default
  return 0;
};

/**
 * Generate options for hours based on format and constraints
 * 
 * @param format Time format (12h or 24h)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns Array of hour options with values, labels and disabled states
 */
export const generateHourOptions = (
  format: '12h' | '24h',
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): Array<{ value: number; label: string; disabled: boolean }> => {
  const result: Array<{ value: number; label: string; disabled: boolean }> = [];
  const maxHours = format === '12h' ? 12 : 23;
  const minHours = format === '12h' ? 1 : 0;
  
  for (let hour = minHours; hour <= maxHours; hour++) {
    result.push({
      value: hour,
      label: hour.toString().padStart(2, '0'),
      disabled: isHourDisabled(hour, format, constraints, dayOfWeek)
    });
  }
  
  return result;
};

/**
 * Generate options for minutes based on constraints
 * 
 * @param step Step interval for minutes (default: 5)
 * @param hour Hour in 12-hour format (1-12) or 24-hour format (0-23)
 * @param period AM/PM period (only for 12h format)
 * @param format Time format (12h or 24h)
 * @param constraints Time constraints for validation
 * @param dayOfWeek Optional day of the week (0-6, Sunday = 0)
 * @returns Array of minute options with values, labels and disabled states
 */
export const generateMinuteOptions = (
  step: number = 5,
  hour: number,
  period: 'AM' | 'PM' = 'AM',
  format: '12h' | '24h' = '12h',
  constraints: TimeConstraints = {},
  dayOfWeek?: number
): Array<{ value: number; label: string; disabled: boolean }> => {
  const result: Array<{ value: number; label: string; disabled: boolean }> = [];
  
  for (let minute = 0; minute < 60; minute += step) {
    result.push({
      value: minute,
      label: minute.toString().padStart(2, '0'),
      disabled: isMinuteDisabled(minute, hour, period, format, constraints, dayOfWeek)
    });
  }
  
  return result;
};

/**
 * Create business hours time constraints
 * Default: Monday-Friday 9:00 AM - 5:00 PM, closed on weekends
 * 
 * @param openingHour Opening hour (default: 9)
 * @param openingMinute Opening minute (default: 0)
 * @param closingHour Closing hour (default: 17)
 * @param closingMinute Closing minute (default: 0)
 * @param workDays Array of working days (default: [1,2,3,4,5] for Mon-Fri)
 * @returns Time constraints object for business hours
 */
export const createBusinessHoursConstraints = (
  openingHour: number = 9,
  openingMinute: number = 0,
  closingHour: number = 17,
  closingMinute: number = 0,
  workDays: number[] = [1, 2, 3, 4, 5] // Monday to Friday
): TimeConstraints => {
  const constraints: TimeConstraints = {
    dayOfWeekRestrictions: []
  };
  
  // Add business hours for each working day
  workDays.forEach(day => {
    const minTime = new Date();
    minTime.setHours(openingHour, openingMinute, 0, 0);
    
    const maxTime = new Date();
    maxTime.setHours(closingHour, closingMinute, 0, 0);
    
    constraints.dayOfWeekRestrictions!.push({
      dayOfWeek: day,
      minTime,
      maxTime
    });
  });
  
  // Create a custom function to disable times outside working days
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constraints.isTimeDisabled = (_hours: number, _minutes: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // If not a working day, disable all times
    if (!workDays.includes(dayOfWeek)) {
      return true;
    }
    
    return false;
  };
  
  return constraints;
};

/**
 * Creates time constraints that disable all past times (before the current time)
 * 
 * @param referenceDate Optional reference date (defaults to current date/time)
 * @returns Time constraints object that disables past times
 */
export const createDisablePastConstraints = (
  referenceDate?: Date
): TimeConstraints => {
  return {
    disablePast: true,
    referenceDate
  };
};

/**
 * Creates time constraints that disable all future times (after the current time)
 * 
 * @param referenceDate Optional reference date (defaults to current date/time)
 * @returns Time constraints object that disables future times
 */
export const createDisableFutureConstraints = (
  referenceDate?: Date
): TimeConstraints => {
  return {
    disableFuture: true,
    referenceDate
  };
}; 