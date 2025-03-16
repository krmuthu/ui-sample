import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TimePicker from './TimePicker';

/**
 * TimePicker component allows users to select a time value.
 * It provides a user-friendly interface for time selection with various customization options.
 */
export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'date' },
    onChange: { action: 'changed' },
    displayFormat: {
      control: { type: 'radio' },
      options: ['12h', '24h'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    minuteStep: {
      control: 'number',
      min: 1,
      max: 60,
      step: 1,
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    clearable: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
    disablePast: { control: 'boolean' },
    disableFuture: { control: 'boolean' },
    referenceDate: { control: 'date' },
  },
} as Meta<typeof TimePicker>;

type Story = StoryObj<typeof TimePicker>;

/**
 * Default time picker with 12-hour format
 */
export const Default: Story = {
  args: {
    label: 'Select Time',
    placeholder: 'Select time',
  },
};

/**
 * Time picker with 24-hour format
 */
export const Format24h: Story = {
  args: {
    label: 'Select Time (24h format)',
    displayFormat: '24h',
  },
};

/**
 * Time picker with pre-selected time value
 */
export const WithValue: Story = {
  args: {
    label: 'Meeting Time',
    value: new Date(2023, 0, 1, 14, 30), // 2:30 PM
  },
};

/**
 * Time picker with minute stepping of 15 minutes
 */
export const MinuteStepping: Story = {
  args: {
    label: 'Select Time',
    minuteStep: 15,
  },
};

/**
 * Time picker with time constraints (9 AM - 5 PM)
 */
export const WithTimeConstraints: Story = {
  args: {
    label: 'Business Hours',
    minTime: new Date(2023, 0, 1, 9, 0), // 9:00 AM
    maxTime: new Date(2023, 0, 1, 17, 0), // 5:00 PM
    helperText: 'Select time between 9:00 AM and 5:00 PM',
  },
};

/**
 * Time picker with error state
 */
export const WithError: Story = {
  args: {
    label: 'Select Time',
    error: true,
    errorMessage: 'Please select a valid time',
  },
};

/**
 * Disabled time picker
 */
export const Disabled: Story = {
  args: {
    label: 'Select Time',
    disabled: true,
  },
};

/**
 * Time picker with custom icon
 */
export const WithIcon: Story = {
  args: {
    label: 'Select Time',
    startIcon: (
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
};

/**
 * Time picker with full width
 */
export const FullWidth: Story = {
  args: {
    label: 'Select Time',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Time picker with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <TimePicker label="Small" size="small" />
      <TimePicker label="Medium" size="medium" />
      <TimePicker label="Large" size="large" />
    </div>
  ),
};

/**
 * Time picker with different variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <TimePicker label="Primary" variant="primary" />
      <TimePicker label="Secondary" variant="secondary" />
      <TimePicker label="Tertiary" variant="tertiary" />
    </div>
  ),
};

/**
 * Time picker that disables past times (times before the current time)
 */
export const DisablePast: Story = {
  args: {
    label: 'Disable Past Times',
    disablePast: true,
    helperText: 'Only future times can be selected',
  },
};

/**
 * Time picker that disables future times (times after the current time)
 */
export const DisableFuture: Story = {
  args: {
    label: 'Disable Future Times',
    disableFuture: true,
    helperText: 'Only past times can be selected',
  },
};

/**
 * Time picker with a reference date for testing disablePast/disableFuture
 */
export const WithReferenceDate: Story = {
  args: {
    label: 'Custom Reference Time',
    disablePast: true,
    referenceDate: new Date(2023, 0, 1, 12, 0), // 12:00 PM on Jan 1, 2023
    helperText: 'Times before 12:00 PM are disabled (reference date: Jan 1, 2023 12:00 PM)',
  },
};

/**
 * Appointment scheduling example
 */
export const AppointmentScheduler: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Schedule an Appointment</h3>
      <p style={{ marginBottom: '16px', fontSize: '14px' }}>
        Select a time for your appointment. Only available slots are shown.
      </p>
      <TimePicker 
        label="Appointment Time" 
        disablePast={true}
        minTime={new Date(2023, 0, 1, 9, 0)} // 9:00 AM
        maxTime={new Date(2023, 0, 1, 17, 0)} // 5:00 PM
        minuteStep={30}
        fullWidth
        helperText="Business hours: 9:00 AM - 5:00 PM, 30-minute slots"
      />
      <div style={{ marginTop: '16px' }}>
        <button 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: 'var(--btn-primary-bg)', 
            color: 'var(--btn-primary-text)', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  ),
};

// Controlled TimePicker Example
const ControlledTimePicker = () => {
  const [time, setTime] = useState<Date | null>(new Date());
  
  return (
    <div className="w-64">
      <TimePicker
        label="Controlled Time"
        value={time}
        onChange={setTime}
        helperText={time ? `Selected time: ${time.toLocaleTimeString()}` : 'No time selected'}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTimePicker />,
};

// Different States
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <TimePicker label="Default State" />
      <TimePicker 
        label="Error State" 
        error={true} 
        errorMessage="Invalid time"
      />
      <TimePicker 
        label="Disabled State" 
        disabled={true} 
        value={new Date()}
      />
      <TimePicker label="Required Time" required />
      <TimePicker 
        label="With Helper Text" 
        helperText="Select your preferred time"
      />
    </div>
  ),
};

