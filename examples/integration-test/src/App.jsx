import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Avatar,
  Link,
  ThemeToggle,
  useTheme,
  getVersion,
  getFormattedVersion,
  theme,
  TextField,
  Radio,
  Checkbox,
  Switch,
  FormLabel,
  Dialog,
  DatePicker,
  TimePicker,
  DateTimePicker
} from 'clipper-ui';
import ThemeTest from './ThemeTest';
import dayjs from 'dayjs';

function App() {
  const version = getVersion()
  const formattedVersion = getFormattedVersion();
  const { theme: currentTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subscribeNews: true,
    notificationMethod: 'email',
    termsAgreed: false,
    darkMode: false,
    notifications: true,
    autoSave: false
  });
  const [errors, setErrors] = useState({});

  // Helper for displaying theme colors
  const ColorSwatch = ({ color, shade, value }) => (
    <div className="flex flex-col items-center mr-2 mb-2">
      <div 
        className="h-10 w-10 rounded-md mb-1" 
        style={{ backgroundColor: value }}
      />
      <span className="text-xs text-neutral-600 dark:text-neutral-400">{color}-{shade}</span>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSwitchChange = (name) => (e) => {
    setFormData({
      ...formData,
      [name]: e.target.checked
    });
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      notificationMethod: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            Clipper UI Integration Test
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {formattedVersion} 
            {version.commitHash && <span> (Commit: {version.commitHash})</span>}
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Theme Test Section */}
      <section className="mb-8">
        <ThemeTest />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Components Section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white col-span-1 md:col-span-2 mb-8">
          <h2 className="text-xl font-semibold mb-4">Form Components</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Text Fields</h3>
                <div className="space-y-4">
                  <TextField
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    errorMessage={errors.name}
                    required
                    fullWidth
                  />
                  
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    errorMessage={errors.email}
                    required
                    fullWidth
                    endIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Radio Buttons</h3>
                <FormLabel htmlFor="notification-method">Notification Method</FormLabel>
                <div className="space-y-2 mt-2">
                  <Radio
                    label="Email"
                    name="notificationMethod"
                    value="email"
                    checked={formData.notificationMethod === 'email'}
                    onChange={handleRadioChange}
                  />
                  
                  <Radio
                    label="SMS"
                    name="notificationMethod"
                    value="sms"
                    checked={formData.notificationMethod === 'sms'}
                    onChange={handleRadioChange}
                  />
                  
                  <Radio
                    label="Push Notification"
                    name="notificationMethod"
                    value="push"
                    checked={formData.notificationMethod === 'push'}
                    onChange={handleRadioChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Checkboxes</h3>
                <div className="space-y-2">
                  <Checkbox
                    label="Subscribe to newsletter"
                    name="subscribeNews"
                    checked={formData.subscribeNews}
                    onChange={handleInputChange}
                  />
                  
                  <Checkbox
                    label="I agree to the terms and conditions"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleInputChange}
                    error={!!errors.termsAgreed}
                    errorMessage={errors.termsAgreed}
                    required
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Switches</h3>
                <div className="space-y-4">
                  <Switch
                    label="Dark Mode"
                    checked={formData.darkMode}
                    onChange={handleSwitchChange('darkMode')}
                    helperText="Enable dark mode for the application"
                  />
                  
                  <Switch
                    label="Enable Notifications"
                    checked={formData.notifications}
                    onChange={handleSwitchChange('notifications')}
                    helperText="Receive notifications about updates"
                  />
                  
                  <Switch
                    label="Auto-save"
                    checked={formData.autoSave}
                    onChange={handleSwitchChange('autoSave')}
                    helperText="Automatically save your changes"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="primary" type="submit" fullWidth>
                  Submit Form
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2 mt-4 p-4 bg-gray-50 rounded-md dark:bg-gray-700">
              <h3 className="text-lg font-medium mb-2">Form Data</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </form>
        </section>

        {/* Theme section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Current Theme: {currentTheme}</h3>
            <ThemeToggle variant="icon" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Primary Colors</h3>
          <div className="flex flex-wrap mb-4">
            {Object.entries(theme.colors.primary).map(([shade, value]) => (
              <ColorSwatch key={shade} color="primary" shade={shade} value={value} />
            ))}
          </div>
          
          <h3 className="text-lg font-medium mb-2">Secondary Colors</h3>
          <div className="flex flex-wrap mb-4">
            {Object.entries(theme.colors.secondary).map(([shade, value]) => (
              <ColorSwatch key={shade} color="secondary" shade={shade} value={value} />
            ))}
          </div>
          
          <h3 className="text-lg font-medium mb-2">Semantic Colors</h3>
          <div className="flex flex-wrap">
            {['success', 'warning', 'error'].map(colorName => (
              <div key={colorName} className="mr-4 mb-4">
                <h4 className="text-sm font-medium capitalize mb-1">{colorName}</h4>
                <div className="flex flex-wrap">
                  {Object.entries(theme.colors[colorName])
                    .filter(([shade]) => ['400', '500', '600'].includes(shade))
                    .map(([shade, value]) => (
                      <ColorSwatch key={shade} color={colorName} shade={shade} value={value} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Button</h2>
          
          <h3 className="text-lg font-medium mb-2">Variants</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="primary">Primary</Button>
            <Button variant="primary-positive">Primary Positive</Button>
            <Button variant="primary-negative">Primary Negative</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="tertiary-negative">Tertiary Negative</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Legacy Variants</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Sizes</h3>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Button size="small" variant="primary">Small</Button>
            <Button size="standard" variant="primary">Medium</Button>
            <Button size="large" variant="primary">Large</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">States</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
          </div>
        </section>
        
        {/* ButtonGroup section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">ButtonGroup</h2>
          
          <h3 className="text-lg font-medium mb-2">Variants</h3>
          <div className="space-y-3 mb-4">
            <ButtonGroup variant="primary" className="mb-2">
              <Button>Primary Left</Button>
              <Button>Primary Middle</Button>
              <Button>Primary Right</Button>
            </ButtonGroup>
            
            <ButtonGroup variant="secondary" className="mb-2">
              <Button>Secondary Left</Button>
              <Button>Secondary Middle</Button>
              <Button>Secondary Right</Button>
            </ButtonGroup>
            
            <ButtonGroup variant="tertiary" className="mb-2">
              <Button>Tertiary Left</Button>
              <Button>Tertiary Middle</Button>
              <Button>Tertiary Right</Button>
            </ButtonGroup>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Orientation</h3>
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Horizontal (Default)</h4>
              <ButtonGroup variant="primary" className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Vertical</h4>
              <ButtonGroup variant="primary" orientation="vertical">
                <Button>Top</Button>
                <Button>Middle</Button>
                <Button>Bottom</Button>
              </ButtonGroup>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Connected Buttons</h3>
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Default Spacing</h4>
              <ButtonGroup variant="primary" className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Connected</h4>
              <ButtonGroup variant="primary" connected>
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Spacing Options</h3>
          <div className="space-y-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Compact</h4>
              <ButtonGroup variant="primary" spacing="compact" className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Default</h4>
              <ButtonGroup variant="primary" spacing="default" className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Loose</h4>
              <ButtonGroup variant="primary" spacing="loose">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Full Width & Alignment</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Left Aligned (Default)</h4>
              <ButtonGroup variant="primary" fullWidth className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Center Aligned</h4>
              <ButtonGroup variant="primary" fullWidth align="center" className="mb-2">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Right Aligned</h4>
              <ButtonGroup variant="primary" fullWidth align="right">
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>
        
        {/* Avatar section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Avatar</h2>
          
          <h3 className="text-lg font-medium mb-2">Image</h3>
          <div className="flex gap-2 mb-4">
            <Avatar 
              src="https://randomuser.me/api/portraits/women/17.jpg" 
              alt="Jane Doe" 
            />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Initials</h3>
          <div className="flex gap-2 mb-4">
            <Avatar initials="JD" />
            <Avatar name="John Doe" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Sizes</h3>
          <div className="flex items-center gap-2 mb-4">
            <Avatar size="xs" name="XS" />
            <Avatar size="small" name="SM" />
            <Avatar size="medium" name="MD" />
            <Avatar size="large" name="LG" />
            <Avatar size="xl" name="XL" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Shapes</h3>
          <div className="flex gap-2 mb-4">
            <Avatar shape="circle" name="Circle" />
            <Avatar shape="rounded" name="Rounded" />
            <Avatar shape="square" name="Square" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Status</h3>
          <div className="flex gap-2 mb-4">
            <Avatar status="online" name="Online" />
            <Avatar status="away" name="Away" />
            <Avatar status="busy" name="Busy" />
            <Avatar status="offline" name="Offline" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Border</h3>
          <div className="flex gap-2">
            <Avatar bordered name="Bordered" />
            <Avatar bordered status="online" name="Both" />
          </div>
        </section>
        
        {/* Link section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
          <h2 className="text-xl font-semibold mb-4">Link</h2>
          
          <div className="flex flex-col gap-2">
            <Link href="https://example.com">Default Link</Link>
            <Link href="https://example.com" target="_blank" rel="noopener noreferrer">External Link</Link>
            <Link href="#" onClick={(e) => e.preventDefault()}>Disabled Link</Link>
            <Link href="https://example.com" variant="primary">Primary Link</Link>
            <Link href="https://example.com" variant="secondary">Secondary Link</Link>
          </div>
        </section>

        {/* Dialog section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white col-span-1 md:col-span-2 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dialog</h2>
          <div className="flex flex-wrap gap-4">
            <DialogExample />
          </div>
        </section>

        {/* DatePicker section */}
        <section className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white col-span-1 md:col-span-2 mb-8">
          <h2 className="text-xl font-semibold mb-4">DatePicker</h2>
          <div className="flex flex-wrap gap-4">
            <DatePickerExample />
          </div>
        </section>
      </div>

      <footer className="mt-8 pt-6 border-t border-neutral-200 text-neutral-600 dark:text-neutral-400 dark:border-neutral-700">
        <p>
          This integration test app demonstrates that components from the Clipper UI library 
          are properly imported and working with the correct styling.
        </p>
        <p className="mt-2">
          <Link href="https://github.com/username/clipper-ui" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </Link>
        </p>
      </footer>
    </div>
  );
}

