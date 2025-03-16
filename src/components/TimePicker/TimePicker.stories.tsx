import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TimePicker from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'date' },
    onChange: { action: 'changed' },
    displayFormat: {
      control: 'radio',
      options: ['12h', '24h'],
    },
    size: {
      control: 'radio',
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
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// Basic TimePicker
export const Default: Story = {
  args: {
    label: 'Select Time',
    placeholder: 'Select time',
  },
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

// Different Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <TimePicker size="small" label="Small Size" />
      <TimePicker size="medium" label="Medium Size" />
      <TimePicker size="large" label="Large Size" />
    </div>
  ),
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

// Full Width
export const FullWidth: Story = {
  args: {
    label: 'Full Width TimePicker',
    fullWidth: true,
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