import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider, useToast } from './Toast';
import type { ToastProps } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  args: {
    id: 'default',
    title: 'Default Toast',
    message: 'This is a default toast message',
    variant: 'neutral',
    duration: 5000,
    dismissible: true,
    showProgress: false,
    size: 'medium',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const toast = useToast();

  const showBasicToast = () => {
    toast.show({
      title: 'Basic Toast',
      message: 'This is a basic toast notification',
      variant: 'neutral',
      duration: 3000,
    });
  };

  const showSuccessToast = () => {
    toast.show({
      title: 'Success!',
      message: 'Operation completed successfully',
      variant: 'success',
      duration: 4000,
    });
  };

  const showErrorToast = () => {
    toast.show({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      variant: 'error',
      duration: 5000,
    });
  };

  const showWarningToast = () => {
    toast.show({
      title: 'Warning',
      message: 'Please save your changes before leaving',
      variant: 'warning',
      duration: 4000,
    });
  };

  const showInfoToast = () => {
    toast.show({
      title: 'Info',
      message: 'New updates are available',
      variant: 'info',
      duration: 3000,
    });
  };

  const showCustomToast = () => {
    toast.show({
      title: 'Custom Action',
      message: 'This toast has a custom action button',
      variant: 'info',
      duration: 6000,
      action: {
        label: 'View Details',
        onClick: () => alert('Action clicked!'),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={showBasicToast}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Show Basic Toast
        </button>
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-200 rounded hover:bg-green-300"
        >
          Show Success Toast
        </button>
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-200 rounded hover:bg-red-300"
        >
          Show Error Toast
        </button>
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300"
        >
          Show Warning Toast
        </button>
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
        >
          Show Info Toast
        </button>
        <button
          onClick={showCustomToast}
          className="px-4 py-2 bg-purple-200 rounded hover:bg-purple-300"
        >
          Show Custom Action Toast
        </button>
      </div>
    </div>
  );
};

const PlacementDemo = () => {
  const toast = useToast();
  const placements = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-4">
      {placements.map((placement) => (
        <button
          key={placement}
          onClick={() =>
            toast.show({
              title: `${placement} Toast`,
              message: `This toast appears in the ${placement} position`,
              placement,
              variant: 'info',
              duration: 3000,
            })
          }
          className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
        >
          Show {placement} Toast
        </button>
      ))}
    </div>
  );
};

const SizesDemo = () => {
  const toast = useToast();
  const sizes = ['small', 'medium', 'large'] as const;

  return (
    <div className="flex gap-4">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() =>
            toast.show({
              title: `${size} Toast`,
              message: `This is a ${size} sized toast notification`,
              size,
              variant: 'info',
              duration: 3000,
            })
          }
          className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
        >
          Show {size} Toast
        </button>
      ))}
    </div>
  );
};

const ProgressDemo = () => {
  const toast = useToast();
  const durations = [3000, 5000, 10000];

  return (
    <div className="flex gap-4">
      {durations.map((duration) => (
        <button
          key={duration}
          onClick={() =>
            toast.show({
              title: `Progress Toast`,
              message: `This toast will close in ${duration / 1000}s`,
              variant: 'info',
              duration,
              showProgress: true,
            })
          }
          className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300"
        >
          {duration / 1000}s Toast
        </button>
      ))}
    </div>
  );
};

export const Basic: Story = {
  render: () => <ToastDemo />,
};

export const Placement: Story = {
  render: () => <PlacementDemo />,
};

export const Sizes: Story = {
  render: () => <SizesDemo />,
};

export const WithProgress: Story = {
  render: () => <ProgressDemo />,
}; 