// Dialog Example Component
function DialogExample() {
  const [openBasic, setOpenBasic] = useState(false);
  const [openWithFooter, setOpenWithFooter] = useState(false);
  const [openLarge, setOpenLarge] = useState(false);
  
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setOpenBasic(true)}>Basic Dialog</Button>
        <Button onClick={() => setOpenWithFooter(true)}>Dialog with Footer</Button>
        <Button onClick={() => setOpenLarge(true)}>Large Dialog</Button>
      </div>
      
      {/* Basic Dialog */}
      <Dialog
        open={openBasic}
        onClose={() => setOpenBasic(false)}
        title="Basic Dialog"
      >
        <p>This is a basic dialog with a title and content.</p>
        <p className="mt-2">Click outside or the close button to dismiss.</p>
      </Dialog>
      
      {/* Dialog with Footer */}
      <Dialog
        open={openWithFooter}
        onClose={() => setOpenWithFooter(false)}
        title="Confirmation"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="tertiary" onClick={() => setOpenWithFooter(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpenWithFooter(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to proceed with this action?</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">This action cannot be undone.</p>
      </Dialog>
      
      {/* Large Dialog */}
      <Dialog
        open={openLarge}
        onClose={() => setOpenLarge(false)}
        title="Feature Overview"
        size="large"
      >
        <div className="space-y-4">
          <p>This dialog demonstrates a larger size option that&apos;s perfect for displaying more content.</p>
          
          <h3 className="text-lg font-medium">Key Features</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Responsive sizing with small, medium, and large options</li>
            <li>Backdrop click to close (can be disabled)</li>
            <li>ESC key to close (can be disabled)</li>
            <li>Optional footer area for actions</li>
            <li>Fully accessible with keyboard navigation</li>
            <li>Focus management for improved user experience</li>
            <li>Customizable with additional CSS classes</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4">Usage Examples</h3>
          <p>The Dialog component is perfect for:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirmation prompts</li>
            <li>Form inputs</li>
            <li>Detailed information display</li>
            <li>Multi-step processes</li>
            <li>Settings panels</li>
          </ul>
        </div>
      </Dialog>
    </>
  );
}

// DatePicker Example Component
function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  
  // Create date restrictions using dayjs
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, 'month').toDate();
  const oneMonthAhead = today.add(1, 'month').toDate();
  
  // Handle date selection with validation
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Handle time selection
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  
  // Handle datetime selection
  const handleDateTimeChange = (datetime) => {
    setSelectedDateTime(datetime);
  };
  
  // Handle start date change
  const handleStartDateChange = (date) => {
    setDateRange(prev => ({...prev, startDate: date}));
  };
  
  // Handle end date change
  const handleEndDateChange = (date) => {
    setDateRange(prev => ({...prev, endDate: date}));
  };
  
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Basic Date Picker</h3>
          <DatePicker
            label="Select a date"
            value={selectedDate}
            onChange={handleDateChange}
            helperText={selectedDate ? `You selected: ${dayjs(selectedDate).format('MM/DD/YYYY')}` : "Click to select a date"}
            displayFormat="MM/DD/YYYY"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Date Picker with Restrictions</h3>
          <DatePicker
            label="Select within range"
            minDate={oneMonthAgo}
            maxDate={oneMonthAhead}
            helperText={`Select a date between ${dayjs(oneMonthAgo).format('MM/DD/YYYY')} and ${dayjs(oneMonthAhead).format('MM/DD/YYYY')}`}
            displayFormat="MM/DD/YYYY"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Time Picker</h3>
          <TimePicker
            label="Select a time"
            value={selectedTime}
            onChange={handleTimeChange}
            helperText={selectedTime ? `You selected: ${dayjs(selectedTime).format('hh:mm A')}` : "Click to select a time"}
            format="12h"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Date Range Example</h3>
          <div className="space-y-4">
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
              maxDate={dateRange.endDate}
              helperText="Select the start date"
              displayFormat="MM/DD/YYYY"
            />
            
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
              minDate={dateRange.startDate}
              helperText="Select the end date"
              error={dateRange.startDate && dateRange.endDate && dayjs(dateRange.endDate).isBefore(dayjs(dateRange.startDate))}
              errorMessage="End date must be after start date"
              displayFormat="MM/DD/YYYY"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Date Time Picker</h3>
          <DateTimePicker
            label="Select date and time"
            value={selectedDateTime}
            onChange={handleDateTimeChange}
            helperText={selectedDateTime ? `You selected: ${dayjs(selectedDateTime).format('MM/DD/YYYY hh:mm A')}` : "Click to select date and time"}
            displayFormat="MM/DD/YYYY hh:mm A"
            timeFormat="12h"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Different Time Formats</h3>
          <div className="space-y-4">
            <TimePicker
              label="12-hour Format"
              format="12h"
              displayFormat="hh:mm A"
            />
            
            <TimePicker
              label="24-hour Format"
              format="24h"
              displayFormat="HH:mm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 