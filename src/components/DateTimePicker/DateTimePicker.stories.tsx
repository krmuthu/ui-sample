import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DateTimePicker from './DateTimePicker';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'The selected date and time value',
    },
    onChange: {
      action: 'date time changed',
      description: 'Callback for when the date and time changes',
    },
    label: {
      control: 'text',
      description: 'Label for the date time picker',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date time picker is disabled',
    },
    dateDisplayFormat: {
      control: 'text',
      description: 'Format for displaying the date in the input',
    },
    timeDisplayFormat: {
      control: 'radio',
      options: ['12h', '24h'],
      description: 'Format for displaying the time in the input',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Maximum selectable date',
    },
    minTime: {
      control: { type: 'date' },
      description: 'Minimum selectable time',
    },
    maxTime: {
      control: { type: 'date' },
      description: 'Maximum selectable time',
    },
    minuteStep: {
      control: { type: 'number', min: 1, max: 60 },
      description: 'Minute step interval',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to display a clear button',
    },
    error: {
      control: 'boolean',
      description: 'Error state of the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input takes up the full width of its container',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the input',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The visual variant of the date time picker',
    },
    required: {
      control: 'boolean',
      description: 'Whether the date time picker is required',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether to close the dropdown when a date and time is selected',
    },
    locale: {
      control: 'text',
      description: 'Locale for the date picker',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

// Basic date time picker with controls
export const Playground: Story = {
  args: {
    label: 'Select Date and Time',
    placeholder: 'MM/DD/YYYY HH:MM AM/PM',
    dateDisplayFormat: 'MM/dd/yyyy',
    timeDisplayFormat: '12h',
    size: 'medium',
    variant: 'primary',
    clearable: true,
    closeOnSelect: true,
    fullWidth: false,
    required: false,
    disabled: false,
    error: false,
    minuteStep: 5,
    locale: 'en-US',
  },
  render: (args) => {
    const [dateTime, setDateTime] = useState<Date | null>(null);
    
    return (
      <div className="p-6">
        <DateTimePicker
          {...args}
          value={dateTime}
          onChange={(newDateTime) => {
            args.onChange?.(newDateTime);
            setDateTime(newDateTime);
          }}
        />
        
        {dateTime && (
          <div className="mt-4 text-sm">
            <p>Selected value: {dateTime.toString()}</p>
          </div>
        )}
      </div>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <DateTimePicker 
          size="small" 
          label="Small Size"
          helperText="Compact size for tighter UI layouts"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Medium (Default)</h3>
        <DateTimePicker 
          size="medium" 
          label="Medium Size"
          helperText="Standard size for most use cases"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <DateTimePicker 
          size="large" 
          label="Large Size"
          helperText="Larger size for better visibility or touch targets"
        />
      </div>
    </div>
  ),
};

// Visual variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Primary Variant</h3>
        <DateTimePicker 
          variant="primary" 
          label="Primary Variant"
          helperText="Default styling with background"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Secondary Variant</h3>
        <DateTimePicker 
          variant="secondary" 
          label="Secondary Variant"
          helperText="Alternative styling with transparent background"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Tertiary Variant</h3>
        <DateTimePicker 
          variant="tertiary" 
          label="Tertiary Variant"
          helperText="Minimal styling with transparent borders"
        />
      </div>
    </div>
  ),
};

// State variations
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Default</h3>
        <DateTimePicker 
          label="Default State" 
          helperText="Normal state of the component"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">With Value</h3>
        <DateTimePicker 
          label="With Value" 
          value={new Date(2023, 5, 15, 14, 30)} // June 15, 2023, 2:30 PM
          helperText="Component with a predefined value"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Disabled</h3>
        <DateTimePicker 
          label="Disabled State" 
          disabled
          value={new Date(2023, 5, 15, 14, 30)}
          helperText="User cannot interact with this component"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Error State</h3>
        <DateTimePicker 
          label="Error State" 
          error
          errorMessage="Please select a valid date and time"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Required</h3>
        <DateTimePicker 
          label="Required Field" 
          required
          helperText="This field is required"
        />
      </div>
    </div>
  ),
};

// Time formats
export const TimeFormats: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">12-hour format (AM/PM)</h3>
        <DateTimePicker 
          label="12-hour Time Format" 
          timeDisplayFormat="12h"
          value={new Date(2023, 5, 15, 14, 30)} // 2:30 PM
          helperText="Shows time with AM/PM indicator"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">24-hour format</h3>
        <DateTimePicker 
          label="24-hour Time Format" 
          timeDisplayFormat="24h"
          value={new Date(2023, 5, 15, 14, 30)} // 14:30
          helperText="Shows time in 24-hour format (00:00-23:59)"
        />
      </div>
    </div>
  ),
};

// Minute step intervals
export const MinuteStepIntervals: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">5-minute intervals (default)</h3>
        <DateTimePicker 
          label="5-minute Steps" 
          minuteStep={5}
          helperText="Time can be selected in 5-minute increments"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">15-minute intervals</h3>
        <DateTimePicker 
          label="15-minute Steps" 
          minuteStep={15}
          helperText="Time can be selected in 15-minute increments"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">30-minute intervals</h3>
        <DateTimePicker 
          label="30-minute Steps" 
          minuteStep={30}
          helperText="Time can be selected in 30-minute increments"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">1-minute intervals (precise)</h3>
        <DateTimePicker 
          label="1-minute Steps" 
          minuteStep={1}
          helperText="Maximum precision with 1-minute increments"
        />
      </div>
    </div>
  ),
};

