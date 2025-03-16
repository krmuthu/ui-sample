import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Calendar from './Calendar';

// Define the meta information for the Calendar component
const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'date' },
    onChange: { action: 'date changed' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
    disabledDates: { control: 'object' },
    isDateDisabled: { control: false },
    closeOnSelect: { control: 'boolean' },
    initialMonth: { control: 'date' },
    locale: { control: 'text' },
    onDateSelect: { action: 'date selected' },
    onClose: { action: 'calendar closed' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// Basic calendar with default settings
export const Default: Story = {
  args: {},
};

// Calendar with pre-selected date
export const WithSelectedDate: Story = {
  args: {
    value: new Date(2023, 5, 15), // June 15, 2023
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Calendar with date range restrictions
export const WithDateRestrictions: Story = {
  args: {
    minDate: new Date(2023, 5, 5), // June 5, 2023
    maxDate: new Date(2023, 5, 25), // June 25, 2023
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Calendar with specific disabled dates
export const WithDisabledDates: Story = {
  args: {
    disabledDates: [
      new Date(2023, 5, 10), // June 10, 2023
      new Date(2023, 5, 15), // June 15, 2023
      new Date(2023, 5, 20), // June 20, 2023
    ],
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Calendar with custom date disabling function
export const WithCustomDateDisabling: Story = {
  args: {
    isDateDisabled: (date: Date) => {
      // Disable weekends (Saturday and Sunday)
      return date.getDay() === 0 || date.getDay() === 6;
    },
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Calendar with different locale
export const WithDifferentLocale: Story = {
  args: {
    locale: 'fr-FR',
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Interactive calendar example with state
const InteractiveCalendarExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewInfo, setViewInfo] = useState<string>('No interactions yet');
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setViewInfo(`Selected date: ${date ? date.toLocaleDateString() : 'None'}`);
  };
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="mb-4 text-lg font-medium">Interactive Calendar</h3>
      <div className="mb-4 p-2 bg-slate-100 rounded">
        <p className="text-sm">{viewInfo}</p>
      </div>
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        onDateSelect={(date) => setViewInfo(`Date selected: ${date.toLocaleDateString()}`)}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveCalendarExample />,
};

// Calendar view modes demonstration
const CalendarViewModesExample = () => {
  const [viewState, setViewState] = useState<string>('View the calendar and interact with it to see different view modes');
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="mb-4 text-lg font-medium">Calendar View Modes</h3>
      <p className="mb-2 text-sm">
        Click on the month or year in the calendar header to switch between views:
      </p>
      <ul className="mb-4 text-sm list-disc pl-5">
        <li>Click on the month name to see month selection view</li>
        <li>Click on the year to see year selection view</li>
        <li>Select a month/year to return to day view</li>
      </ul>
      <div className="mb-4 p-2 bg-slate-100 rounded">
        <p className="text-sm">{viewState}</p>
      </div>
      <Calendar
        value={new Date()}
        onChange={(date) => setViewState(`Selected date: ${date ? date.toLocaleDateString() : 'None'}`)}
      />
    </div>
  );
};

export const ViewModes: Story = {
  render: () => <CalendarViewModesExample />,
};

// Calendar with custom styling
export const CustomStyling: Story = {
  args: {
    className: 'bg-blue-50 border-blue-200 rounded-xl shadow-md',
    initialMonth: new Date(2023, 5, 1), // June 1, 2023
  },
};

// Meeting scheduler example with date range
const MeetingSchedulerExample = () => {
  const today = new Date();
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [meetingInfo, setMeetingInfo] = useState<string>('Select a date for your meeting');
  
  // Set minimum date to today and maximum date to 30 days from now
  const minDate = today;
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  
  // Disable weekends
  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
  
  // Also disable specific holidays or unavailable dates
  const disabledDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
  ];
  
  const handleDateSelect = (date: Date | null) => {
    setMeetingDate(date);
    if (date) {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setMeetingInfo(`Meeting scheduled for ${date.toLocaleDateString(undefined, options)}`);
    } else {
      setMeetingInfo('No date selected');
    }
  };
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="mb-4 text-lg font-medium">Meeting Scheduler</h3>
      <p className="mb-2 text-sm">
        Select an available date within the next 30 days (weekends and marked dates are unavailable)
      </p>
      <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
        <p className="text-sm font-medium">{meetingInfo}</p>
      </div>
      <Calendar
        value={meetingDate}
        onChange={handleDateSelect}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        isDateDisabled={isWeekend}
        closeOnSelect={true}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export const MeetingScheduler: Story = {
  render: () => <MeetingSchedulerExample />,
};

// Range selection example (custom implementation)
const DateRangeSelectionExample = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>('start');
  const [rangeInfo, setRangeInfo] = useState<string>('Select start date');
  
  const handleDateSelect = (date: Date) => {
    if (selectionPhase === 'start') {
      setStartDate(date);
      setEndDate(null);
      setSelectionPhase('end');
      setRangeInfo('Select end date');
    } else {
      // Ensure end date is not before start date
      if (startDate && date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectionPhase('start');
      
      const formatDate = (d: Date) => d.toLocaleDateString();
      setRangeInfo(`Range selected: ${formatDate(startDate!)} to ${formatDate(date)}`);
    }
  };
  
  // Custom function to highlight the range
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isDateDisabled = (_date: Date) => {
    // This function doesn't actually disable dates but is used to show our custom styling logic
    return false;
  };
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="mb-4 text-lg font-medium">Date Range Selection</h3>
      <p className="mb-2 text-sm">
        {selectionPhase === 'start' ? 'Select the start date' : 'Now select the end date'}
      </p>
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm font-medium">{rangeInfo}</p>
      </div>
      <div className="relative">
        <Calendar
          value={selectionPhase === 'start' ? startDate : endDate}
          isDateDisabled={isDateDisabled}
          onDateSelect={handleDateSelect}
          closeOnSelect={false}
        />
        {/* Custom styling for date range - this would be implemented differently in a real component */}
        {startDate && endDate && (
          <div className="absolute inset-0 pointer-events-none">
            {/* This is a simplified representation - in a real implementation, you would style the actual calendar days */}
            <div className="mt-10 mx-4 p-2 text-center bg-blue-100 bg-opacity-50 rounded">
              Range visualization would appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DateRangeSelection: Story = {
  render: () => <DateRangeSelectionExample />,
}; 