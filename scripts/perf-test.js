import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, '../perf-results');

// Ensure results directory exists
try {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
}

// Test cases - components to measure
const TEST_CASES = [
  {
    name: 'Table-Default',
    url: 'http://localhost:6006/iframe.html?viewMode=story&id=components-table--default',
    selector: '[id="storybook-root"]'
  },
  {
    name: 'Table-WithPagination',
    url: 'http://localhost:6006/iframe.html?viewMode=story&id=components-table--with-pagination',
    selector: '[id="storybook-root"]'
  },
  {
    name: 'Grid-Basic',
    url: 'http://localhost:6006/iframe.html?viewMode=story&id=layout-grid--basic-grid',
    selector: '[id="storybook-root"]'
  },
  {
    name: 'Modal-Default',
    url: 'http://localhost:6006/iframe.html?viewMode=story&id=components-modal--default',
    selector: '[id="storybook-root"]',
    interaction: async (page) => {
      // Click button to open modal
      await page.click('button:has-text("Open Modal")');
      await page.waitForSelector('.modal-content', { visible: true });
      
      // Measure time with modal open
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal
      await page.click('button:has-text("Close")');
    }
  },
  {
    name: 'Tooltip-Default',
    url: 'http://localhost:6006/iframe.html?viewMode=story&id=components-tooltip--basic',
    selector: '[id="storybook-root"]',
    interaction: async (page) => {
      // Hover over element with tooltip
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const hoverButton = buttons.find(button => 
          button.textContent.trim() === 'Hover me' || 
          button.textContent.includes('Hover me')
        );
        
        if (hoverButton) {
          // Create and dispatch a mouseover event
          const mouseoverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          hoverButton.dispatchEvent(mouseoverEvent);
        }
      });
      
      
      // Wait for tooltip to appear
      await page.waitForSelector('[role="tooltip"]');
      
      // Measure time with tooltip visible
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
  {
    name: 'AutoSuggest-Default',
    url: 'localhost:6006/iframe.html?viewMode=story&id=components-autosuggest--basic',
    selector: '[id="storybook-root"]',
    interaction: async (page) => {
      // Focus input and type
      await page.click('input');
      await page.type('input', 'a');
      
      // Wait for suggestions to appear
      await page.waitForSelector('.suggestions-list', { visible: true });
      
      // Measure time with suggestions visible
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
];

/**
 * Run performance tests on components
 */
async function runPerformanceTests() {
  const startTime = performance.now();
  console.log('Starting performance tests...');
  
  const testResults = {};
  const browser = await puppeteer.launch({
    headless: false,  // This is the key setting to make the browser visible
    defaultViewport: null, // Optional: Uses the default viewport of the browser
    args: ['--start-maximized'] // Optional: Starts with a maximized browser window
  });
  
  // Track memory usage
  const initialMemoryUsage = process.memoryUsage();
  
  for (const testCase of TEST_CASES) {
    console.log(`Testing ${testCase.name}...`);
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Enable performance metrics
    await page.evaluateOnNewDocument(() => {
      window.performance.mark('start');
    });
    
    // Track page load performance
    const loadStart = Date.now();
    await page.goto(testCase.url);
    const loadEnd = Date.now();
    const loadTime = loadEnd - loadStart;
    
    // Wait for component to be fully loaded
    await page.waitForSelector(testCase.selector, { visible: true });
    
    // Run custom interaction if defined
    if (testCase.interaction) {
      try {
        await testCase.interaction(page);
      } catch (error) {
        console.error(`Interaction failed for ${testCase.name}:`, error);
      }
    }
    
    // Measure rendering performance
    const metrics = await page.evaluate(() => {
      window.performance.mark('end');
      window.performance.measure('total', 'start', 'end');
      
      const entries = window.performance.getEntriesByType('measure');
      const paintEntries = performance.getEntriesByType('paint');
      const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      const resources = performance.getEntriesByType('resource');
      const resourceStats = {
        count: resources.length,
        totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        totalDuration: resources.reduce((sum, r) => sum + r.duration, 0)
      };
      
      return {
        total: entries[0]?.duration || 0,
        firstPaint: fpEntry?.startTime || null,
        firstContentfulPaint: fcpEntry?.startTime || null,
        resourceStats,
        memoryInfo: window.performance.memory ? {
          usedJSHeapSize: window.performance.memory.usedJSHeapSize,
          totalJSHeapSize: window.performance.memory.totalJSHeapSize
        } : null
      };
    });
    
    // Run multiple render tests
    const renderTimes = [];
    for (let i = 0; i < 5; i++) {
      // Force a re-render by toggling theme
      await page.click('button[title="Toggle theme"]');
      await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for render to complete
      
      // Measure render time
      const renderTime = await page.evaluate(() => {
        const start = performance.now();
        document.body.classList.toggle('force-reflow');
        const end = performance.now();
        return end - start;
      });
      
      renderTimes.push(renderTime);
    }
    
    // Calculate average render time
    const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
    
    // Store results
    testResults[testCase.name] = {
      loadTime,
      metrics,
      renderTimes,
      avgRenderTime
    };
    
    await page.close();
  }
  
  await browser.close();
  
  // Track final memory usage
  const finalMemoryUsage = process.memoryUsage();
  const memoryDiff = {
    rss: finalMemoryUsage.rss - initialMemoryUsage.rss,
    heapTotal: finalMemoryUsage.heapTotal - initialMemoryUsage.heapTotal,
    heapUsed: finalMemoryUsage.heapUsed - initialMemoryUsage.heapUsed,
    external: finalMemoryUsage.external - initialMemoryUsage.external
  };
  
  // Calculate execution time
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  // Save results
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const resultsFile = path.join(RESULTS_DIR, `perf-results-${timestamp}.json`);
  fs.writeFileSync(
    resultsFile, 
    JSON.stringify({
      testResults,
      executionTime,
      memoryUsage: {
        initial: initialMemoryUsage,
        final: finalMemoryUsage,
        diff: memoryDiff
      }
    }, null, 2)
  );
  
  // Print summary
  console.log('\nPerformance Test Results:');
  console.log('========================');
  Object.entries(testResults).forEach(([testName, result]) => {
    console.log(`\n${testName}:`);
    console.log(`  Load time: ${result.loadTime.toFixed(2)}ms`);
    console.log(`  First paint: ${result.metrics.firstPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`  First contentful paint: ${result.metrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`  Average render time: ${result.avgRenderTime.toFixed(2)}ms`);
    if (result.metrics.resourceStats) {
      console.log(`  Resources: ${result.metrics.resourceStats.count} (${(result.metrics.resourceStats.totalSize / 1024).toFixed(2)} KB)`);
    }
    if (result.metrics.memoryInfo) {
      console.log(`  JS Heap: ${(result.metrics.memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB used / ${(result.metrics.memoryInfo.totalJSHeapSize / (1024 * 1024)).toFixed(2)} MB total`);
    }
  });
  
  // Print memory usage and execution time
  console.log('\nTest Execution Stats:');
  console.log('=====================');
  console.log(`Total execution time: ${(executionTime / 1000).toFixed(2)} seconds`);
  console.log('Memory usage diff:');
  console.log(`  RSS: ${(memoryDiff.rss / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`  Heap Total: ${(memoryDiff.heapTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`  Heap Used: ${(memoryDiff.heapUsed / (1024 * 1024)).toFixed(2)} MB`);
  
  console.log(`\nDetailed results saved to: ${resultsFile}`);
  console.log('Performance tests completed!');
}

// Run the tests
runPerformanceTests().catch(error => {
  console.error('Performance tests failed:', error);
  process.exit(1);
}); 