// Time Format
export const TimeFormats: Story = {
  render: () => {
    const currentTime = new Date();
    
    return (
      <div className="space-y-4">
        <TimePicker 
          label="12-hour format (AM/PM)" 
          displayFormat="12h"
          value={currentTime}
          helperText="Shows separate AM/PM selector"
        />
        <TimePicker 
          label="24-hour format" 
          displayFormat="24h"
          value={currentTime}
          helperText="No AM/PM selector needed"
        />
      </div>
    );
  },
};

// Minute Step Intervals
export const MinuteStepIntervals: Story = {
  render: () => (
    <div className="space-y-4">
      <TimePicker 
        label="5-minute intervals (default)" 
        minuteStep={1}
      />
      <TimePicker 
        label="15-minute intervals" 
        minuteStep={15}
      />
      <TimePicker 
        label="30-minute intervals" 
        minuteStep={30}
      />
      <TimePicker 
        label="60-minute intervals (hourly)" 
        minuteStep={60}
      />
    </div>
  ),
};

// Min/Max Time Restrictions
export const TimeRestrictions: Story = {
  render: () => {
    const now = new Date();
    const minTime = new Date(now);
    minTime.setHours(9, 0, 0, 0); // 9:00 AM
    
    const maxTime = new Date(now);
    maxTime.setHours(17, 0, 0, 0); // 5:00 PM
    
    return (
      <div className="space-y-4">
        <TimePicker 
          label="Business Hours Only" 
          minTime={minTime}
          maxTime={maxTime}
          helperText="Select a time between 9:00 AM and 5:00 PM"
        />
      </div>
    );
  },
};

// Time Range Example
export const TimeRange: Story = {
  render: () => {
    const [startTime, setStartTime] = useState<Date | null>(
      (() => {
        const date = new Date();
        date.setHours(9, 0, 0, 0);
        return date;
      })()
    );
    
    const [endTime, setEndTime] = useState<Date | null>(
      (() => {
        const date = new Date();
        date.setHours(17, 0, 0, 0);
        return date;
      })()
    );
    
    // Check if end time is before start time
    const hasError = !!(startTime && endTime && endTime < startTime);
    
    return (
      <div className="space-y-4 w-64">
        <TimePicker 
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
        />
        
        <TimePicker 
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          error={hasError}
          errorMessage={hasError ? "End time must be after start time" : undefined}
        />
      </div>
    );
  },
};

// With Start Icon
export const WithStartIcon: Story = {
  args: {
    label: 'With Start Icon',
    startIcon: (
      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

// Error States
export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Basic Error States</h3>
        <div className="space-y-4">
          <TimePicker 
            label="Invalid Time" 
            error={true}
            errorMessage="Please select a valid time"
          />
          <TimePicker 
            label="Required Time" 
            required
            error={true}
            errorMessage="Time is required"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Error States with Different Sizes</h3>
        <div className="space-y-4">
          <TimePicker 
            label="Small Size Error" 
            size="small"
            error={true}
            errorMessage="Invalid time"
          />
          <TimePicker 
            label="Medium Size Error" 
            size="medium"
            error={true}
            errorMessage="Invalid time"
          />
          <TimePicker 
            label="Large Size Error" 
            size="large"
            error={true}
            errorMessage="Invalid time"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Time Range Error</h3>
        <div className="space-y-4">
          <TimePicker 
            label="Start Time" 
            value={new Date(new Date().setHours(16, 0, 0, 0))}
          />
          <TimePicker 
            label="End Time" 
            value={new Date(new Date().setHours(14, 0, 0, 0))}
            error={true}
            errorMessage="End time must be after start time"
          />
        </div>
      </div>
    </div>
  ),
}; 