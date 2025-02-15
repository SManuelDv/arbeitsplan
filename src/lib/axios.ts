import axios from 'axios'
import { supabase } from '@/config/supabaseClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// @ts-ignore - TODO: Fix typing for axios interceptor
api.interceptors.request.use((config) => {
  return supabase.auth.getSession()
    .then(({ data: { session } }) => {
      if (session?.access_token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${session.access_token}`
        } else {
          config.headers = {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      }
      return config
    })
    .catch((error) => {
      console.error('Error getting session:', error)
      return config
    })
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      return supabase.auth.refreshSession()
        .then(({ data: { session }, error: refreshError }) => {
          if (!refreshError && session) {
            const originalRequest = error.config
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${session.access_token}`
            } else {
              originalRequest.headers = {
                Authorization: `Bearer ${session.access_token}`
              }
            }
            return api(originalRequest)
          }
          return Promise.reject(error)
        })
        .catch(() => {
          return Promise.reject(error)
        })
    }
    return Promise.reject(error)
  }
)

export { api } 