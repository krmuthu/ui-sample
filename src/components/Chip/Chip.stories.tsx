import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Chip, ChipVariant, ChipSize, ChipColor } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Basic usage
export const Basic: Story = {
  args: {
    label: 'Chip',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Filled" variant="filled" />
      <Chip label="Outlined" variant="outlined" />
      <Chip label="Soft" variant="soft" />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip label="Small" size="sm" />
      <Chip label="Medium" size="md" />
      <Chip label="Large" size="lg" />
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Chip label="Primary" color="primary" />
        <Chip label="Secondary" color="secondary" />
        <Chip label="Success" color="success" />
        <Chip label="Danger" color="danger" />
        <Chip label="Warning" color="warning" />
        <Chip label="Info" color="info" />
        <Chip label="Neutral" color="neutral" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Chip label="Primary" color="primary" variant="outlined" />
        <Chip label="Secondary" color="secondary" variant="outlined" />
        <Chip label="Success" color="success" variant="outlined" />
        <Chip label="Danger" color="danger" variant="outlined" />
        <Chip label="Warning" color="warning" variant="outlined" />
        <Chip label="Info" color="info" variant="outlined" />
        <Chip label="Neutral" color="neutral" variant="outlined" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Chip label="Primary" color="primary" variant="soft" />
        <Chip label="Secondary" color="secondary" variant="soft" />
        <Chip label="Success" color="success" variant="soft" />
        <Chip label="Danger" color="danger" variant="soft" />
        <Chip label="Warning" color="warning" variant="soft" />
        <Chip label="Info" color="info" variant="soft" />
        <Chip label="Neutral" color="neutral" variant="soft" />
      </div>
    </div>
  ),
};

// With Icon
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip 
        label="User" 
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        } 
      />
      
      <Chip 
        label="Settings" 
        color="secondary"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        variant="outlined"
      />
      
      <Chip 
        label="Info" 
        color="info"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        variant="soft"
      />
    </div>
  ),
};

// Removable
export const Removable: Story = {
  render: () => {
    const [chips, setChips] = React.useState([
      { id: 1, label: 'React', color: 'primary' as ChipColor },
      { id: 2, label: 'Vue', color: 'success' as ChipColor },
      { id: 3, label: 'Angular', color: 'danger' as ChipColor },
      { id: 4, label: 'Svelte', color: 'warning' as ChipColor },
    ]);
    
    const handleRemove = (id: number) => {
      setChips(chips.filter(chip => chip.id !== id));
    };
    
    return (
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => (
          <Chip
            key={chip.id}
            label={chip.label}
            color={chip.color}
            removable
            onRemove={() => handleRemove(chip.id)}
          />
        ))}
        {chips.length === 0 && (
          <div className="text-gray-500">All chips have been removed</div>
        )}
      </div>
    );
  },
};

// Interactive
export const Interactive: Story = {
  render: () => {
    const [selectedChips, setSelectedChips] = React.useState<Record<string, boolean>>({
      react: true,
      vue: false,
      angular: false,
      svelte: false,
    });
    
    const handleToggle = (chip: string) => {
      setSelectedChips({
        ...selectedChips,
        [chip]: !selectedChips[chip],
      });
    };
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Chip
            label="React"
            color="primary"
            variant={selectedChips.react ? 'filled' : 'outlined'}
            interactive
            onClick={() => handleToggle('react')}
          />
          <Chip
            label="Vue"
            color="success"
            variant={selectedChips.vue ? 'filled' : 'outlined'}
            interactive
            onClick={() => handleToggle('vue')}
          />
          <Chip
            label="Angular"
            color="danger"
            variant={selectedChips.angular ? 'filled' : 'outlined'}
            interactive
            onClick={() => handleToggle('angular')}
          />
          <Chip
            label="Svelte"
            color="warning"
            variant={selectedChips.svelte ? 'filled' : 'outlined'}
            interactive
            onClick={() => handleToggle('svelte')}
          />
        </div>
        
        <div className="text-sm text-gray-700">
          Selected frameworks: {' '}
          {Object.entries(selectedChips)
            .filter(([, selected]) => selected)
            .map(([name]) => name)
            .join(', ') || 'None'}
        </div>
      </div>
    );
  },
};

// With long content
export const LongContent: Story = {
  render: () => (
    <div className="max-w-xs">
      <Chip label="This is a very long chip text that will be truncated" />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Disabled" disabled />
      <Chip label="Disabled" variant="outlined" disabled />
      <Chip label="Disabled" variant="soft" disabled />
      <Chip 
        label="Disabled" 
        removable 
        onRemove={() => alert('This should not trigger')}
        disabled 
      />
      <Chip 
        label="Disabled" 
        interactive 
        onClick={() => alert('This should not trigger')}
        disabled 
      />
    </div>
  ),
};

// Chip Group Example
export const ChipGroup: Story = {
  render: () => {
    const categories = [
      'All',
      'Technology',
      'Design',
      'Marketing',
      'Business',
      'Lifestyle',
    ];
    
    const [activeCategory, setActiveCategory] = React.useState('All');
    
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Filter by category:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={activeCategory === category ? 'filled' : 'soft'}
              color={activeCategory === category ? 'primary' : 'neutral'}
              interactive
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// All Combinations
export const AllCombinations: Story = {
  render: () => {
    const variants: ChipVariant[] = ['filled', 'outlined', 'soft'];
    const sizes: ChipSize[] = ['sm', 'md', 'lg'];
    const colors: ChipColor[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral'];
    
    return (
      <div className="space-y-8">
        {variants.map(variant => (
          <div key={variant} className="space-y-4">
            <h3 className="text-lg font-medium capitalize">{variant}</h3>
            {sizes.map(size => (
              <div key={size} className="space-y-2">
                <div className="text-sm text-gray-500 capitalize">{size}</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <Chip
                      key={color}
                      label={color}
                      variant={variant}
                      size={size}
                      color={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
}; 