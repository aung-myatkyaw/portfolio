import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip for broad compatibility
    compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
    // Brotli — ICP asset canisters serve this natively, ~20% smaller than gzip
    compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['react-icons'],
          'vendor-emailjs': ['@emailjs/browser'],
          'vendor-turnstile': ['@marsidev/react-turnstile'],
          'vendor-observer': ['react-intersection-observer'],
          'vendor-icp': ['@dfinity/agent', '@dfinity/candid', '@dfinity/principal'],
        },
      },
    },
    // Warn at 500kB, hard limit at 1MB
    chunkSizeWarningLimit: 500,
  },
})
