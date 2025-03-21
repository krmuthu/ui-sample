import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Dialog"
        size="medium"
      >
        <div className="space-y-4">
          <p>This is an example dialog with some content.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>Confirm</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const Default: Story = {
  render: () => <DialogDemo />,
};

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Dialog with Footer</Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Dialog with Footer"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Confirm</Button>
            </div>
          }
        >
          <p>This dialog uses the footer prop for action buttons.</p>
        </Dialog>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={() => setSize('small')}>Small</Button>
          <Button onClick={() => setSize('medium')}>Medium</Button>
          <Button onClick={() => setSize('large')}>Large</Button>
        </div>
        <Button onClick={() => setIsOpen(true)}>Open {size} Dialog</Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title={`${size.charAt(0).toUpperCase() + size.slice(1)} Dialog`}
          size={size}
        >
          <p>This is a {size} sized dialog.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Dialog Without Close Button</Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="No Close Button"
          showCloseButton={false}
        >
          <p>This dialog does not have a close button in the header.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  },
};

export const WithRichContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Rich Content Dialog</Button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Rich Content Dialog"
          size="large"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Section 1</h3>
              <p>This is a section with some rich content.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Section 2</h3>
              <p>Another section with different content.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Section 3</h3>
              <p>One more section to demonstrate scrolling.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  },
}; 