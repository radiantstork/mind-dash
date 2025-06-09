import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // for React component testing
    globals: true,         // allows using describe/it/expect globally
    setupFiles: './setupTests.ts', // optional: for global test setup
  },
});