// Date and time restrictions
export const Restrictions: Story = {
  render: () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Create business hours restriction (9 AM to 5 PM)
    const minTime = new Date(today);
    minTime.setHours(9, 0, 0, 0);
    
    const maxTime = new Date(today);
    maxTime.setHours(17, 0, 0, 0);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Date Range: Tomorrow to Next Week</h3>
          <DateTimePicker 
            label="Future Dates Only" 
            minDate={tomorrow}
            maxDate={nextWeek}
            helperText={`Dates between ${tomorrow.toLocaleDateString()} and ${nextWeek.toLocaleDateString()}`}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Business Hours Only (9 AM - 5 PM)</h3>
          <DateTimePicker 
            label="Business Hours" 
            minTime={minTime}
            maxTime={maxTime}
            helperText="Only times between 9:00 AM and 5:00 PM can be selected"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Combined Date and Time Restrictions</h3>
          <DateTimePicker 
            label="Future Date & Business Hours" 
            minDate={tomorrow}
            maxDate={nextWeek}
            minTime={minTime}
            maxTime={maxTime}
            helperText="Future dates with business hours only"
          />
        </div>
      </div>
    );
  },
};

// DateTime Range (practical example)
export const DateTimeRange: Story = {
  render: () => {
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [endDateTime, setEndDateTime] = useState<Date | null>(null);
    const [error, setError] = useState({
      start: '',
      end: ''
    });
    
    const handleStartChange = (date: Date | null) => {
      setStartDateTime(date);
      
      // Check if end date is before start date
      if (date && endDateTime && date > endDateTime) {
        setError({
          ...error,
          end: 'End time must be after start time'
        });
      } else {
        setError({
          ...error,
          start: '',
          end: ''
        });
      }
    };
    
    const handleEndChange = (date: Date | null) => {
      setEndDateTime(date);
      
      // Check if end date is before start date
      if (date && startDateTime && date < startDateTime) {
        setError({
          ...error,
          end: 'End time must be after start time'
        });
      } else {
        setError({
          ...error,
          end: ''
        });
      }
    };
    
    return (
      <div className="space-y-6 p-6 border border-gray-200 rounded-md max-w-md">
        <h2 className="text-lg font-medium mb-4">Meeting Scheduler</h2>
        
        <div>
          <DateTimePicker 
            label="Meeting Start" 
            value={startDateTime}
            onChange={handleStartChange}
            helperText={error.start || "When does the meeting start?"}
            error={!!error.start}
            errorMessage={error.start}
            required
          />
        </div>
        
        <div>
          <DateTimePicker 
            label="Meeting End" 
            value={endDateTime}
            onChange={handleEndChange}
            helperText={error.end || "When does the meeting end?"}
            error={!!error.end}
            errorMessage={error.end}
            required
            minDate={startDateTime || undefined}
          />
        </div>
        
        {startDateTime && endDateTime && !error.start && !error.end && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
            <p className="font-medium">Meeting Scheduled</p>
            <p>Start: {startDateTime.toLocaleString()}</p>
            <p>End: {endDateTime.toLocaleString()}</p>
            <p>Duration: {Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60))} minutes</p>
          </div>
        )}
      </div>
    );
  },
};

// With custom icon
export const WithCustomIcon: Story = {
  render: () => {
    // Custom calendar and clock icon
    const CalendarTimeIcon = () => (
      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
      </svg>
    );
    
    return (
      <div className="p-6">
        <DateTimePicker 
          label="Appointment Time" 
          startIcon={<CalendarTimeIcon />}
          helperText="Custom icon at the start of the input"
        />
      </div>
    );
  },
};

// Full width example
export const FullWidth: Story = {
  render: () => (
    <div className="p-6 w-full max-w-2xl">
      <DateTimePicker 
        label="Schedule Delivery" 
        fullWidth
        helperText="This date time picker takes up the full width of its container"
      />
    </div>
  ),
};

// Combined date and time selection
export const CombinedSelection: Story = {
  render: () => {
    const [dateTime, setDateTime] = useState<Date | null>(null);
    
    return (
      <div className="p-6 border border-gray-200 rounded-md max-w-md">
        <h2 className="text-lg font-medium mb-2">Combined Date & Time Selection</h2>
        <p className="text-sm text-gray-600 mb-4">
          This component allows users to select both date and time simultaneously in a single dialog, 
          without switching between tabs or separate inputs.
        </p>
        
        <DateTimePicker 
          label="Select Date and Time" 
          value={dateTime}
          onChange={setDateTime}
          helperText={
            dateTime 
              ? `Selected: ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString()}`
              : "Click to select both date and time in a single dialog"
          }
        />
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Key Features:</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>Single dialog for both date and time selection</li>
            <li>Split layout with calendar on left, time picker on right</li>
            <li>Synchronized state between date and time components</li>
            <li>Responsive design that adapts to mobile screens</li>
            <li>Confirmation button to apply selected date and time</li>
          </ul>
        </div>
      </div>
    );
  },
}; 