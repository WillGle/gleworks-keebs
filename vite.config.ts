import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    host: '127.0.0.1',
    // Fail on a busy port instead of leaving a server on an unexpected port.
    strictPort: true,
  },
  
  build: {
    emptyOutDir: true,
    sourcemap: false,
  },
  
  preview: {
    port: 4173,
    host: '127.0.0.1',
    strictPort: true,
  },
})
