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
    url: 'http://localhost:6006/?path=/story/components-table--default',
    selector: 'table'
  },
  {
    name: 'Table-WithPagination',
    url: 'http://localhost:6006/?path=/story/components-table--with-pagination',
    selector: 'table'
  },
  {
    name: 'Grid-Basic',
    url: 'http://localhost:6006/?path=/story/layout-grid--basic-grid',
    selector: '[class*="container"]'
  }
];

/**
 * Run performance tests on components
 */
async function runPerformanceTests() {
  console.log('Starting performance tests...');
  
  const testResults = {};
  const browser = await puppeteer.launch();
  
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
    
    // Measure rendering performance
    const metrics = await page.evaluate(() => {
      window.performance.mark('end');
      window.performance.measure('total', 'start', 'end');
      
      const entries = window.performance.getEntriesByType('measure');
      const paintEntries = performance.getEntriesByType('paint');
      const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      return {
        total: entries[0]?.duration || 0,
        firstPaint: fpEntry?.startTime || null,
        firstContentfulPaint: fcpEntry?.startTime || null,
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
      await page.waitForTimeout(1000); // Wait for render to complete
      
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
  
  // Save results
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const resultsFile = path.join(RESULTS_DIR, `perf-results-${timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  
  // Print summary
  console.log('\nPerformance Test Results:');
  console.log('========================');
  Object.entries(testResults).forEach(([testName, result]) => {
    console.log(`\n${testName}:`);
    console.log(`  Load time: ${result.loadTime.toFixed(2)}ms`);
    console.log(`  First paint: ${result.metrics.firstPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`  First contentful paint: ${result.metrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms`);
    console.log(`  Average render time: ${result.avgRenderTime.toFixed(2)}ms`);
  });
  
  console.log(`\nDetailed results saved to: ${resultsFile}`);
  console.log('Performance tests completed!');
}

// Run the tests
runPerformanceTests().catch(error => {
  console.error('Performance tests failed:', error);
  process.exit(1);
}); 