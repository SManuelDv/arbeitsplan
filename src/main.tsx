import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes'
import { AuthProvider } from './providers/AuthProvider'
import { queryClient } from './config/queryClient'
import i18n from './config/i18n'
import './index.css'

// Componente de loading para usar durante a inicialização
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

// Função para inicializar a aplicação
async function initializeApp() {
  try {
    // Garantir que o i18n está inicializado e as traduções carregadas
    await new Promise<void>((resolve, reject) => {
      i18n.on('initialized', () => {
        // Forçar o idioma alemão e carregar as traduções
        i18n.changeLanguage('de')
          .then(() => i18n.loadNamespaces('translation'))
          .then(resolve)
          .catch(reject)
      })

      // Timeout de segurança
      setTimeout(() => {
        reject(new Error('i18n initialization timeout'))
      }, 5000)
    })
    
    // Renderizar a aplicação
    const rootElement = document.getElementById('root')
    if (!rootElement) {
      throw new Error('Root element not found')
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Suspense fallback={<LoadingScreen />}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppRoutes />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </QueryClientProvider>
        </Suspense>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to initialize application:', error)
    // Mostrar uma mensagem de erro amigável para o usuário
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4 text-center">
          <div>
            <h1 class="text-xl font-semibold mb-4">Fehler beim Initialisieren der Anwendung</h1>
            <p>Bitte laden Sie die Seite neu. Wenn das Problem weiterhin besteht, wenden Sie sich an den Support.</p>
          </div>
        </div>
      `
    }
  }
}

// Iniciar a aplicação
initializeApp()
