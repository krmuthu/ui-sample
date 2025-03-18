import React, { useState } from 'react';
import { Grid, Container } from './Grid';

/**
 * Demo component showcasing Grid auto-layout functionality
 */
export const GridAutoLayoutDemo: React.FC = () => {
  const [autoLayout, setAutoLayout] = useState<'none' | 'auto-fill' | 'auto-fit'>('auto-fit');
  const [minColumnWidth, setMinColumnWidth] = useState('150px');
  const [maxColumnWidth, setMaxColumnWidth] = useState('1fr');
  const [fixedColumns, setFixedColumns] = useState(4);
  
  // Sample items to display in the grid
  const items = Array.from({ length: 12 }, (_, i) => i + 1);
  
  return (
    <Container maxWidth="2xl">
      <h1 className="text-2xl font-bold mb-6">Grid Auto-Layout Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Auto Layout Mode</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={autoLayout}
              onChange={(e) => setAutoLayout(e.target.value as 'none' | 'auto-fill' | 'auto-fit')}
            >
              <option value="none">None (Fixed Columns)</option>
              <option value="auto-fill">Auto Fill</option>
              <option value="auto-fit">Auto Fit</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {autoLayout === 'none' && 'Fixed number of columns specified by the columns prop'}
              {autoLayout === 'auto-fill' && 'Fill with as many columns as possible, leaving empty spaces if necessary'}
              {autoLayout === 'auto-fit' && 'Fill with responsive columns that expand to use all available space'}
            </p>
          </div>
          
          {autoLayout === 'none' ? (
            <div>
              <label className="block mb-2 font-medium">Number of Columns</label>
              <input
                type="range"
                min="1"
                max="12"
                value={fixedColumns}
                onChange={(e) => setFixedColumns(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span>1</span>
                <span>{fixedColumns}</span>
                <span>12</span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block mb-2 font-medium">Minimum Column Width</label>
                <input
                  type="text"
                  value={minColumnWidth}
                  onChange={(e) => setMinColumnWidth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., 200px, 20%, 10rem"
                />
                <p className="mt-1 text-sm text-gray-500">
                  CSS value for minimum column width (px, %, rem, etc.)
                </p>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Maximum Column Width</label>
                <input
                  type="text"
                  value={maxColumnWidth}
                  onChange={(e) => setMaxColumnWidth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., 1fr, 300px, 30%"
                />
                <p className="mt-1 text-sm text-gray-500">
                  CSS value for maximum column width (1fr = equal distribution)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Result</h2>
        <p className="mb-4 text-sm">
          Current Config: 
          {autoLayout === 'none' 
            ? ` Fixed ${fixedColumns} columns` 
            : ` ${autoLayout} with min width ${minColumnWidth} and max width ${maxColumnWidth}`}
        </p>
        
        <div className="p-4 border border-gray-300 rounded">
          <Grid
            autoLayout={autoLayout}
            columns={fixedColumns}
            minColumnWidth={minColumnWidth}
            maxColumnWidth={maxColumnWidth}
            gap={4}
          >
            {items.map(item => (
              <div 
                key={item} 
                className="aspect-video bg-blue-100 border border-blue-300 rounded flex items-center justify-center"
              >
                Item {item}
              </div>
            ))}
          </Grid>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <pre className="p-4 bg-gray-100 rounded overflow-x-auto">
          {`// Auto-fit example: columns that expand to fill space
<Grid 
  autoLayout="auto-fit"
  minColumnWidth="200px"
  maxColumnWidth="1fr"
  gap={4}
>
  {items.map(item => (
    <div key={item}>Item {item}</div>
  ))}
</Grid>

// Auto-fill example: as many columns as can fit
<Grid 
  autoLayout="auto-fill"
  minColumnWidth="200px"
  maxColumnWidth="1fr"
  gap={4}
>
  {items.map(item => (
    <div key={item}>Item {item}</div>
  ))}
</Grid>

// Fixed columns example (traditional)
<Grid 
  columns={4}
  gap={4}
>
  {items.map(item => (
    <div key={item}>Item {item}</div>
  ))}
</Grid>`}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Auto-Fill vs Auto-Fit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Auto-Fill</h3>
            <p className="mb-4 text-sm">
              Creates as many columns as can fit based on min width, leaving empty tracks if necessary.
            </p>
            <div className="p-4 border border-gray-300 rounded">
              <Grid
                autoLayout="auto-fill"
                minColumnWidth="150px"
                maxColumnWidth="1fr"
                gap={4}
              >
                {items.slice(0, 5).map(item => (
                  <div 
                    key={item} 
                    className="h-20 bg-green-100 border border-green-300 rounded flex items-center justify-center"
                  >
                    Item {item}
                  </div>
                ))}
              </Grid>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Auto-Fit</h3>
            <p className="mb-4 text-sm">
              Similar to auto-fill, but collapses empty tracks and stretches existing items.
            </p>
            <div className="p-4 border border-gray-300 rounded">
              <Grid
                autoLayout="auto-fit"
                minColumnWidth="150px"
                maxColumnWidth="1fr"
                gap={4}
              >
                {items.slice(0, 5).map(item => (
                  <div 
                    key={item} 
                    className="h-20 bg-purple-100 border border-purple-300 rounded flex items-center justify-center"
                  >
                    Item {item}
                  </div>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default GridAutoLayoutDemo; 