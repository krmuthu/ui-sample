import React, { useState } from 'react';
// Individual imports for components
import { Button } from '../../src/components/Button';
import Dialog from '../../src/components/Dialog';
import { Icon } from '../../src/components/Icon';

const IntegrationDemo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Component Library Integration</h1>
        
        {/* Icon Examples */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Icon icon="settings" size="md" />
            <span>Icon Examples</span>
          </h2>
          
          <div className="grid grid-cols-4 gap-4">
            <Icon icon="close" aria-label="Close" />
            <Icon icon="user" aria-label="User" color="blue-500" />
            <Icon icon="settings" aria-label="Settings" animation="spin" />
            <Icon icon="check" aria-label="Check" color="green-500" />
            <Icon icon="search" aria-label="Search" />
            <Icon icon="edit" aria-label="Edit" color="blue-500" />
            <Icon icon="trash" aria-label="Delete" color="red-500" />
            <Icon icon="plus" aria-label="Add" color="green-500" />
          </div>
        </div>
        
        {/* Button Examples */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Button Examples</h2>
          
          <div className="flex gap-4">
            <Button
              variant="primary"
              startIcon={<Icon icon="trash" size="sm" />}
              onClick={() => setIsDialogOpen(true)}
            >
              Open Dialog
            </Button>
            
            <Button
              variant="secondary"
              startIcon={<Icon icon="settings" size="sm" />}
            >
              Settings
            </Button>
            
            <Button
              variant="tertiary"
              startIcon={<Icon icon="plus" size="sm" />}
            >
              Add Item
            </Button>
          </div>
        </div>
        
        {/* Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Confirm Action"
        >
          <div className="p-4">
            <p>Are you sure you want to proceed?</p>
          </div>
          <Dialog.Footer>
            <Button 
              variant="tertiary" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              startIcon={<Icon icon="check" size="sm" />}
              onClick={() => setIsDialogOpen(false)}
            >
              Confirm
            </Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    </div>
  );
};

export default IntegrationDemo; 