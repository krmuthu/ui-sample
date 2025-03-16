import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import TimeList, { TimeOption } from '../components/TimeList/TimeList';
import {
  TimeConstraints,
  createBusinessHoursConstraints,
  createDisablePastConstraints,
  createDisableFutureConstraints,
  generateHourOptions,
  generateMinuteOptions
} from './timeUtils';

export default {
  title: 'Utils/Time Utilities',
  parameters: {
    layout: 'centered',
  },
} as Meta;

/**
 * A demo component that adapts our utility functions to work with TimeList
 */
const TimeDemo: React.FC<{
  title: string;
  description?: React.ReactNode;
  constraints: TimeConstraints;
  format?: '12h' | '24h';
  minuteStep?: number;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: 'AM' | 'PM';
}> = ({
  title,
  description,
  constraints,
  format = '24h',
  minuteStep = 15,
  initialHour = 10,
  initialMinute = 0,
  initialPeriod = 'AM'
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(initialHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initialPeriod);
  
  // Get current day of week
  const today = new Date().getDay();
  
  // Generate hour options
  const hourOptions: TimeOption[] = generateHourOptions(format, constraints, today)
    .map(option => ({
      value: option.value,
      label: option.label,
      disabled: option.disabled
    }));
  
  // Generate minute options for the selected hour
  const minuteOptions: TimeOption[] = generateMinuteOptions(
    minuteStep,
    selectedHour,
    selectedPeriod,
    format,
    constraints,
    today
  ).map(option => ({
    value: option.value,
    label: option.label,
    disabled: option.disabled
  }));
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <h2>{title}</h2>
      {description && <div>{description}</div>}
      
      <TimeList
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        selectedPeriod={selectedPeriod}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        displayFormat={format}
        onHourSelect={setSelectedHour}
        onMinuteSelect={setSelectedMinute}
        onPeriodSelect={setSelectedPeriod}
      />
      
      <div>
        <p>Selected time: {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
          {format === '12h' && ` ${selectedPeriod}`}
        </p>
      </div>
    </div>
  );
};

/**
 * This story demonstrates the basic usage of time constraints
 * with a TimeList component for hour and minute selection.
 */
export const BasicTimeConstraints = () => (
  <TimeDemo
    title="Basic Time Constraints (9 AM - 5 PM)"
    description={<p>Hours outside the 9 AM - 5 PM range are disabled</p>}
    constraints={{
      minTime: new Date(0, 0, 0, 9, 0), // 9:00 AM
      maxTime: new Date(0, 0, 0, 17, 0), // 5:00 PM
    }}
  />
);

/**
 * This story demonstrates using specific disabled hours and minutes
 */
export const SpecificDisabledTimes = () => (
  <TimeDemo
    title="Specific Disabled Times"
    description={
      <>
        <p>• Lunch hours (12-2 PM) are disabled</p>
        <p>• Minutes 15 and 45 are disabled (quarter past/to)</p>
        <p>• Specific meeting times (10:00, 10:30, 16:30) are disabled</p>
      </>
    }
    constraints={{
      disabledHours: [12, 13], // Disable lunch hours (12 PM - 2 PM)
      disabledMinutes: [15, 45], // Disable quarter-past and quarter-to times
      disabledTimes: ['10:00', '10:30', '16:30'] // Disable specific meeting times
    }}
  />
);

/**
 * This story demonstrates business hours constraints
 */
export const BusinessHours = () => {
  // Check if today is a weekend
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;
  
  return (
    <TimeDemo
      title="Business Hours (Mon-Fri, 9 AM - 5 PM)"
      description={
        isWeekend ? 
          <p style={{ color: 'red' }}>Today is a weekend - all times are disabled</p> : 
          <p>Business hours shown for today (9 AM - 5 PM)</p>
      }
      constraints={createBusinessHoursConstraints()}
    />
  );
};

/**
 * This story demonstrates custom time validation - appointment scheduling
 */
export const AppointmentScheduler = () => (
  <TimeDemo
    title="Appointment Scheduler"
    description={
      <>
        <p>• Business hours: 9 AM - 4:30 PM</p>
        <p>• Lunch break: 12 PM - 1:30 PM</p>
        <p>• Appointments are 30 minutes (only :00 and :30 are available)</p>
        <p>• Already booked: 10:00, 11:30, 2:00, 3:30</p>
        <div style={{ marginTop: '10px' }}>
          <button 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Book Appointment
          </button>
        </div>
      </>
    }
    constraints={{
      minTime: new Date(0, 0, 0, 9, 0), // 9:00 AM
      maxTime: new Date(0, 0, 0, 16, 30), // 4:30 PM (last appointment)
      disabledHours: [12, 13], // Lunch break
      disabledTimes: ['10:00', '11:30', '14:00', '15:30'], // Already booked
      isTimeDisabled: (hours, minutes) => {
        // Only allow 30-minute intervals (0 and 30)
        return minutes !== 0 && minutes !== 30;
      }
    }}
    minuteStep={5}
  />
);

/**
 * This story demonstrates disabling past times (before current time)
 */
export const DisablePastTimes = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return (
    <TimeDemo
      title="Disable Past Times"
      description={
        <>
          <p>All times before the current time ({currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}) are disabled</p>
          <p>This is useful for appointment scheduling or event planning where past times are no longer valid</p>
        </>
      }
      constraints={createDisablePastConstraints()}
      format="12h"
    />
  );
};

/**
 * This story demonstrates disabling future times (after current time)
 */
export const DisableFutureTimes = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return (
    <TimeDemo
      title="Disable Future Times"
      description={
        <>
          <p>All times after the current time ({currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}) are disabled</p>
          <p>This is useful for logging past events or recording time entries that cannot be in the future</p>
        </>
      }
      constraints={createDisableFutureConstraints()}
      format="12h"
    />
  );
};

/**
 * This story demonstrates combining time constraints with disablePast
 */
export const CombinedConstraints = () => {
  return (
    <TimeDemo
      title="Combined Constraints (Business Hours + Disable Past)"
      description={
        <>
          <p>This example combines multiple constraints:</p>
          <p>• Business hours (9 AM - 5 PM)</p>
          <p>• Only future times are available (past times disabled)</p>
          <p>• Lunch hour (12-1 PM) is disabled</p>
          <p>This is ideal for scheduling same-day appointments during business hours</p>
        </>
      }
      constraints={{
        minTime: new Date(0, 0, 0, 9, 0), // 9:00 AM
        maxTime: new Date(0, 0, 0, 17, 0), // 5:00 PM
        disabledHours: [12], // Lunch hour
        disablePast: true
      }}
      format="12h"
    />
  );
};

/**
 * This story demonstrates using a custom reference date
 */
export const CustomReferenceDate = () => {
  // Use noon on January 1, 2023 as our reference date
  const referenceDate = new Date(2023, 0, 1, 12, 0, 0);
  
  return (
    <TimeDemo
      title="Custom Reference Date"
      description={
        <>
          <p>Using January 1, 2023 at 12:00 PM as reference date</p>
          <p>• All times before 12:00 PM are disabled</p>
          <p>This is useful for testing or demonstrating time constraints with a fixed reference point</p>
        </>
      }
      constraints={{
        disablePast: true,
        referenceDate
      }}
      format="12h"
      initialHour={12}
      initialMinute={0}
    />
  );
}; 