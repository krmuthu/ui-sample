import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Basic example with line variant
export const Basic: Story = {
  render: () => {
    const tabs = [
      {
        id: '1',
        label: 'Account',
        children: (
          <div className="prose">
            <h3>Account Settings</h3>
            <p>Manage your account preferences and settings.</p>
          </div>
        ),
      },
      {
        id: '2',
        label: 'Notifications',
        children: (
          <div className="prose">
            <h3>Notification Preferences</h3>
            <p>Configure how you want to receive notifications.</p>
          </div>
        ),
      },
      {
        id: '3',
        label: 'Security',
        children: (
          <div className="prose">
            <h3>Security Settings</h3>
            <p>Manage your security preferences and connected devices.</p>
          </div>
        ),
      },
    ];

    return (
      <div className="w-[600px]">
        <Tabs tabs={tabs} />
      </div>
    );
  },
};

// Example with icons
export const WithIcons: Story = {
  render: () => {
    const tabs = [
      {
        id: '1',
        label: 'Profile',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
        children: <div>Profile content</div>,
      },
      {
        id: '2',
        label: 'Settings',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        children: <div>Settings content</div>,
      },
    ];

    return (
      <div className="w-[600px]">
        <Tabs tabs={tabs} variant="enclosed" />
      </div>
    );
  },
};

// Example with different variants
export const Variants: Story = {
  render: () => {
    const tabs = [
      { id: '1', label: 'Tab 1', children: <div>Content 1</div> },
      { id: '2', label: 'Tab 2', children: <div>Content 2</div> },
      { id: '3', label: 'Tab 3', children: <div>Content 3</div> },
    ];

    return (
      <div className="w-[600px] space-y-8">
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Line (Default)</h3>
          <Tabs tabs={tabs} variant="line" />
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Enclosed</h3>
          <Tabs tabs={tabs} variant="enclosed" />
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Soft Rounded</h3>
          <Tabs tabs={tabs} variant="soft-rounded" />
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Solid Rounded</h3>
          <Tabs tabs={tabs} variant="solid-rounded" />
        </div>
      </div>
    );
  },
};

// Example with different sizes
export const Sizes: Story = {
  render: () => {
    const tabs = [
      { id: '1', label: 'Small Tab', children: <div>Content 1</div> },
      { id: '2', label: 'Small Tab', children: <div>Content 2</div> },
    ];

    return (
      <div className="w-[600px] space-y-8">
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Small</h3>
          <Tabs tabs={tabs} size="sm" />
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Medium (Default)</h3>
          <Tabs tabs={tabs} size="md" />
        </div>
        
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">Large</h3>
          <Tabs tabs={tabs} size="lg" />
        </div>
      </div>
    );
  },
};

// Example with disabled tabs
export const WithDisabledTabs: Story = {
  render: () => {
    const tabs = [
      { id: '1', label: 'Active', children: <div>Content 1</div> },
      { id: '2', label: 'Disabled', children: <div>Content 2</div>, disabled: true },
      { id: '3', label: 'Active', children: <div>Content 3</div> },
    ];

    return (
      <div className="w-[600px]">
        <Tabs tabs={tabs} />
      </div>
    );
  },
};

// Example with controlled mode
export const Controlled: Story = {
  render: () => {
    const ControlledTabs = () => {
      const [activeTab, setActiveTab] = useState('1');
      
      const tabs = [
        { id: '1', label: 'Tab 1', children: <div>Content 1</div> },
        { id: '2', label: 'Tab 2', children: <div>Content 2</div> },
        { id: '3', label: 'Tab 3', children: <div>Content 3</div> },
      ];
      
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-3 py-1 text-sm rounded
                  ${activeTab === tab.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                Activate {tab.label}
              </button>
            ))}
          </div>
          
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      );
    };

    return (
      <div className="w-[600px]">
        <ControlledTabs />
      </div>
    );
  },
};

// Example with fitted tabs
export const FittedTabs: Story = {
  render: () => {
    const tabs = [
      { id: '1', label: 'Tab 1', children: <div>Content 1</div> },
      { id: '2', label: 'Tab 2', children: <div>Content 2</div> },
      { id: '3', label: 'Tab 3', children: <div>Content 3</div> },
    ];

    return (
      <div className="w-[600px]">
        <Tabs tabs={tabs} isFitted />
      </div>
    );
  },
}; 