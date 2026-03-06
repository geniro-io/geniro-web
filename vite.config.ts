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
    host: '0.0.0.0',
    // In EKS, Host header validation is handled by the ingress controller.
    // Set ALLOWED_HOSTS env var to restrict (comma-separated), or leave unset for all.
    allowedHosts: process.env.ALLOWED_HOSTS
      ? process.env.ALLOWED_HOSTS.split(',').map((h) => h.trim())
      : true,
  },
  server: {
    host: '0.0.0.0',
  },
});
