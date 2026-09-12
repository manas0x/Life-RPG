import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    // Allow E2B preview host (e.g. 5173-xxxx.e2b.app) to avoid 403 Blocked request
    // Vite 5+ checks Host header; setting allowedHosts to true disables the check
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    },
    hmr: {
      host: 'localhost',
      clientPort: 443
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    cors: true
  }
})
