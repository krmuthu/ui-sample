import React from 'react';
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