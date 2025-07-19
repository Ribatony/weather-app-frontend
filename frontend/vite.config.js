import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weather': {
        target: 'http://127.0.0.1:5000',


        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('--- Proxying request to:', proxyReq.path);
          });
          proxy.on('error', (err, req, res) => {
            console.error('--- Proxy error:', err);
          });
        },
      },
    },
  },
})
