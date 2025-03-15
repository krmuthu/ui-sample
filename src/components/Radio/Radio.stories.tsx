import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'Components/Radio',
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
type Story = StoryObj<typeof Radio>;

/**
 * Default radio button with a label
 */
export const Default: Story = {
  args: {
    label: 'Default Radio Button',
    name: 'default',
  },
};

/**
 * A radio button in checked state
 */
export const Checked: Story = {
  args: {
    label: 'Checked Radio Button',
    name: 'checked',
    checked: true,
  },
};

/**
 * Radio buttons with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Radio size="small" label="Small Radio Button" name="size" value="small" />
      <Radio size="medium" label="Medium Radio Button" name="size" value="medium" />
      <Radio size="large" label="Large Radio Button" name="size" value="large" />
    </div>
  ),
};

/**
 * Different color variants of the radio button
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Radio variant="primary" label="Primary Radio" name="variant" value="primary" />
      <Radio variant="secondary" label="Secondary Radio" name="variant" value="secondary" />
      <Radio variant="tertiary" label="Tertiary Radio" name="variant" value="tertiary" />
    </div>
  ),
};

/**
 * Different states that a radio button can be in
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Radio label="Normal Radio" name="states" value="normal" />
      <Radio label="Checked Radio" name="states" value="checked" checked />
      <Radio label="Disabled Radio" name="states" value="disabled" disabled />
      <Radio label="Disabled Checked Radio" name="states" value="disabled-checked" disabled checked />
      <Radio label="With Error" name="states" value="error" error errorMessage="This field has an error" />
      <Radio label="With Helper Text" name="states" value="helper" helperText="This is a helpful message" />
    </div>
  ),
};

/**
 * A radio button with the label at different positions
 */
export const LabelPlacement: Story = {
  render: () => (
    <div className="flex flex-col space-y-2">
      <Radio label="Label at the end (default)" name="labelPlacement" value="end" labelPlacement="end" />
      <Radio label="Label at the start" name="labelPlacement" value="start" labelPlacement="start" />
    </div>
  ),
};

/**
 * A required radio button with an asterisk
 */
export const Required: Story = {
  args: {
    label: 'Required Radio Button',
    name: 'required',
    required: true,
  },
};

/**
 * A radio button group example - interactive
 */
export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('option1');
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Radio 
            label="Option 1" 
            name="options" 
            value="option1"
            checked={selected === 'option1'}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio 
            label="Option 2" 
            name="options" 
            value="option2"
            checked={selected === 'option2'}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio 
            label="Option 3" 
            name="options" 
            value="option3"
            checked={selected === 'option3'}
            onChange={(e) => setSelected(e.target.value)}
          />
          <Radio 
            label="Disabled Option" 
            name="options" 
            value="option4"
            disabled
            checked={selected === 'option4'}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
        <p className="text-sm border p-2 rounded bg-gray-50">
          Selected: {selected}
        </p>
      </div>
    );
  },
};

/**
 * Form with radio buttons
 */
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      subscription: 'monthly',
      deliveryOption: 'standard',
    });
    
    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };
    
    return (
      <div className="space-y-8">
        <div className="border p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Subscription Plan</h3>
          <div className="space-y-2 mb-4">
            <Radio 
              label="Monthly ($9.99/month)" 
              name="subscription"
              value="monthly"
              checked={formData.subscription === 'monthly'}
              onChange={handleChange('subscription')}
            />
            <Radio 
              label="Annual ($99.99/year)" 
              name="subscription"
              value="annual"
              checked={formData.subscription === 'annual'}
              onChange={handleChange('subscription')}
              helperText="Save 17% compared to monthly"
            />
            <Radio 
              label="Lifetime ($299.99)" 
              name="subscription"
              value="lifetime"
              checked={formData.subscription === 'lifetime'}
              onChange={handleChange('subscription')}
              helperText="One-time payment, best long-term value"
            />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Delivery Options</h3>
          <div className="space-y-2">
            <Radio 
              label="Standard Delivery (Free)" 
              name="delivery"
              value="standard"
              checked={formData.deliveryOption === 'standard'}
              onChange={handleChange('deliveryOption')}
              helperText="5-7 business days"
            />
            <Radio 
              label="Express Delivery ($9.99)" 
              name="delivery"
              value="express"
              checked={formData.deliveryOption === 'express'}
              onChange={handleChange('deliveryOption')}
              helperText="2-3 business days"
            />
            <Radio 
              label="Next Day Delivery ($19.99)" 
              name="delivery"
              value="nextDay"
              checked={formData.deliveryOption === 'nextDay'}
              onChange={handleChange('deliveryOption')}
              helperText="Next business day"
            />
          </div>
        </div>
        
        <div className="text-sm border p-2 rounded bg-gray-50">
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

/**
 * Enhanced error state styling for Radio component
 */
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-6">
      <h3 className="text-lg font-medium">Enhanced Error States</h3>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Basic Error States</h4>
        <div className="flex flex-col space-y-2">
          <Radio 
            label="Basic Error State" 
            name="error-basic" 
            value="error" 
            error 
            errorMessage="This selection is invalid" 
          />
          <Radio 
            label="Required with Error" 
            name="error-required" 
            value="required-error" 
            required 
            error 
            errorMessage="This field is required" 
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error States with Different Sizes</h4>
        <div className="flex flex-col space-y-2">
          <Radio 
            size="small" 
            label="Small Error State" 
            name="error-size" 
            value="small" 
            error 
            errorMessage="Error with small size"
          />
          <Radio 
            size="medium" 
            label="Medium Error State" 
            name="error-size" 
            value="medium" 
            error 
            errorMessage="Error with medium size"
          />
          <Radio 
            size="large" 
            label="Large Error State" 
            name="error-size" 
            value="large" 
            error 
            errorMessage="Error with large size"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error States with Different Variants</h4>
        <div className="flex flex-col space-y-2">
          <Radio 
            variant="primary" 
            label="Primary Error" 
            name="error-variant" 
            value="primary" 
            error 
            errorMessage="Error with primary variant"
          />
          <Radio 
            variant="secondary" 
            label="Secondary Error" 
            name="error-variant" 
            value="secondary" 
            error 
            errorMessage="Error with secondary variant"
          />
          <Radio 
            variant="tertiary" 
            label="Tertiary Error" 
            name="error-variant" 
            value="tertiary" 
            error 
            errorMessage="Error with tertiary variant"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Error with Label Placement</h4>
        <div className="flex flex-col space-y-2">
          <Radio 
            label="Error with Label at End" 
            name="error-label-placement" 
            value="end" 
            labelPlacement="end" 
            error 
            errorMessage="Error with label at end"
          />
          <Radio 
            label="Error with Label at Start" 
            name="error-label-placement" 
            value="start" 
            labelPlacement="start" 
            error 
            errorMessage="Error with label at start"
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <h4 className="text-md font-medium">Group with Error</h4>
        <div className="border p-4 rounded-md bg-gray-50">
          <div className="text-red-500 text-sm font-medium mb-2">Please select one option</div>
          <div className="flex flex-col space-y-2">
            <Radio 
              label="Option 1" 
              name="error-group" 
              value="option1" 
              error 
            />
            <Radio 
              label="Option 2" 
              name="error-group" 
              value="option2" 
              error
            />
            <Radio 
              label="Option 3" 
              name="error-group" 
              value="option3" 
              error
            />
          </div>
          <div className="mt-2 text-red-500 text-sm font-medium">This selection is required</div>
        </div>
      </div>
    </div>
  ),
}; 