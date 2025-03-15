import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dialog from './Dialog';
import Button from '../Button/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open or not',
    },
    onClose: {
      action: 'closed',
      description: 'Function called when the dialog should close',
    },
    title: {
      control: 'text',
      description: 'Title of the dialog',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the dialog',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show a close button in the header',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Whether clicking the backdrop should close the dialog',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Whether pressing the Escape key should close the dialog',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// Basic story with controls
export const Playground: Story = {
  args: {
    open: true,
    title: 'Dialog Title',
    size: 'medium',
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEsc: true,
    children: <p>This is the dialog content. You can put any React nodes here.</p>,
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => {
    const [openSmall, setOpenSmall] = useState(false);
    const [openMedium, setOpenMedium] = useState(false);
    const [openLarge, setOpenLarge] = useState(false);
    
    return (
      <div className="flex gap-4">
        <Button onClick={() => setOpenSmall(true)}>Small Dialog</Button>
        <Button onClick={() => setOpenMedium(true)}>Medium Dialog</Button>
        <Button onClick={() => setOpenLarge(true)}>Large Dialog</Button>
        
        <Dialog
          open={openSmall}
          onClose={() => setOpenSmall(false)}
          title="Small Dialog"
          size="small"
        >
          <p>This is a small dialog with minimal content.</p>
        </Dialog>
        
        <Dialog
          open={openMedium}
          onClose={() => setOpenMedium(false)}
          title="Medium Dialog"
          size="medium"
        >
          <p>This is a medium dialog with a reasonable amount of content.</p>
          <p>It's suitable for most use cases and forms that don't require too much space.</p>
        </Dialog>
        
        <Dialog
          open={openLarge}
          onClose={() => setOpenLarge(false)}
          title="Large Dialog"
          size="large"
        >
          <p>This is a large dialog intended for displaying lots of content.</p>
          <p>It's perfect for complex forms, detailed information, or any content that needs more space.</p>
          <p>You might use this for things like:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Detailed user profiles</li>
            <li>Settings panels with multiple sections</li>
            <li>Data tables or visualizations</li>
            <li>Multi-step forms</li>
          </ul>
        </Dialog>
      </div>
    );
  },
};

// With footer actions
export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog with Footer</Button>
        
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <p>Are you sure you want to perform this action?</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">This action cannot be undone.</p>
        </Dialog>
      </>
    );
  },
};

// Form in dialog
export const FormDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you'd handle form submission here
      setOpen(false);
    };
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
        
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Add New User"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="user-form">
                Save
              </Button>
            </div>
          }
        >
          <form id="user-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="admin">Administrator</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
            </div>
          </form>
        </Dialog>
      </>
    );
  },
};

// Multi-step dialog
export const MultiStepDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    
    const handleClose = () => {
      setOpen(false);
      // Reset step when dialog closes
      setTimeout(() => setStep(1), 300);
    };
    
    const handleNext = () => {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleClose();
      }
    };
    
    const handleBack = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Multi-Step Dialog</Button>
        
        <Dialog
          open={open}
          onClose={handleClose}
          title={`Step ${step} of ${totalSteps}`}
          footer={
            <div className="flex justify-between">
              <Button 
                variant="tertiary" 
                onClick={handleBack} 
                disabled={step === 1}
              >
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="tertiary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  {step === totalSteps ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          }
        >
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="newsletter"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Subscribe to newsletter
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review & Confirm</h3>
              <p className="mb-4">Please review your information before submitting.</p>
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm"><span className="font-medium">Name:</span> John Doe</p>
                <p className="text-sm"><span className="font-medium">Email:</span> john@example.com</p>
                <p className="text-sm"><span className="font-medium">Username:</span> johndoe</p>
                <p className="text-sm"><span className="font-medium">Newsletter:</span> Yes</p>
              </div>
            </div>
          )}
        </Dialog>
      </>
    );
  },
}; 