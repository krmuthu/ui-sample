import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'The selected date value',
    },
    onChange: {
      action: 'date changed',
      description: 'Callback for when the date changes',
    },
    label: {
      control: 'text',
      description: 'Label for the date picker',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
    },
    displayFormat: {
      control: 'text',
      description: 'Format for displaying the date in the input',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Maximum selectable date',
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
    required: {
      control: 'boolean',
      description: 'Whether the date picker is required',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether to close the calendar when a date is selected',
    },
    locale: {
      control: 'text',
      description: 'Locale for the date picker',
    },
    disablePast: {
      control: 'boolean',
      description: 'Whether to disable past dates',
    },
    disableFuture: {
      control: 'boolean',
      description: 'Whether to disable future dates',
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Basic date picker with controls
export const Playground: Story = {
  args: {
    label: 'Select Date',
    placeholder: 'MM/DD/YYYY',
    size: 'medium',
    displayFormat: 'MM/dd/yyyy',
    clearable: true,
    closeOnSelect: true,
    fullWidth: false,
    required: false,
    disabled: false,
    error: false,
    locale: 'en-US',
  },
  render: (args) => {
    // Use local state to control the date value
    const [date, setDate] = useState<Date | null>(null);
    
    return (
      <div className="p-6">
        <DatePicker
          {...args}
          value={date}
          onChange={(newDate) => {
            args.onChange?.(newDate);
            setDate(newDate);
          }}
        />
      </div>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <DatePicker size="small" label="Small Size" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Medium (Default)</h3>
        <DatePicker size="medium" label="Medium Size" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <DatePicker size="large" label="Large Size" />
      </div>
    </div>
  ),
};

// State variations
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Default</h3>
        <DatePicker label="Default State" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">With Value</h3>
        <DatePicker 
          label="Date with Value" 
          value={new Date(2023, 0, 15)} // January 15, 2023
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Disabled</h3>
        <DatePicker 
          label="Disabled Date Picker" 
          disabled 
          value={new Date(2023, 0, 15)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Error State</h3>
        <DatePicker 
          label="Error State" 
          error 
          errorMessage="Please select a valid date"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Required</h3>
        <DatePicker label="Required Date" required />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">With Helper Text</h3>
        <DatePicker 
          label="With Helper Text" 
          helperText="Select a date in the past"
        />
      </div>
    </div>
  ),
};

// With date restrictions
export const DateRestrictions: Story = {
  render: () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const oneMonthAhead = new Date(today);
    oneMonthAhead.setMonth(today.getMonth() + 1);
    
    // Create specific disabled dates
    const disabledDates = [
      new Date(today.getFullYear(), today.getMonth(), 10),
      new Date(today.getFullYear(), today.getMonth(), 15),
      new Date(today.getFullYear(), today.getMonth(), 20)
    ];
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">With Minimum Date (1 month ago)</h3>
          <DatePicker 
            label="Min Date" 
            minDate={oneMonthAgo}
            helperText={`Minimum date: ${oneMonthAgo.toLocaleDateString()}`}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">With Maximum Date (1 month ahead)</h3>
          <DatePicker 
            label="Max Date" 
            maxDate={oneMonthAhead}
            helperText={`Maximum date: ${oneMonthAhead.toLocaleDateString()}`}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">With Date Range (between 1 month ago and 1 month ahead)</h3>
          <DatePicker 
            label="Date Range" 
            minDate={oneMonthAgo}
            maxDate={oneMonthAhead}
            helperText={`Select a date between ${oneMonthAgo.toLocaleDateString()} and ${oneMonthAhead.toLocaleDateString()}`}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">With Specific Disabled Dates</h3>
          <DatePicker 
            label="Disabled Dates" 
            disabledDates={disabledDates}
            helperText="The 10th, 15th, and 20th of the current month are disabled"
          />
        </div>
      </div>
    );
  },
};

