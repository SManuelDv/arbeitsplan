import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes'

export function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  )
} 