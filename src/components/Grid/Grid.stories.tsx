import React, { useState } from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Container, Row, Col, Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Placeholder Box component for demonstrations
const Box = ({ children, color = 'blue' }: { children?: React.ReactNode; color?: string }) => {
  const bgColor = `bg-${color}-100`;
  return (
    <div className={`${bgColor} p-4 rounded border border-${color}-300 h-full flex items-center justify-center`}>
      {children}
    </div>
  );
};

export const BasicGrid: Story = {
  render: () => (
    <Container>
      <Row>
        <Col width={6}>
          <Box>Column 1 (width 6)</Box>
        </Col>
        <Col width={6}>
          <Box>Column 2 (width 6)</Box>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col width={4}>
          <Box>Column 1 (width 4)</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2 (width 4)</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3 (width 4)</Box>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col width={3}>
          <Box>Col (3)</Box>
        </Col>
        <Col width={3}>
          <Box>Col (3)</Box>
        </Col>
        <Col width={3}>
          <Box>Col (3)</Box>
        </Col>
        <Col width={3}>
          <Box>Col (3)</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Resize the window to see columns adjust at different breakpoints</p>
      <Row>
        <Col width={12} md={6} lg={4}>
          <Box>width=12 md=6 lg=4</Box>
        </Col>
        <Col width={12} md={6} lg={4}>
          <Box>width=12 md=6 lg=4</Box>
        </Col>
        <Col width={12} md={12} lg={4}>
          <Box>width=12 md=12 lg=4</Box>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col width={6} sm={6} md={3}>
          <Box>width=6 sm=6 md=3</Box>
        </Col>
        <Col width={6} sm={6} md={3}>
          <Box>width=6 sm=6 md=3</Box>
        </Col>
        <Col width={6} sm={6} md={3}>
          <Box>width=6 sm=6 md=3</Box>
        </Col>
        <Col width={6} sm={6} md={3}>
          <Box>width=6 sm=6 md=3</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Grid with gap=2 (0.5rem)</p>
      <Row gap={2}>
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
      
      <p className="mt-6 mb-2 text-sm text-gray-600">Grid with gap=4 (1rem)</p>
      <Row gap={4}>
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
      
      <p className="mt-6 mb-2 text-sm text-gray-600">Grid with gap=8 (2rem)</p>
      <Row gap={8}>
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Horizontal alignment: justify="start" (default)</p>
      <Row className="min-h-[100px] bg-gray-100 mb-6">
        <Col width={3}>
          <Box>Column 1</Box>
        </Col>
        <Col width={3}>
          <Box>Column 2</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Horizontal alignment: justify="center"</p>
      <Row justify="center" className="min-h-[100px] bg-gray-100 mb-6">
        <Col width={3}>
          <Box>Column 1</Box>
        </Col>
        <Col width={3}>
          <Box>Column 2</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Horizontal alignment: justify="end"</p>
      <Row justify="end" className="min-h-[100px] bg-gray-100 mb-6">
        <Col width={3}>
          <Box>Column 1</Box>
        </Col>
        <Col width={3}>
          <Box>Column 2</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Horizontal alignment: justify="between"</p>
      <Row justify="between" className="min-h-[100px] bg-gray-100 mb-6">
        <Col width={3}>
          <Box>Column 1</Box>
        </Col>
        <Col width={3}>
          <Box>Column 2</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Vertical alignment: align="start"</p>
      <Row align="start" className="min-h-[150px] bg-gray-100 mb-6">
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Height<br/>is<br/>taller</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Vertical alignment: align="center"</p>
      <Row align="center" className="min-h-[150px] bg-gray-100 mb-6">
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Height<br/>is<br/>taller</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
      
      <p className="mb-2 text-sm text-gray-600">Vertical alignment: align="end"</p>
      <Row align="end" className="min-h-[150px] bg-gray-100 mb-6">
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Height<br/>is<br/>taller</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const Offset: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Column with offset</p>
      <Row>
        <Col width={6}>
          <Box>Width 6, no offset</Box>
        </Col>
        <Col width={6}>
          <Box>Width 6, no offset</Box>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col width={6} offset={3}>
          <Box>Width 6, offset 3</Box>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col width={3}>
          <Box>Width 3</Box>
        </Col>
        <Col width={3} offset={1}>
          <Box>Width 3, offset 1</Box>
        </Col>
        <Col width={3} offset={2}>
          <Box>Width 3, offset 2</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const Order: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Column with order (visual reordering)</p>
      <Row>
        <Col width={4} order={3}>
          <Box>Visual Order 3</Box>
        </Col>
        <Col width={4} order={1}>
          <Box>Visual Order 1</Box>
        </Col>
        <Col width={4} order={2}>
          <Box>Visual Order 2</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const ReversedRow: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Normal Row</p>
      <Row>
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
      
      <p className="mt-6 mb-2 text-sm text-gray-600">Reversed Row</p>
      <Row reverse>
        <Col width={4}>
          <Box>Column 1</Box>
        </Col>
        <Col width={4}>
          <Box>Column 2</Box>
        </Col>
        <Col width={4}>
          <Box>Column 3</Box>
        </Col>
      </Row>
    </Container>
  ),
};

