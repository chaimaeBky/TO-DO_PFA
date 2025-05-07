import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: [
        '**/*.config.{js,cjs,mjs,ts}',
        '**/main.jsx',
        '**/App.jsx' // Exclure si c'est juste un wrapper
      ],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'lcov'], // lcov est essentiel
      reportsDirectory: './coverage'
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    // Si vous avez besoin d'alias pour vos imports
    alias: {
      '@': '/src',
    },
  },
});