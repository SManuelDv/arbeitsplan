import axios from 'axios'
import { supabase } from '@/config/supabaseClient'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar renovar o token
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      if (!refreshError && session) {
        // Retentar a requisição original com o novo token
        const originalRequest = error.config
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`
        return api(originalRequest)
      }
    }
    return Promise.reject(error)
  }
) 