export const NoWrap: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Row with wrap=false (no wrapping)</p>
      <div className="overflow-auto">
        <Row wrap={false} className="min-w-[800px]">
          {[...Array(8)].map((_, i) => (
            <Col key={i} width={3}>
              <Box>Column {i + 1}</Box>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  ),
};

export const NestedGrid: Story = {
  render: () => (
    <Container>
      <p className="mb-2 text-sm text-gray-600">Nested grid layout</p>
      <Row>
        <Col width={6}>
          <Box>Main content</Box>
        </Col>
        <Col width={6}>
          <Row>
            <Col width={12}>
              <Box color="green">Nested row 1</Box>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col width={6}>
              <Box color="green">Nested col 1</Box>
            </Col>
            <Col width={6}>
              <Box color="green">Nested col 2</Box>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  ),
};

export const ComplexForm: Story = {
  render: () => (
    <Container>
      <form className="p-4 border rounded">
        <h3 className="text-lg font-bold mb-4">Registration Form</h3>
        
        <Row gap={4}>
          <Col width={12} md={6}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </Col>
          <Col width={12} md={6}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </Col>
        </Row>
        
        <Row gap={4}>
          <Col width={12}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input type="email" className="w-full p-2 border rounded" />
            </div>
          </Col>
        </Row>
        
        <Row gap={4}>
          <Col width={12} md={6}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" className="w-full p-2 border rounded" />
            </div>
          </Col>
          <Col width={12} md={6}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" className="w-full p-2 border rounded" />
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col width={12}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea className="w-full p-2 border rounded" rows={3}></textarea>
            </div>
          </Col>
        </Row>
        
        <Row gap={4}>
          <Col width={12} sm={6} md={4}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </Col>
          <Col width={12} sm={6} md={4}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">State</label>
              <select className="w-full p-2 border rounded">
                <option>Select State</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
              </select>
            </div>
          </Col>
          <Col width={12} md={4}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col width={12}>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Register
            </button>
          </Col>
        </Row>
      </form>
    </Container>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <Container fluid className="min-h-[600px]">
      <Row className="h-full">
        {/* Sidebar */}
        <Col width={12} md={3} lg={2} className="bg-gray-800 text-white p-4">
          <h3 className="font-bold text-xl mb-4">Dashboard</h3>
          <ul>
            <li className="mb-2 p-2 bg-gray-700 rounded">Home</li>
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Analytics</li>
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Reports</li>
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Users</li>
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Settings</li>
          </ul>
        </Col>
        
        {/* Main Content */}
        <Col width={12} md={9} lg={10} className="p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
          
          <Row gap={4}>
            {/* Stat Cards */}
            <Col width={12} sm={6} lg={3}>
              <div className="p-4 bg-blue-100 border border-blue-300 rounded">
                <h3 className="font-bold">Total Users</h3>
                <p className="text-2xl">1,245</p>
              </div>
            </Col>
            <Col width={12} sm={6} lg={3}>
              <div className="p-4 bg-green-100 border border-green-300 rounded">
                <h3 className="font-bold">Revenue</h3>
                <p className="text-2xl">$12,345</p>
              </div>
            </Col>
            <Col width={12} sm={6} lg={3}>
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                <h3 className="font-bold">Conversion</h3>
                <p className="text-2xl">12.3%</p>
              </div>
            </Col>
            <Col width={12} sm={6} lg={3}>
              <div className="p-4 bg-purple-100 border border-purple-300 rounded">
                <h3 className="font-bold">Active</h3>
                <p className="text-2xl">324</p>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-6" gap={4}>
            <Col width={12} lg={8}>
              <div className="p-4 bg-white border rounded">
                <h3 className="font-bold mb-2">Performance Chart</h3>
                <div className="h-[300px] bg-gray-100 flex items-center justify-center">
                  Chart Placeholder
                </div>
              </div>
            </Col>
            <Col width={12} lg={4}>
              <div className="p-4 bg-white border rounded">
                <h3 className="font-bold mb-2">Recent Activities</h3>
                <div className="h-[300px] overflow-auto">
                  <div className="p-2 border-b">User John signed up</div>
                  <div className="p-2 border-b">New order #1234 received</div>
                  <div className="p-2 border-b">Payment processed for order #1123</div>
                  <div className="p-2 border-b">Product inventory updated</div>
                  <div className="p-2 border-b">Support ticket #563 closed</div>
                  <div className="p-2 border-b">System update completed</div>
                  <div className="p-2 border-b">Server maintenance scheduled</div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  ),
};

// Using Grid component instead of Container/Row/Col
export const UsingGridComponent: Story = {
  render: () => (
    <Grid container>
      <p className="mb-2 text-sm text-gray-600">Using the Grid component directly</p>
      <Grid container gap={2}>
        <Grid item width={6}>
          <Box>Grid item (width 6)</Box>
        </Grid>
        <Grid item width={6}>
          <Box>Grid item (width 6)</Box>
        </Grid>
        <Grid item width={4}>
          <Box>Grid item (width 4)</Box>
        </Grid>
        <Grid item width={4}>
          <Box>Grid item (width 4)</Box>
        </Grid>
        <Grid item width={4}>
          <Box>Grid item (width 4)</Box>
        </Grid>
      </Grid>
    </Grid>
  ),
};

export const GridAsContainer: Story = {
  render: () => (
    <div className="bg-gray-200 p-4">
      <p className="mb-2 text-sm text-gray-600">Normal div (full width)</p>
      <div className="bg-white p-4 mb-4">Full width content</div>
      
      <p className="mb-2 text-sm text-gray-600">Container (fixed max width, centered)</p>
      <Container className="bg-white p-4 mb-4">
        Contained content with max width
      </Container>
      
      <p className="mb-2 text-sm text-gray-600">Container fluid (full width, with padding)</p>
      <Container fluid className="bg-white p-4">
        Full width contained content with padding
      </Container>
    </div>
  ),
};

// Add new stories for auto-layout features

export const AutoLayoutGrid: Story = {
  render: () => (
    <Container>
      <h2 className="text-lg font-medium mb-4">Grid with Auto-Layout</h2>
      <p className="mb-4 text-sm text-gray-600">
        Auto-layout grids automatically adjust the number of columns based on available space.
        Resize the browser window to see how the layout responds.
      </p>
      
      <p className="mb-2 text-sm text-gray-600 font-medium">Auto-Fit Layout</p>
      <p className="mb-2 text-sm text-gray-500">
        Creates responsive columns that expand to fill available space
      </p>
      <Grid 
        autoLayout="auto-fit"
        minColumnWidth="150px"
        gap={4}
        className="mb-8"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Box key={i}>Item {i + 1}</Box>
        ))}
      </Grid>
      
      <p className="mb-2 text-sm text-gray-600 font-medium">Auto-Fill Layout</p>
      <p className="mb-2 text-sm text-gray-500">
        Creates as many columns as can fit, preserving empty tracks
      </p>
      <Grid 
        autoLayout="auto-fill"
        minColumnWidth="150px"
        gap={4}
        className="mb-8"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Box key={i} color="green">Item {i + 1}</Box>
        ))}
      </Grid>
      
      <p className="mb-2 text-sm text-gray-600 font-medium">Auto-Fit with Constrained Max Column Width</p>
      <p className="mb-2 text-sm text-gray-500">
        Columns have a maximum width of 200px, creating more columns as space allows
      </p>
      <Grid 
        autoLayout="auto-fit"
        minColumnWidth="150px"
        maxColumnWidth="200px"
        gap={4}
        className="mb-8"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} color="purple">Item {i + 1}</Box>
        ))}
      </Grid>
    </Container>
  ),
};

