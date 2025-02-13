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
    <Link to={to} className="px-4 py-2 text-gray-600 hover:text-gray-900">
      {children}
    </Link>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin } = useAuthContext()
  const [unreadNotifications, setUnreadNotifications] = React.useState(0)
  const [unreadMessages, setUnreadMessages] = React.useState(0)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4 items-center">
              <NavItem to="/">ArbeitsPlan</NavItem>
              {isAdmin && (
                <>
                  <NavItem to="/employees">{t('common.employees')}</NavItem>
                  <NavItem to="/shifts">{t('common.shifts')}</NavItem>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-500 hover:text-primary-500 rounded-full"
                  title={t('common.notifications')}
                >
                  <FiBell className="w-5 h-5" />
                </button>

                <button
                  className="p-2 text-gray-500 hover:text-primary-500 rounded-full"
                  title={t('common.messages')}
                >
                  <FiMail className="w-5 h-5" />
                </button>

                <button
                  className="p-2 text-gray-500 hover:text-green-500 rounded-full"
                  title="WhatsApp"
                >
                  <BsWhatsapp className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <div>{profile?.full_name}</div>
                    <div className="text-xs opacity-75">
                      {isAdmin ? t('common.administrator') : t('common.user')}
                    </div>
                  </div>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="p-2 text-gray-500 hover:text-red-500 rounded-full"
                    title={t('common.logout')}
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
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