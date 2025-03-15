import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Components/Switch',
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
type Story = StoryObj<typeof Switch>;

/**
 * Default switch with a label
 */
export const Default: Story = {
  args: {
    label: 'Default Switch',
  },
};

/**
 * A switch in checked (on) state
 */
export const Checked: Story = {
  args: {
    label: 'Switch is On',
    checked: true,
  },
};

/**
 * A switch with different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Switch size="small" label="Small Switch" />
      <Switch size="medium" label="Medium Switch" />
      <Switch size="large" label="Large Switch" />
    </div>
  ),
};

/**
 * Different color variants of the switch
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Switch variant="primary" label="Primary Switch" checked />
      <Switch variant="secondary" label="Secondary Switch" checked />
      <Switch variant="tertiary" label="Tertiary Switch" checked />
    </div>
  ),
};

/**
 * Different states that a switch can be in
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Switch label="Normal Switch (Off)" />
      <Switch label="Normal Switch (On)" checked />
      <Switch label="Disabled Switch (Off)" disabled />
      <Switch label="Disabled Switch (On)" disabled checked />
      <Switch label="With Helper Text" helperText="This is a helpful message" />
    </div>
  ),
};

/**
 * A switch with the label at different positions
 */
export const LabelPlacement: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <Switch label="Label at the end (default)" labelPlacement="end" />
      <Switch label="Label at the start" labelPlacement="start" />
    </div>
  ),
};

/**
 * A required switch with an asterisk
 */
export const Required: Story = {
  args: {
    label: 'Required Switch',
    required: true,
  },
};

/**
 * An interactive example showing a controlled switch
 */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    
    return (
      <div className="flex flex-col space-y-4">
        <Switch 
          label={`Switch is ${checked ? 'ON' : 'OFF'}`} 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-gray-600">
          Click the switch to toggle its state
        </p>
      </div>
    );
  },
};

/**
 * Example usage in form context
 */
export const FormExample: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      sounds: true,
    });
    
    const handleChange = (setting: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        [setting]: e.target.checked,
      });
    };
    
    return (
      <div className="space-y-8">
        <div className="border p-4 rounded">
          <h3 className="text-lg font-medium mb-4">User Settings</h3>
          <div className="space-y-4">
            <Switch 
              label="Enable Notifications" 
              checked={settings.notifications}
              onChange={handleChange('notifications')}
              helperText="Receive alerts and updates"
            />
            <Switch 
              label="Dark Mode" 
              checked={settings.darkMode}
              onChange={handleChange('darkMode')}
              helperText="Use dark theme for the interface"
            />
            <Switch 
              label="Enable Sounds" 
              checked={settings.sounds}
              onChange={handleChange('sounds')}
              helperText="Play sounds for events and alerts"
            />
          </div>
        </div>
        
        <div className="text-sm border p-2 rounded bg-gray-50">
          <pre>{JSON.stringify(settings, null, 2)}</pre>
        </div>
      </div>
    );
  },
}; 