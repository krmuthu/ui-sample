import React from 'react';
import {
  Button,
  ButtonGroup,
  Avatar,
  Link,
  ThemeToggle,
  useTheme,
  version,
  getFormattedVersion,
  theme
} from 'clipper-ui';
import ThemeTest from './ThemeTest';

function App() {
  const formattedVersion = getFormattedVersion();
  const { theme: currentTheme } = useTheme();

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

export default App; 