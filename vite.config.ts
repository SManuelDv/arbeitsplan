import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Middleware para servir arquivos de tradução
function i18nMiddleware() {
  return {
    name: 'i18n-middleware',
    configureServer(server) {
      server.middlewares.use('/locales', (req, res, next) => {
        console.log('📝 [i18n] Request:', req.url)
        
        if (req.url?.endsWith('.json')) {
          const filePath = path.join(process.cwd(), 'public', 'locales', req.url)
          console.log('📂 [i18n] Looking for file:', filePath)
          
          try {
            if (fs.existsSync(filePath)) {
              console.log('✅ [i18n] File found:', filePath)
              const content = fs.readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Cache-Control', 'no-cache')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(content)
              return
            } else {
              console.log('❌ [i18n] File not found:', filePath)
            }
          } catch (error) {
            console.error('❌ [i18n] Error serving translation file:', error)
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), i18nMiddleware()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    fs: {
      strict: false,
      allow: ['..']
    },
    middlewareMode: false,
    cors: true
  },
  build: {
    target: 'esnext',
    sourcemap: true
  },
  publicDir: 'public'
})
