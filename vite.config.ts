import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function devConfigPlugin(): Plugin {
  return {
    name: 'dev-config-js',
    configureServer(server) {
      server.middlewares.use('/config.js', (_req, res) => {
        res.setHeader('Content-Type', 'application/javascript');
        res.end('window.__CONFIG__ = {};');
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), devConfigPlugin()],
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
