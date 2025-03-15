import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

// Sample options for stories
const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true },
];

// Country options for more realistic examples
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India' },
];

// Long list of options to demonstrate scrolling
const longOptionsList = Array.from({ length: 30 }, (_, i) => ({
  value: `option${i + 1}`,
  label: `Option ${i + 1}`,
  disabled: i % 10 === 9, // Make every 10th option disabled
}));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display in the select',
    },
    value: {
      control: 'text',
      description: 'The selected value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the select component',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The visual style of the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the select shows an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the select takes up the full width of its container',
    },
    label: {
      control: 'text',
      description: 'Label text to display above the select',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Base story with controls
export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select an option',
    size: 'medium',
    variant: 'primary',
    label: 'Select field',
  },
};

// Variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Select Variants</h3>
      <div className="flex flex-col gap-4">
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Primary variant" 
            variant="primary" 
            label="Primary"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Secondary variant" 
            variant="secondary" 
            label="Secondary"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Tertiary variant" 
            variant="tertiary" 
            label="Tertiary"
          />
        </div>
      </div>
    </div>
  ),
};

// Sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Select Sizes</h3>
      <div className="flex flex-col gap-4">
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Small size" 
            size="small" 
            label="Small"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Medium size" 
            size="medium" 
            label="Medium"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Large size" 
            size="large" 
            label="Large"
          />
        </div>
      </div>
    </div>
  ),
};

// States showcase
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Select States</h3>
      <div className="flex flex-col gap-4">
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Select an option" 
            label="Default"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            value="option2" 
            label="With Selected Value"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Disabled select" 
            disabled 
            label="Disabled"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="Select an option" 
            error 
            errorMessage="This field is required" 
            label="Error State"
          />
        </div>
        <div>
          <Select 
            options={sampleOptions} 
            placeholder="This field is required" 
            required 
            label="Required Field"
          />
        </div>
      </div>
    </div>
  ),
};

// Full width showcase
export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Full Width Select</h3>
      <Select 
        options={countryOptions} 
        placeholder="Select a country" 
        fullWidth 
        label="Country"
      />
    </div>
  ),
};

// Long list with scrolling
export const LongListWithScrolling: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Long List with Scrolling</h3>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--foreground)]">
          This example demonstrates scrolling behavior with a long list of options.
          Disabled options are every 10th item.
        </p>
        <Select 
          options={longOptionsList} 
          placeholder="Select from a long list (30 items)" 
          label="Long List"
        />
      </div>
    </div>
  ),
};

// Interactive form example with controlled state
export const ControlledForm: Story = {
  render: () => {
    // Use a function component to enable hooks
    const ControlledFormExample = () => {
      const [country, setCountry] = useState('');
      const [state, setState] = useState('');
      const [formSubmitted, setFormSubmitted] = useState(false);
      
      // Dynamic state options based on selected country
      const getStateOptions = () => {
        if (country === 'us') {
          return [
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' },
            { value: 'tx', label: 'Texas' },
            { value: 'fl', label: 'Florida' },
          ];
        } else if (country === 'ca') {
          return [
            { value: 'on', label: 'Ontario' },
            { value: 'qc', label: 'Quebec' },
            { value: 'bc', label: 'British Columbia' },
          ];
        } else {
          return [];
        }
      };
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
      };
      
      return (
        <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md max-w-md">
          <h3 className="text-lg font-medium text-[var(--foreground)]">Interactive Form Example</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Select 
                options={countryOptions} 
                placeholder="Select your country" 
                fullWidth
                value={country}
                onChange={setCountry}
                error={formSubmitted && !country}
                errorMessage={formSubmitted && !country ? "Country is required" : ""}
                label="Country"
                required
              />
            </div>
            
            <div>
              <Select 
                options={getStateOptions()} 
                placeholder={country ? "Select your state/province" : "Please select a country first"}
                fullWidth
                value={state}
                onChange={setState}
                disabled={!country || getStateOptions().length === 0}
                label="State/Province"
              />
            </div>
            
            <button 
              type="submit"
              className="mt-4 px-4 py-2 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-md hover:bg-[var(--btn-primary-hover)]"
            >
              Submit Form
            </button>
            
            {formSubmitted && (
              <div className="mt-4 p-3 bg-[var(--btn-secondary-bg)] rounded-md">
                <h4 className="font-medium text-[var(--foreground)]">Form Values:</h4>
                <p className="text-[var(--foreground)]">Country: {country || 'Not selected'}</p>
                <p className="text-[var(--foreground)]">State/Province: {state || 'Not selected'}</p>
              </div>
            )}
          </form>
        </div>
      );
    };
    
    return <ControlledFormExample />;
  },
};

// Required fields showcase
export const RequiredFields: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md max-w-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Required Fields Example</h3>
      <div className="space-y-4">
        <Select 
          options={countryOptions} 
          placeholder="Select your country" 
          fullWidth 
          label="Required Field (with asterisk)"
          required
        />
        
        <Select 
          options={countryOptions} 
          placeholder="Select your country" 
          fullWidth 
          label="Optional Field (no asterisk)"
        />
        
        <Select 
          options={countryOptions} 
          placeholder="Select your country" 
          fullWidth 
          label="Required with Error"
          required
          error
          errorMessage="This field is required"
        />
      </div>
    </div>
  ),
};

// Form field example
export const FormFieldExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md max-w-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Form Field Example</h3>
      <div className="space-y-4">
        <Select 
          options={countryOptions} 
          placeholder="Select your country" 
          fullWidth 
          label="Country"
          required
        />
        
        <Select 
          options={[
            { value: 'ny', label: 'New York' },
            { value: 'ca', label: 'California' },
            { value: 'tx', label: 'Texas' },
            { value: 'fl', label: 'Florida' },
          ]} 
          placeholder="Select your state" 
          fullWidth 
          label="State/Province"
        />
        
        <Select 
          options={sampleOptions} 
          placeholder="This field is required" 
          fullWidth 
          error
          errorMessage="Please select an option"
          label="Required Field"
          required
        />
      </div>
    </div>
  ),
}; 