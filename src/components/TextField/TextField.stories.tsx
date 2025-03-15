import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when the input is empty',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the text field',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'The visual style of the text field',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the text field is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the text field shows an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the text field should take up the full width of its container',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'The type of the input field',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when input value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

// Base story with controls
export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Helper text',
    size: 'medium',
    variant: 'primary',
  },
};

// Variants showcase
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Input Variants</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Primary</p>
          <TextField label="Primary Variant" placeholder="Primary variant" variant="primary" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Secondary</p>
          <TextField label="Secondary Variant" placeholder="Secondary variant" variant="secondary" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Tertiary</p>
          <TextField label="Tertiary Variant" placeholder="Tertiary variant" variant="tertiary" />
        </div>
      </div>
    </div>
  ),
};

// Sizes showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Input Sizes</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Small</p>
          <TextField label="Small Input" placeholder="Small size" size="small" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Medium</p>
          <TextField label="Medium Input" placeholder="Medium size" size="medium" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Large</p>
          <TextField label="Large Input" placeholder="Large size" size="large" />
        </div>
      </div>
    </div>
  ),
};

// States showcase
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Input States</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Default</p>
          <TextField label="Default Input" placeholder="Default state" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">With Helper Text</p>
          <TextField 
            label="With Helper Text" 
            placeholder="Input with helper" 
            helperText="This is some helpful information"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Required Field</p>
          <TextField 
            label="Required Input" 
            placeholder="This field is required" 
            required 
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Disabled</p>
          <TextField 
            label="Disabled Input" 
            placeholder="Disabled state" 
            disabled 
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Error State</p>
          <TextField 
            label="Error Input" 
            placeholder="Error state" 
            error 
            errorMessage="This field is required" 
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">Required with Error</p>
          <TextField 
            label="Required Error Input" 
            placeholder="Required with error" 
            required
            error 
            errorMessage="This field is required" 
          />
        </div>
      </div>
    </div>
  ),
};

// Icon examples
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Inputs with Icons</h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">With Start Icon</p>
          <TextField 
            label="Search" 
            placeholder="Search..." 
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">With End Icon</p>
          <TextField 
            label="Email" 
            placeholder="example@email.com" 
            type="email"
            endIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-[var(--foreground)]">With Both Icons</p>
          <TextField 
            label="Password" 
            placeholder="Enter password" 
            type="password"
            startIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            endIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
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
      <h3 className="text-lg font-medium text-[var(--foreground)]">Full Width Input</h3>
      <TextField 
        label="Full Width Input" 
        placeholder="This input takes up the full width" 
        fullWidth 
      />
    </div>
  ),
};

// Input types showcase
export const InputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Input Types</h3>
      <div className="flex flex-col gap-4">
        <TextField label="Text Input" placeholder="Regular text" type="text" />
        <TextField label="Email Input" placeholder="example@email.com" type="email" />
        <TextField label="Password Input" placeholder="Enter password" type="password" />
        <TextField label="Number Input" placeholder="123" type="number" />
        <TextField label="Tel Input" placeholder="(123) 456-7890" type="tel" />
        <TextField label="URL Input" placeholder="https://example.com" type="url" />
      </div>
    </div>
  ),
};

// Add a dedicated Required Fields story
export const RequiredFields: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md max-w-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Required Fields Example</h3>
      <div className="space-y-4">
        <TextField 
          label="Required Field (with asterisk)" 
          placeholder="This field is required"
          fullWidth 
          required
        />
        
        <TextField 
          label="Optional Field (no asterisk)" 
          placeholder="This field is optional"
          fullWidth 
        />
        
        <TextField 
          label="Required with Error" 
          placeholder="Required field with error"
          fullWidth 
          required
          error
          errorMessage="This field is required"
        />
      </div>
    </div>
  ),
};

