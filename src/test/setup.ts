import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver which is not available in jsdom
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [0],
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }))
});

// Polyfill for Element.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Polyfill for HTMLElement.scrollIntoView
HTMLElement.prototype.scrollIntoView = vi.fn();

// Polyfill for Element.scrollTo
Element.prototype.scrollTo = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Add compatibility layer for jest
global.jest = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  mock: vi.mock,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  runAllTimers: vi.runAllTimers,
  runOnlyPendingTimers: vi.runOnlyPendingTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  clearAllMocks: vi.resetAllMocks,
  clearAllTimers: vi.clearAllTimers,
  restoreAllMocks: vi.restoreAllMocks,
  mockImplementation: (fn) => vi.fn().mockImplementation(fn),
  mockRestore: vi.resetAllMocks,
};

// Set up custom matchers or global test utilities here 