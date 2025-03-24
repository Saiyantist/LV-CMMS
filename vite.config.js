import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/js/app.tsx',  // Main React entry point
      ],
      refresh: true,  // Ensures that assets are refreshed when changes occur
    }),
    react(),  // React support
  ],
  server: {
    proxy: {
      // Proxy API requests to the backend
      '/app': 'http://localhost',  // Adjust according to your Laravel backend URL
    },
  },
});
