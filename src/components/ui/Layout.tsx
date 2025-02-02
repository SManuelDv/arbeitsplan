import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/config/supabaseClient'

interface NavItemProps {
  to: string
  children: React.ReactNode
  adminOnly?: boolean
}

function NavItem({ to, children, adminOnly = false }: NavItemProps) {
  const location = useLocation()
  const { isAdmin } = useAuthContext()
  const isActive = location.pathname === to

  if (adminOnly && !isAdmin) return null

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'text-gray-600 hover:bg-primary-100 dark:text-gray-300'
      }`}
    >
      {children}
    </Link>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin } = useAuthContext()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4 items-center">
              <NavItem to="/">Dashboard</NavItem>
              <NavItem to="/employees" adminOnly>Funcionários</NavItem>
              <NavItem to="/shifts" adminOnly>Gestão de Turnos</NavItem>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div>{profile?.full_name}</div>
                <div className="text-xs opacity-75">
                  {isAdmin ? 'Administrador' : 'Usuário Normal'}
                </div>
              </div>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 