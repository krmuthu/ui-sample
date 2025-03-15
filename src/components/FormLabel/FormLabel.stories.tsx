import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormLabel } from './FormLabel';

const meta: Meta<typeof FormLabel> = {
  title: 'Components/FormLabel',
  component: FormLabel,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The label text to display',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the input element this label is associated with',
    },
    required: {
      control: 'boolean',
      description: 'Whether the associated field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the label should be disabled',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the label',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormLabel>;

// Base story with controls
export const Default: Story = {
  args: {
    children: 'Label Text',
    htmlFor: 'example-input',
    required: false,
    disabled: false,
    size: 'medium',
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <FormLabel {...args} />
      <input 
        id={args.htmlFor} 
        type="text" 
        placeholder="Input field" 
        className="border rounded-md p-2"
      />
    </div>
  ),
};

// Various states
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Label States</h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <FormLabel htmlFor="default-input">Default Label</FormLabel>
          <input 
            id="default-input" 
            type="text" 
            placeholder="Default input" 
            className="border rounded-md p-2"
          />
        </div>
        
        <div>
          <FormLabel htmlFor="required-input" required>Required Label</FormLabel>
          <input 
            id="required-input" 
            type="text" 
            placeholder="Required input" 
            className="border rounded-md p-2"
            required
          />
        </div>
        
        <div>
          <FormLabel htmlFor="disabled-input" disabled>Disabled Label</FormLabel>
          <input 
            id="disabled-input" 
            type="text" 
            placeholder="Disabled input" 
            className="border rounded-md p-2 opacity-50"
            disabled
          />
        </div>
      </div>
    </div>
  ),
};

// Size variants
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Label Sizes</h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <FormLabel htmlFor="small-input" size="small">Small Label</FormLabel>
          <input 
            id="small-input" 
            type="text" 
            placeholder="Small input" 
            className="border rounded-md p-1 text-sm"
          />
        </div>
        
        <div>
          <FormLabel htmlFor="medium-input" size="medium">Medium Label</FormLabel>
          <input 
            id="medium-input" 
            type="text" 
            placeholder="Medium input" 
            className="border rounded-md p-2"
          />
        </div>
        
        <div>
          <FormLabel htmlFor="large-input" size="large">Large Label</FormLabel>
          <input 
            id="large-input" 
            type="text" 
            placeholder="Large input" 
            className="border rounded-md p-3 text-lg"
          />
        </div>
      </div>
    </div>
  ),
};

// Combined variants
export const CombinedExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Combined Examples</h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <FormLabel htmlFor="required-small-input" required size="small">Small Required Label</FormLabel>
          <input 
            id="required-small-input" 
            type="text" 
            placeholder="Small required input" 
            className="border rounded-md p-1 text-sm"
            required
          />
        </div>
        
        <div>
          <FormLabel htmlFor="required-large-input" required size="large">Large Required Label</FormLabel>
          <input 
            id="required-large-input" 
            type="text" 
            placeholder="Large required input" 
            className="border rounded-md p-3 text-lg"
            required
          />
        </div>
        
        <div>
          <FormLabel htmlFor="disabled-large-input" disabled size="large">Large Disabled Label</FormLabel>
          <input 
            id="disabled-large-input" 
            type="text" 
            placeholder="Large disabled input" 
            className="border rounded-md p-3 text-lg opacity-50"
            disabled
          />
        </div>
      </div>
    </div>
  ),
}; 