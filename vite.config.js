import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for deployment. Local dev / user-site → '/'. For a GitHub Pages
  // *project* site the CI sets VITE_BASE to '/<repo>/'.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    // Big project screenshots push some chunks over the default warning limit.
    chunkSizeWarningLimit: 1500,
  },
})
