import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// setupFiles runs before the test suite context is ready, so `globals: true`
// (vitest.config.js) is required to provide afterEach/vi without importing vitest.
// Automatically clean up DOM tree after each test spec is run
afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
