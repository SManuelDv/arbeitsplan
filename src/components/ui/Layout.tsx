import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/config/supabaseClient'
import { FiBell, FiMail, FiLogOut } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'

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
  const [unreadNotifications, setUnreadNotifications] = React.useState(0)
  const [unreadMessages, setUnreadMessages] = React.useState(0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4 items-center">
              <NavItem to="/">ArbeitsPlan</NavItem>
              <NavItem to="/employees" adminOnly>Funcionários</NavItem>
              <NavItem to="/shifts" adminOnly>Gestão de Turnos</NavItem>
            </div>
            <div className="flex items-center space-x-6">
              {/* Ícones de notificação, mensagens e WhatsApp */}
              <div className="flex items-center space-x-4 border-r border-gray-200 dark:border-gray-700 pr-6 mr-2">
                <button
                  className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Notificações"
                >
                  <FiBell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <button
                  className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Mensagens"
                >
                  <FiMail className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  className="p-2 text-gray-500 hover:text-green-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <BsWhatsapp className="w-5 h-5" />
                </button>
              </div>

              {/* Informações do usuário e botão de logout */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div>{profile?.full_name}</div>
                  <div className="text-xs opacity-75">
                    {isAdmin ? 'Administrador' : 'Usuário Normal'}
                  </div>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Sair"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
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