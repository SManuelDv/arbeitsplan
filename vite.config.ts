import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Middleware para servir arquivos de tradução (apenas desenvolvimento)
function i18nMiddleware() {
  return {
    name: 'i18n-middleware',
    configureServer(server) {
      server.middlewares.use('/locales', (req, res, next) => {
        // Log da requisição
        console.log('📝 i18n request:', req.url)

        // Verificar se é uma requisição de arquivo de tradução
        if (req.url?.endsWith('.json')) {
          const filePath = path.join(process.cwd(), 'public', 'locales', req.url)
          
          // Log do caminho do arquivo
          console.log('📂 Looking for translation file:', filePath)

          try {
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Cache-Control', 'public, max-age=3600')
              res.end(content)
              console.log('✅ Translation file served successfully')
              return
            }
          } catch (error) {
            console.error('❌ Error serving translation file:', error)
          }
        }
        next()
      })
    }
  }
}

// Configuração do Vite
export default defineConfig(({ command, mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [
          mode === 'production' && [
            'babel-plugin-transform-remove-console',
            { exclude: ['error', 'warn'] }
          ]
        ].filter(Boolean)
      }
    }),
    command === 'serve' ? i18nMiddleware() : null
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  },
  server: {
    port: 3000,
    host: true
  },
  publicDir: 'public',
  base: '/',
  css: {
    devSourcemap: command === 'serve',
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js'],
          'i18n-vendor': ['i18next', 'react-i18next']
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
      'i18next-http-backend',
      'i18next-browser-languagedetector',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'axios',
      'date-fns',
      'zustand'
    ],
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        bigint: true 
      },
      platform: 'browser',
      treeShaking: true,
      legalComments: 'none'
    }
  }
}))
// teste
