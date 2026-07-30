import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/users': 'http://localhost:3000',
      '/leads': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000',
    },
  },
})
