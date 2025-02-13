import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { Layout } from '../components/ui/Layout'
import { Dashboard } from '../pages/Dashboard'
import { Employees } from '../pages/employees/Employees'
import { EmployeeForm } from '../pages/employees/EmployeeForm'
import { ShiftManagement } from '../pages/shifts/ShiftManagement'
import { routerConfig } from '@/config/router'

// Componente de loading
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Configuração das rotas
export const router = createBrowserRouter([
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
  },
  { path: '/login', element: <Navigate to="/" /> },
  { path: '*', element: <Navigate to="/" /> }
], routerConfig)

// Componente principal de rotas
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
} 
