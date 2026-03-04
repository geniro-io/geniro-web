import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    allowedHosts: true,
    host: '0.0.0.0',
  },
  server: {
    // allowedHosts: [],
    host: '0.0.0.0',
  },
});
