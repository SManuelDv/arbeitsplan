import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { Layout } from '../components/ui/Layout'
import { Dashboard } from '../pages/Dashboard'
import { Employees } from '../pages/employees/Employees'
import { EmployeeForm } from '../pages/employees/EmployeeForm'
import { ShiftManagement } from '../pages/shifts/ShiftManagement'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { ForgotPassword } from '../pages/auth/ForgotPassword'
import { routerConfig } from '@/config/router'
import { useAuthContext } from '@/providers/AuthProvider'

// Proteção de rotas autenticadas
function PrivateRoute() {
  const { user } = useAuthContext()
  return user ? <Outlet /> : <Navigate to="/login" />
}

// Proteção de rotas públicas
function PublicRoute() {
  const { user } = useAuthContext()
  return !user ? <Outlet /> : <Navigate to="/" />
}

// Configuração das rotas
export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> }
    ]
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Layout><Outlet /></Layout>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'employees', element: <Employees /> },
          { path: 'employees/new', element: <EmployeeForm /> },
          { path: 'employees/:id/edit', element: <EmployeeForm /> },
          { path: 'shifts', element: <ShiftManagement /> }
        ]
      }
    ]
  },
  { path: '*', element: <Navigate to="/" /> }
], routerConfig)

// Componente principal de rotas
export function AppRoutes() {
  return <RouterProvider router={router} />
}
