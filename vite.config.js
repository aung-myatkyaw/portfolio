import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import { RESUME_PATH, RESUME_URL } from './src/lib/resume.js'

const resumeDownloadHeaders = () => ({
  name: 'resume-download-headers',
  configureServer(server) {
    server.middlewares.use(resumeHeaders)
  },
  configurePreviewServer(server) {
    server.middlewares.use(resumeHeaders)
  },
})

function resumeHeaders(req, res, next) {
  const path = req.url?.split('?')[0]
  if (path === RESUME_PATH) {
    res.writeHead(302, {
      Location: RESUME_URL,
      'Cache-Control': 'public, max-age=300',
    })
    res.end()
    return
  }
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    resumeDownloadHeaders(),
    // Gzip for broad compatibility
    compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
    // Brotli — ICP asset canisters serve this natively, ~20% smaller than gzip
    compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules\/(react|react-dom|react-router(-dom)?)\//,
            },
            { name: 'vendor-motion', test: /node_modules\/framer-motion\// },
            { name: 'vendor-icons', test: /node_modules\/react-icons\// },
            { name: 'vendor-emailjs', test: /node_modules\/@emailjs\/browser\// },
            { name: 'vendor-turnstile', test: /node_modules\/@marsidev\/react-turnstile\// },
            { name: 'vendor-observer', test: /node_modules\/react-intersection-observer\// },
            { name: 'vendor-icp', test: /node_modules\/@icp-sdk\// },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
