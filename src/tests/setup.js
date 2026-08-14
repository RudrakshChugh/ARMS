import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically clean up DOM tree after each test spec is run
afterEach(() => {
  cleanup();
});
