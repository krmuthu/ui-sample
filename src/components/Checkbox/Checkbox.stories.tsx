import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary']
    },
    labelPlacement: {
      control: { type: 'select' },
      options: ['start', 'end']
    }
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/**
 * Default checkbox with a label
 */
export const Default: Story = {
  args: {
    label: 'Default Checkbox',
  },
};

/**
 * A checkbox in checked state
 */
export const Checked: Story = {
  args: {
    label: 'Checked Checkbox',
    checked: true,
  },
};

/**
 * A checkbox with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Checkbox size="small" label="Small Checkbox" />
      <Checkbox size="medium" label="Medium Checkbox" />
      <Checkbox size="large" label="Large Checkbox" />
    </div>
  ),
};

/**
 * Different color variants of the checkbox
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Checkbox variant="primary" label="Primary Checkbox" />
      <Checkbox variant="secondary" label="Secondary Checkbox" />
      <Checkbox variant="tertiary" label="Tertiary Checkbox" />
    </div>
  ),
};

/**
 * Different states that a checkbox can be in
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Checkbox label="Normal Checkbox" />
      <Checkbox label="Checked Checkbox" checked />
      <Checkbox label="Disabled Checkbox" disabled />
      <Checkbox label="Disabled Checked Checkbox" disabled checked />
      <Checkbox label="With Error" error errorMessage="This field has an error" />
      <Checkbox label="With Helper Text" helperText="This is a helpful message" />
      <Checkbox label="Indeterminate Checkbox" indeterminate />
    </div>
  ),
};

/**
 * A checkbox with the label at different positions
 */
export const LabelPlacement: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Checkbox label="Label at the end (default)" labelPlacement="end" />
      <Checkbox label="Label at the start" labelPlacement="start" />
    </div>
  ),
};

/**
 * A required checkbox with an asterisk
 */
export const Required: Story = {
  args: {
    label: 'Required Checkbox',
    required: true,
  },
};

/**
 * An interactive example showing a controlled checkbox
 */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    
    return (
      <div className="flex flex-col space-y-2">
        <Checkbox 
          label={`Checkbox is ${checked ? 'checked' : 'unchecked'}`} 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-gray-600">
          Click the checkbox to toggle its state
        </p>
      </div>
    );
  },
};

/**
 * A group of checkboxes for a form
 */
export const CheckboxGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (e.target.checked) {
        setSelected(prev => [...prev, value]);
      } else {
        setSelected(prev => prev.filter(item => item !== value));
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Checkbox 
            label="Option 1" 
            value="option1"
            checked={selected.includes('option1')}
            onChange={handleChange}
          />
          <Checkbox 
            label="Option 2" 
            value="option2"
            checked={selected.includes('option2')}
            onChange={handleChange}
          />
          <Checkbox 
            label="Option 3" 
            value="option3"
            checked={selected.includes('option3')}
            onChange={handleChange}
          />
        </div>
        <p className="text-sm border p-2 rounded bg-gray-50">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Enhanced error state styling for Checkbox component
 */
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-6">
      <h3 className="text-lg font-medium">Enhanced Error States</h3>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Basic Error States</h4>
        <div className="flex flex-col space-y-2">
          <Checkbox 
            label="Basic Error State" 
            error 
            errorMessage="This selection is invalid" 
          />
          <Checkbox 
            label="Required with Error" 
            required 
            error 
            errorMessage="This field is required" 
          />
          <Checkbox 
            label="Checked with Error" 
            checked 
            error 
            errorMessage="This selection conflicts with other choices" 
          />
          <Checkbox 
            label="Indeterminate with Error" 
            indeterminate 
            error 
            errorMessage="Mixed state needs resolution" 
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error States with Different Sizes</h4>
        <div className="flex flex-col space-y-2">
          <Checkbox 
            size="small" 
            label="Small Error State" 
            error 
            errorMessage="Error with small size"
          />
          <Checkbox 
            size="medium" 
            label="Medium Error State" 
            error 
            errorMessage="Error with medium size"
          />
          <Checkbox 
            size="large" 
            label="Large Error State" 
            error 
            errorMessage="Error with large size"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error States with Different Variants</h4>
        <div className="flex flex-col space-y-2">
          <Checkbox 
            variant="primary" 
            label="Primary Error" 
            error 
            errorMessage="Error with primary variant"
          />
          <Checkbox 
            variant="secondary" 
            label="Secondary Error" 
            error 
            errorMessage="Error with secondary variant"
          />
          <Checkbox 
            variant="tertiary" 
            label="Tertiary Error" 
            error 
            errorMessage="Error with tertiary variant"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error with Label Placement</h4>
        <div className="flex flex-col space-y-2">
          <Checkbox 
            label="Error with Label at End" 
            labelPlacement="end" 
            error 
            errorMessage="Error with label at end"
          />
          <Checkbox 
            label="Error with Label at Start" 
            labelPlacement="start" 
            error 
            errorMessage="Error with label at start"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Group with Error</h4>
        <div className="border p-4 rounded-md bg-gray-50">
          <div className="text-red-500 text-sm font-medium mb-2">Please select at least one option</div>
          <div className="flex flex-col space-y-2">
            <Checkbox 
              label="Option 1" 
              error 
            />
            <Checkbox 
              label="Option 2" 
              error
            />
            <Checkbox 
              label="Option 3" 
              error
            />
          </div>
          <div className="mt-2 text-red-500 text-sm font-medium">At least one option must be selected</div>
        </div>
      </div>
    </div>
  ),
}; 