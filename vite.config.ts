import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Relative base позволяет открывать production-сборку и на GitHub Pages,
// и локально из любой вложенной директории.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