export const AutoLayoutComparison: Story = {
  render: () => (
    <Container>
      <h2 className="text-lg font-medium mb-4">Auto-Fit vs Auto-Fill Comparison</h2>
      <p className="mb-4 text-sm text-gray-600">
        This example shows the difference between auto-fit and auto-fill with the same number of items.
        Resize the browser window to see how they behave differently.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="mb-2 text-sm font-medium">Auto-Fit (3 items)</p>
          <p className="mb-2 text-xs text-gray-500">
            Collapses empty tracks and stretches items to fill the available space
          </p>
          <div className="border border-gray-300 p-4 rounded bg-gray-50">
            <Grid 
              autoLayout="auto-fit"
              minColumnWidth="100px"
              gap={4}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <Box key={i}>Item {i + 1}</Box>
              ))}
            </Grid>
          </div>
        </div>
        
        <div>
          <p className="mb-2 text-sm font-medium">Auto-Fill (3 items)</p>
          <p className="mb-2 text-xs text-gray-500">
            Preserves empty tracks, maintaining consistent column width
          </p>
          <div className="border border-gray-300 p-4 rounded bg-gray-50">
            <Grid 
              autoLayout="auto-fill"
              minColumnWidth="100px"
              gap={4}
            >
              {Array.from({ length: 3 }, (_, i) => (
                <Box key={i} color="green">Item {i + 1}</Box>
              ))}
            </Grid>
          </div>
        </div>
      </div>
      
      <h3 className="text-md font-medium mb-2">With Many Items</h3>
      <div className="grid grid-cols-1 gap-8 mb-6">
        <div>
          <p className="mb-2 text-sm font-medium">Auto-Fit (12 items)</p>
          <div className="border border-gray-300 p-4 rounded bg-gray-50">
            <Grid 
              autoLayout="auto-fit"
              minColumnWidth="120px"
              gap={4}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Box key={i}>Item {i + 1}</Box>
              ))}
            </Grid>
          </div>
        </div>
        
        <div>
          <p className="mb-2 text-sm font-medium">Auto-Fill (12 items)</p>
          <div className="border border-gray-300 p-4 rounded bg-gray-50">
            <Grid 
              autoLayout="auto-fill"
              minColumnWidth="120px"
              gap={4}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Box key={i} color="green">Item {i + 1}</Box>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </Container>
  ),
};