// Form validation example - update the existing form to use required fields
export const FormValidation: Story = {
  render: () => {
    // Use a function component to enable hooks
    const FormValidationExample = () => {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
      });
      
      const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
      });
      
      const [formSubmitted, setFormSubmitted] = useState(false);
      
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
        
        // Clear error on change
        if (errors[name as keyof typeof errors]) {
          setErrors(prev => ({
            ...prev,
            [name]: '',
          }));
        }
      };
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        const newErrors = {
          name: formData.name ? '' : 'Name is required',
          email: formData.email ? (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) 
              ? '' 
              : 'Invalid email format'
          ) : 'Email is required',
          password: formData.password 
            ? (formData.password.length >= 8 ? '' : 'Password must be at least 8 characters')
            : 'Password is required',
        };
        
        setErrors(newErrors);
        
        const hasErrors = Object.values(newErrors).some(error => error);
        if (!hasErrors) {
          setFormSubmitted(true);
          // Form is valid, you would typically submit to a server here
        }
      };
      
      return (
        <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md max-w-lg">
          <h3 className="text-lg font-medium text-[var(--foreground)]">Form Validation Example</h3>
          
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField 
                label="Name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                errorMessage={errors.name}
                fullWidth
                required
              />
              
              <TextField 
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                errorMessage={errors.email}
                fullWidth
                required
                endIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <TextField 
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                errorMessage={errors.password}
                helperText="Password must be at least 8 characters"
                fullWidth
                required
                startIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              
              <div className="pt-2">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-md hover:bg-[var(--btn-primary-hover)]"
                >
                  Submit Form
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[var(--btn-secondary-bg)] p-4 rounded-md">
              <h4 className="font-medium text-[var(--foreground)] mb-2">Form Submitted Successfully!</h4>
              <p className="text-[var(--foreground)]">Thank you for your submission, {formData.name}.</p>
              <button 
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="mt-4 px-3 py-1 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] rounded-md text-sm hover:bg-[var(--btn-primary-hover)]"
              >
                Reset Form
              </button>
            </div>
          )}
        </div>
      );
    };
    
    return <FormValidationExample />;
  },
};

// Add a dedicated Error States story
export const ErrorStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4 bg-[var(--background)] rounded-md">
      <h3 className="text-lg font-medium text-[var(--foreground)]">Enhanced Error States</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Basic Error State</p>
            <TextField 
              label="Invalid Input" 
              placeholder="This field has an error" 
              error 
              errorMessage="This field is required" 
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Required Field with Error</p>
            <TextField 
              label="Required Field" 
              placeholder="Required field with error" 
              required
              error 
              errorMessage="This field cannot be empty" 
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Error with Focus State</p>
            <TextField 
              label="Focus on Error Field" 
              placeholder="Click on this field to see focus styling" 
              error 
              errorMessage="Focus styling with error state"
              autoFocus
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">With Helper Text and Error</p>
            <TextField 
              label="Password" 
              placeholder="Enter a strong password" 
              type="password"
              helperText="Password must be at least 8 characters"
              error
              errorMessage="Password is too weak"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">With Start Icon</p>
            <TextField 
              label="Search" 
              placeholder="Invalid search term" 
              error
              errorMessage="Search term must be at least 3 characters"
              startIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">With End Icon</p>
            <TextField 
              label="Email" 
              placeholder="example@invalid" 
              type="email"
              error
              errorMessage="Please enter a valid email address"
              endIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">With Automatic Error Icon</p>
            <TextField 
              label="Username" 
              placeholder="Enter username" 
              error
              errorMessage="Username already taken"
            />
          </div>
          
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Different Error Sizes</p>
            <div className="space-y-4">
              <TextField 
                label="Small Error" 
                placeholder="Small size error" 
                size="small"
                error
                errorMessage="Error in small size"
              />
              <TextField 
                label="Large Error" 
                placeholder="Large size error" 
                size="large"
                error
                errorMessage="Error in large size"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Different Variants with Error</p>
        <div className="grid md:grid-cols-3 gap-4">
          <TextField 
            label="Primary Variant" 
            placeholder="Error in primary variant" 
            variant="primary"
            error
            errorMessage="Error in primary variant"
          />
          <TextField 
            label="Secondary Variant" 
            placeholder="Error in secondary variant" 
            variant="secondary"
            error
            errorMessage="Error in secondary variant"
          />
          <TextField 
            label="Tertiary Variant" 
            placeholder="Error in tertiary variant" 
            variant="tertiary"
            error
            errorMessage="Error in tertiary variant"
          />
        </div>
      </div>
    </div>
  ),
}; 