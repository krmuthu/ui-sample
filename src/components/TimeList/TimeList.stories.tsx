import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { TimeList, TimeOption } from './TimeList';

const meta: Meta<typeof TimeList> = {
  title: 'Components/TimeList',
  component: TimeList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeList>;

// Helper function to generate hour options
const generateHours = (format: '12h' | '24h'): TimeOption[] => {
  const maxHours = format === '12h' ? 12 : 23;
  const minHours = format === '12h' ? 1 : 0;
  const result: TimeOption[] = [];
  
  for (let hour = minHours; hour <= maxHours; hour++) {
    result.push({
      value: hour,
      label: hour.toString().padStart(2, '0'),
      disabled: false
    });
  }
  
  return result;
};

// Helper function to generate minute options
const generateMinutes = (step: number = 5): TimeOption[] => {
  const result: TimeOption[] = [];
  
  for (let minute = 0; minute < 60; minute += step) {
    result.push({
      value: minute,
      label: minute.toString().padStart(2, '0'),
      disabled: false
    });
  }
  
  return result;
};

// Interactive example with state management
const TimeListExample = ({ displayFormat }: { displayFormat: '12h' | '24h' }) => {
  const [selectedHour, setSelectedHour] = useState(displayFormat === '12h' ? 12 : 0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  
  const hourOptions = generateHours(displayFormat);
  const minuteOptions = generateMinutes(5);
  
  return (
    <div className="p-5 border rounded-md bg-[var(--background)]" style={{ width: '320px' }}>
      <h2 className="text-lg font-medium mb-3">Time Selection</h2>
      <div className="mb-3">
        <p className="text-sm mb-2">
          Current selection: 
          <span className="font-bold ml-2">
            {selectedHour.toString().padStart(2, '0')}:
            {selectedMinute.toString().padStart(2, '0')}
            {displayFormat === '12h' ? ` ${selectedPeriod}` : ''}
          </span>
        </p>
      </div>
      <TimeList
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        selectedPeriod={selectedPeriod}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        displayFormat={displayFormat}
        onHourSelect={setSelectedHour}
        onMinuteSelect={setSelectedMinute}
        onPeriodSelect={setSelectedPeriod}
      />
    </div>
  );
};

// Default example with 12-hour format
export const TwelveHourFormat: Story = {
  render: () => <TimeListExample displayFormat="12h" />
};

// Example with 24-hour format
export const TwentyFourHourFormat: Story = {
  render: () => <TimeListExample displayFormat="24h" />
};

// Example with disabled options
export const WithDisabledOptions: Story = {
  render: () => {
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
    
    // Create hour options with some disabled
    const hourOptions = generateHours('12h').map(option => ({
      ...option,
      disabled: [1, 3, 5, 7, 9].includes(option.value)
    }));
    
    // Create minute options with some disabled
    const minuteOptions = generateMinutes(5).map(option => ({
      ...option,
      disabled: option.value < 15 || option.value > 45
    }));
    
    return (
      <div className="p-5 border rounded-md bg-[var(--background)]" style={{ width: '320px' }}>
        <h2 className="text-lg font-medium mb-3">Time Selection (Limited Times)</h2>
        <p className="text-sm mb-3">Hours 1, 3, 5, 7, 9 and minutes outside 15-45 are disabled</p>
        <TimeList
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          selectedPeriod={selectedPeriod}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          displayFormat="12h"
          onHourSelect={setSelectedHour}
          onMinuteSelect={setSelectedMinute}
          onPeriodSelect={setSelectedPeriod}
        />
      </div>
    );
  }
}; 