export const ResponsiveCardLayout: Story = {
  render: () => (
    <Container>
      <h2 className="text-lg font-medium mb-4">Responsive Card Layout</h2>
      <p className="mb-4 text-sm text-gray-600">
        A practical example of using auto-layout for a responsive card grid.
        Cards will automatically adjust based on available space.
      </p>
      
      <Grid 
        autoLayout="auto-fit"
        minColumnWidth="240px"
        gap={6}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`h-40 bg-${i % 2 === 0 ? 'blue' : 'purple'}-200 flex items-center justify-center`}>
              <span className="text-lg font-medium">Image {i + 1}</span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Card Title {i + 1}</h3>
              <p className="text-gray-600 text-sm">
                This is a card description. It demonstrates how cards can automatically
                adjust to fill the available space using auto-layout Grid.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </Grid>
    </Container>
  ),
};

export const InteractiveAutoLayout: Story = {
  render: () => {
    // Use useState inside the render function for interactive controls
    const [autoLayout, setAutoLayout] = useState<'none' | 'auto-fill' | 'auto-fit'>('auto-fit');
    const [minColumnWidth, setMinColumnWidth] = useState('180px');
    const [maxColumnWidth, setMaxColumnWidth] = useState('1fr');
    const [itemCount, setItemCount] = useState(8);
    const [gap, setGap] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>(4);
    
    // Generate items based on the selected count
    const items = Array.from({ length: itemCount }, (_, i) => i + 1);
    
    return (
      <Container>
        <h2 className="text-lg font-medium mb-4">Interactive Auto-Layout Demo</h2>
        <p className="mb-4 text-sm text-gray-600">
          Experiment with different auto-layout settings to see how they affect the grid.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Layout Mode</label>
            <select
              value={autoLayout}
              onChange={(e) => setAutoLayout(e.target.value as 'none' | 'auto-fill' | 'auto-fit')}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="none">None (Fixed Grid)</option>
              <option value="auto-fill">Auto Fill</option>
              <option value="auto-fit">Auto Fit</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Min Column Width</label>
            <input
              type="text"
              value={minColumnWidth}
              onChange={(e) => setMinColumnWidth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., 150px, 10rem, 20%"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Max Column Width</label>
            <input
              type="text"
              value={maxColumnWidth}
              onChange={(e) => setMaxColumnWidth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., 1fr, 300px"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Gap Size</label>
            <select
              value={gap}
              onChange={(e) => setGap(Number(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="0">0 - None</option>
              <option value="1">1 - 0.25rem (4px)</option>
              <option value="2">2 - 0.5rem (8px)</option>
              <option value="3">3 - 0.75rem (12px)</option>
              <option value="4">4 - 1rem (16px)</option>
              <option value="5">5 - 1.25rem (20px)</option>
              <option value="6">6 - 1.5rem (24px)</option>
              <option value="8">8 - 2rem (32px)</option>
              <option value="10">10 - 2.5rem (40px)</option>
              <option value="12">12 - 3rem (48px)</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Number of Items</label>
            <input
              type="range"
              min="1"
              max="20"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{itemCount} items</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 border border-gray-300 rounded mb-6">
          <p className="mb-2 text-sm font-medium">Current Configuration:</p>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`<Grid
  autoLayout="${autoLayout}"
  minColumnWidth="${minColumnWidth}"
  maxColumnWidth="${maxColumnWidth}"
  gap={${gap}}
>
  {/* ${itemCount} items */}
</Grid>`}
          </pre>
        </div>
        
        <div className="border border-gray-300 p-4 rounded bg-white">
          <p className="mb-2 text-sm font-medium">Result:</p>
          <Grid 
            autoLayout={autoLayout}
            minColumnWidth={minColumnWidth}
            maxColumnWidth={maxColumnWidth}
            gap={gap}
          >
            {items.map((item) => (
              <Box key={item} color={item % 3 === 0 ? 'purple' : item % 2 === 0 ? 'green' : 'blue'}>
                Item {item}
              </Box>
            ))}
          </Grid>
        </div>
      </Container>
    );
  },
};

export const ProductGallery: Story = {
  render: () => {
    // Sample product data
    const products = [
      { id: 1, name: 'Wireless Headphones', price: '$129.99', category: 'Audio', featured: true },
      { id: 2, name: 'Smart Watch', price: '$199.99', category: 'Wearables', featured: false },
      { id: 3, name: 'Bluetooth Speaker', price: '$89.99', category: 'Audio', featured: false },
      { id: 4, name: 'Laptop Backpack', price: '$59.99', category: 'Accessories', featured: false },
      { id: 5, name: 'Mechanical Keyboard', price: '$149.99', category: 'Computing', featured: true },
      { id: 6, name: 'Wireless Mouse', price: '$49.99', category: 'Computing', featured: false },
      { id: 7, name: 'USB-C Hub', price: '$39.99', category: 'Accessories', featured: false },
      { id: 8, name: 'Smartphone', price: '$899.99', category: 'Mobile', featured: true },
    ];
    
    return (
      <Container>
        <h2 className="text-xl font-bold mb-2">Product Gallery</h2>
        <p className="mb-6 text-sm text-gray-600">
          A responsive product gallery that uses auto-layout to create a visually balanced grid.
          Featured products take up more space in the grid.
        </p>
        
        <Grid 
          autoLayout="auto-fit"
          minColumnWidth="250px"
          gap={6}
          className="mb-10"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                product.featured ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={product.featured ? { gridRow: 'span 2', gridColumn: 'span 2' } : {}}
            >
              <div 
                className={`${
                  product.featured ? 'h-64' : 'h-48'
                } bg-${
                  product.category === 'Audio' ? 'blue' : 
                  product.category === 'Computing' ? 'purple' : 
                  product.category === 'Mobile' ? 'teal' :
                  product.category === 'Wearables' ? 'amber' : 'gray'
                }-100 flex items-center justify-center border-b`}
              >
                <span className="text-lg font-medium">{product.name}</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-green-700 font-bold">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Grid>
        
        <h3 className="text-lg font-semibold mb-2">Implementation Notes</h3>
        <p className="text-sm mb-2">
          This product gallery showcases how to combine auto-layout with manual grid positioning:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4 ml-4">
          <li>Uses <code>autoLayout="auto-fit"</code> for the base responsive grid</li>
          <li>Featured products use <code>gridRow: 'span 2', gridColumn: 'span 2'</code> for larger sizing</li>
          <li>Grid automatically adjusts other items around the featured products</li>
          <li>The layout remains responsive at all screen sizes</li>
        </ul>
        
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`<Grid 
  autoLayout="auto-fit"
  minColumnWidth="250px"
  gap={6}
>
  {products.map((product) => (
    <div 
      key={product.id}
      style={product.featured ? { gridRow: 'span 2', gridColumn: 'span 2' } : {}}
    >
      {/* Product content */}
    </div>
  ))}
</Grid>`}
        </pre>
      </Container>
    );
  },
}; 