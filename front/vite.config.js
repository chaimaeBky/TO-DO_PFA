import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
     
      all: true, // Analyse même les fichiers non testés
      // Ajoutez ces lignes :
      clean: true,
      exclude: [
        '**/*.config.{js,cjs,mjs,ts}',
        '**/main.jsx',
        '**/App.jsx' // Exclure si c'est juste un wrapper
      ],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      watermarks: {
        lines: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        statesments: [80, 95]
      }
     
    },
    reporters: process.env.CI 
      ? ['default', 'junit'] 
      : ['default']
  },
    
  server: {
    historyApiFallback: true,
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      'uuid': path.resolve(__dirname, 'node_modules/uuid/dist/esm-browser/index.js')
    },
  },
});