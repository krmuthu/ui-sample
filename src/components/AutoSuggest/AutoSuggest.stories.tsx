import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AutoSuggest, AutoSuggestOption } from './AutoSuggest';

const meta: Meta<typeof AutoSuggest> = {
  title: 'Components/AutoSuggest',
  component: AutoSuggest,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AutoSuggest>;

// Sample data
const countries: AutoSuggestOption[] = [
  { id: 'us', label: 'United States' },
  { id: 'ca', label: 'Canada' },
  { id: 'mx', label: 'Mexico' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'fr', label: 'France' },
  { id: 'de', label: 'Germany' },
  { id: 'it', label: 'Italy' },
  { id: 'es', label: 'Spain' },
  { id: 'jp', label: 'Japan' },
  { id: 'cn', label: 'China' },
  { id: 'in', label: 'India' },
  { id: 'br', label: 'Brazil' },
  { id: 'au', label: 'Australia' },
  { id: 'nz', label: 'New Zealand' },
  { id: 'za', label: 'South Africa' },
];

// Basic example with controlled state
const BasicExample = () => {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutoSuggestOption | null>(null);
  
  return (
    <div className="w-96 space-y-4">
      <AutoSuggest
        options={countries.filter(country => 
          country.label.toLowerCase().includes(value.toLowerCase())
        )}
        value={value}
        onChange={setValue}
        onSelect={option => {
          setSelectedOption(option);
          console.log('Selected:', option);
        }}
        placeholder="Search countries..."
      />
      
      {selectedOption && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
          Selected: {selectedOption.label} ({selectedOption.id})
        </div>
      )}
    </div>
  );
};

// Example with async data fetching
const AsyncExample = () => {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutoSuggestOption | null>(null);
  
  // Simulated API call with artificial delay
  const fetchSuggestions = async (query: string): Promise<AutoSuggestOption[]> => {
    // Add artificial delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query) return [];
    
    return countries.filter(country => 
      country.label.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return (
    <div className="w-96 space-y-4">
      <AutoSuggest
        options={[]}
        value={value}
        onChange={setValue}
        onFetchSuggestions={fetchSuggestions}
        onSelect={option => {
          setSelectedOption(option);
          console.log('Selected:', option);
        }}
        placeholder="Search countries..."
        debounceDelay={300}
      />
      
      {selectedOption && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
          Selected: {selectedOption.label} ({selectedOption.id})
        </div>
      )}
    </div>
  );
};

// Example with custom rendering
const CustomRenderingExample = () => {
  const [value, setValue] = useState('');
  
  const countriesWithFlags: AutoSuggestOption[] = countries.map(country => ({
    ...country,
    data: {
      flag: `https://catamphetamine.gitlab.io/country-flag-icons/3x2/${String(country.id).toUpperCase()}.svg`,
    },
  }));
  
  const renderOption = (option: AutoSuggestOption, isHighlighted: boolean) => (
    <div className={`flex items-center gap-2 ${isHighlighted ? 'font-medium' : ''}`}>
      <img 
        src={option.data?.flag as string} 
        alt={`Flag of ${option.label}`} 
        className="w-6 h-4 object-cover"
      />
      <span>{option.label}</span>
    </div>
  );
  
  return (
    <div className="w-96">
      <AutoSuggest
        options={countriesWithFlags.filter(country => 
          country.label.toLowerCase().includes(value.toLowerCase())
        )}
        value={value}
        onChange={setValue}
        onSelect={option => console.log('Selected:', option)}
        placeholder="Search countries..."
        renderOption={renderOption}
      />
    </div>
  );
};

// Example with an icon
const WithIconExample = () => {
  const [value, setValue] = useState('');
  
  const searchIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
  
  return (
    <div className="w-96">
      <AutoSuggest
        options={countries.filter(country => 
          country.label.toLowerCase().includes(value.toLowerCase())
        )}
        value={value}
        onChange={setValue}
        onSelect={option => console.log('Selected:', option)}
        placeholder="Search countries..."
        icon={searchIcon}
      />
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const AsyncData: Story = {
  render: () => <AsyncExample />,
};

export const CustomRendering: Story = {
  render: () => <CustomRenderingExample />,
};

export const WithIcon: Story = {
  render: () => <WithIconExample />,
};

export const Disabled: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSelect: () => {},
    options: countries,
    placeholder: 'This field is disabled',
    disabled: true,
  },
};

export const WithClearOnSelect: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [selections, setSelections] = useState<AutoSuggestOption[]>([]);
    
    return (
      <div className="w-96 space-y-4">
        <AutoSuggest
          options={countries.filter(country => 
            country.label.toLowerCase().includes(value.toLowerCase())
          )}
          value={value}
          onChange={setValue}
          onSelect={option => {
            setSelections(prev => [...prev, option]);
          }}
          placeholder="Add countries..."
          clearOnSelect={true}
        />
        
        <div className="p-3 bg-gray-50 rounded-md max-h-40 overflow-auto">
          <h3 className="font-medium mb-2">Selected Countries:</h3>
          {selections.length === 0 ? (
            <p className="text-gray-500 text-sm">No countries selected</p>
          ) : (
            <ul className="space-y-1">
              {selections.map((option, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>{option.label}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setSelections(prev => prev.filter((_, i) => i !== index))}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  },
}; 