// Interactive example with form integration
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      startDate: null as Date | null,
      endDate: null as Date | null,
    });
    
    const [errors, setErrors] = useState({
      startDate: '',
      endDate: '',
    });
    
    const handleStartDateChange = (date: Date | null) => {
      setFormData({ ...formData, startDate: date });
      
      // Clear error when date is selected
      if (date) {
        setErrors({ ...errors, startDate: '' });
      }
    };
    
    const handleEndDateChange = (date: Date | null) => {
      setFormData({ ...formData, endDate: date });
      
      // Clear error when date is selected
      if (date) {
        setErrors({ ...errors, endDate: '' });
      }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Simple validation
      const newErrors = { ...errors };
      let hasErrors = false;
      
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
        hasErrors = true;
      }
      
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
        hasErrors = true;
      } else if (formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = 'End date must be after start date';
        hasErrors = true;
      }
      
      if (hasErrors) {
        setErrors(newErrors);
        return;
      }
      
      // Show success message
      alert(`Form submitted successfully!\nStart Date: ${formData.startDate?.toLocaleDateString()}\nEnd Date: ${formData.endDate?.toLocaleDateString()}`);
    };
    
    return (
      <div className="p-6 border border-gray-200 rounded-md dark:border-gray-700 max-w-md mx-auto">
        <h2 className="text-xl font-medium mb-4">Event Booking</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <DatePicker 
              label="Start Date" 
              required
              value={formData.startDate}
              onChange={handleStartDateChange}
              error={!!errors.startDate}
              errorMessage={errors.startDate}
              maxDate={formData.endDate || undefined}
            />
          </div>
          
          <div>
            <DatePicker 
              label="End Date" 
              required
              value={formData.endDate}
              onChange={handleEndDateChange}
              error={!!errors.endDate}
              errorMessage={errors.endDate}
              minDate={formData.startDate || undefined}
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Book Event
            </button>
          </div>
        </form>
      </div>
    );
  },
};

// With custom icons
export const WithIcons: Story = {
  render: () => {
    // Calendar icon for the start icon
    const CalendarIcon = () => (
      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    );
    
    return (
      <div className="space-y-6 max-w-md">
        <div>
          <h3 className="text-sm font-medium mb-2">With Start Icon</h3>
          <DatePicker 
            label="Date with Icon" 
            startIcon={<CalendarIcon />}
          />
        </div>
      </div>
    );
  },
};

// With different locales
export const DifferentLocales: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">English (US) - Default</h3>
        <DatePicker 
          label="English (US)" 
          locale="en-US"
          value={new Date(2023, 0, 15)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">French</h3>
        <DatePicker 
          label="French" 
          locale="fr-FR"
          value={new Date(2023, 0, 15)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Spanish</h3>
        <DatePicker 
          label="Spanish" 
          locale="es-ES"
          value={new Date(2023, 0, 15)}
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Japanese</h3>
        <DatePicker 
          label="Japanese" 
          locale="ja-JP"
          value={new Date(2023, 0, 15)}
        />
      </div>
    </div>
  ),
};

// Date picker with min and max date constraints
export const WithDateConstraints: Story = {
  args: {
    label: 'Select Date (within range)',
    minDate: new Date(2023, 0, 1), // Jan 1, 2023
    maxDate: new Date(2023, 11, 31), // Dec 31, 2023
    helperText: 'Select a date in 2023',
  },
};

// Date picker that disables past dates
export const DisablePastDates: Story = {
  args: {
    label: 'Future Date Only',
    disablePast: true,
    helperText: 'Only future dates can be selected',
  },
};

// Date picker that disables future dates
export const DisableFutureDates: Story = {
  args: {
    label: 'Past Date Only',
    disableFuture: true,
    helperText: 'Only past dates can be selected',
  },
};

// Date picker with error state
export const WithError: Story = {
  args: {
    label: 'Select Date',
    error: true,
    errorMessage: 'Please select a valid date',
  },
};

// Disabled date picker
export const Disabled: Story = {
  args: {
    label: 'Select Date',
    disabled: true,
  },
};

// Date picker with custom icon
export const WithIcon: Story = {
  args: {
    label: 'Select Date',
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
  },
};

// Date picker with full width
export const FullWidth: Story = {
  args: {
    label: 'Select Date',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Date picker with different variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <DatePicker label="Primary" variant="primary" />
      <DatePicker label="Secondary" variant="secondary" />
      <DatePicker label="Tertiary" variant="tertiary" />
    </div>
  ),
};

// Date picker with custom date format
export const CustomFormat: Story = {
  args: {
    label: 'Select Date',
    displayFormat: 'MM/dd/yyyy',
    helperText: 'Format: MM/DD/YYYY',
  },
};

// Appointment scheduling example
export const AppointmentScheduler: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Schedule an Appointment</h3>
      <p style={{ marginBottom: '16px', fontSize: '14px' }}>
        Select a date for your appointment. Only future dates are available.
      </p>
      <DatePicker 
        label="Appointment Date" 
        disablePast={true}
        fullWidth
        helperText="Select a date for your appointment"
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
          Continue
        </button>
      </div>
    </div>
  ),
}; 