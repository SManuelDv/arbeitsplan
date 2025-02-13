import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/config/supabaseClient'
import { FiBell, FiMail, FiLogOut } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { useTranslation } from 'react-i18next'

interface NavItemProps {
  to: string
  children: React.ReactNode
  adminOnly?: boolean
}

function NavItem({ to, children, adminOnly = false }: NavItemProps) {
  const { isAdmin } = useAuthContext()

  if (adminOnly && !isAdmin) return null

  return (
    <Link
      to={to}
      className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {children}
    </Link>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin } = useAuthContext()
  const [unreadNotifications] = React.useState(0)
  const [unreadMessages] = React.useState(0)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Barra de navegação fixa */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo e Links de Navegação */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-primary-500">
                ArbeitsPlan
              </Link>
              {isAdmin && (
                <>
                  <NavItem to="/employees">{t('common.employees')}</NavItem>
                  <NavItem to="/shifts">{t('common.shifts')}</NavItem>
                </>
              )}
            </div>

            {/* Área Central - Seletor de Idiomas */}
            <div className="flex-1 flex justify-center">
              <LanguageSelector />
            </div>

            {/* Área Direita - Notificações e Perfil */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title={t('common.notifications')}
                >
                  <FiBell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <button
                  className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title={t('common.messages')}
                >
                  <FiMail className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  className="relative p-2 text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <BsWhatsapp className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div>{profile?.full_name}</div>
                  <div className="text-xs opacity-75">
                    {isAdmin ? t('common.administrator') : t('common.user')}
                  </div>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title={t('common.logout')}
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 