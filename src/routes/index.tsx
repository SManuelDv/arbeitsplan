import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { DefaultLayout } from '../layouts/DefaultLayout'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { ForgotPassword } from '../pages/auth/ForgotPassword'
import { AuthCallback } from '../pages/auth/AuthCallback'
import { Dashboard } from '../pages/Dashboard'
import { Employees } from '../pages/employees/Employees'
import { EmployeeForm } from '../pages/employees/EmployeeForm'
import { Shifts } from '../pages/shifts/Shifts'
import { useAuthContext } from '../providers/AuthProvider'

// Componente de loading
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Componente para rotas protegidas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/auth/login" />
  }

  return <>{children}</>
}

// Componente para rotas públicas
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

// Configuração das rotas
export const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <PublicRoute><Login /></PublicRoute>
      },
      {
        path: 'register',
        element: <PublicRoute><Register /></PublicRoute>
      },
      {
        path: 'forgot-password',
        element: <PublicRoute><ForgotPassword /></PublicRoute>
      },
      {
        path: 'callback',
        element: <AuthCallback />
      }
    ]
  },
  
  // Redirecionar rotas antigas
  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />
  },
  {
    path: '/register',
    element: <Navigate to="/auth/register" replace />
  },
  {
    path: '/forgot-password',
    element: <Navigate to="/auth/forgot-password" replace />
  },
  
  // Rotas protegidas
  {
    path: '/',
    element: <PrivateRoute><DefaultLayout /></PrivateRoute>,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'employees',
        element: <Employees />
      },
      {
        path: 'employees/new',
        element: <EmployeeForm />
      },
      {
        path: 'employees/:id/edit',
        element: <EmployeeForm />
      },
      {
        path: 'shifts',
        element: <Shifts />
      }
    ]
  },
  
  // Rota 404
  {
    path: '*',
    element: <Navigate to="/" />
  }
])

// Componente principal de rotas
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
} 
