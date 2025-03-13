import React from 'react';
import {
  Button,
  ButtonGroup,
  Avatar,
  Link,
  version,
  getFormattedVersion,
  theme
} from 'clipper-ui';

function App() {
  const formattedVersion = getFormattedVersion();

  // Helper for displaying theme colors
  const ColorSwatch = ({ color, shade, value }) => (
    <div className="flex flex-col items-center mr-2 mb-2">
      <div 
        className="h-10 w-10 rounded-md mb-1" 
        style={{ backgroundColor: value }}
      />
      <span className="text-xs text-neutral-600">{color}-{shade}</span>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Clipper UI Integration Test
        </h1>
        <p className="text-neutral-600">
          {formattedVersion} 
          {version.commitHash && <span> (Commit: {version.commitHash})</span>}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Theme</h2>
          
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
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Button</h2>
          
          <h3 className="text-lg font-medium mb-2">Variants</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="error">Error</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Sizes</h3>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
          
          <h3 className="text-lg font-medium mb-2">States</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </section>
        
        {/* ButtonGroup section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">ButtonGroup</h2>
          
          <h3 className="text-lg font-medium mb-2">Horizontal</h3>
          <ButtonGroup className="mb-4">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
          
          <h3 className="text-lg font-medium mb-2">Vertical</h3>
          <ButtonGroup direction="vertical" className="mb-4">
            <Button>Top</Button>
            <Button>Middle</Button>
            <Button>Bottom</Button>
          </ButtonGroup>
          
          <h3 className="text-lg font-medium mb-2">Connected</h3>
          <ButtonGroup connected className="mb-4">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
          
          <h3 className="text-lg font-medium mb-2">Full Width</h3>
          <ButtonGroup fullWidth>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
        </section>
        
        {/* Avatar section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
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
        <section className="bg-white p-6 rounded-lg shadow-md">
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

      <footer className="mt-8 pt-6 border-t border-neutral-200 text-neutral-600">
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