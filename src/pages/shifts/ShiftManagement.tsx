import React, { useState, useEffect } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ptBR, de, enUS } from 'date-fns/locale'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService, type Shift } from '@/services/shiftService'
import { ShiftCell } from '@/components/shifts/ShiftCell'
import { toast } from 'react-hot-toast'
import { supabase } from '@/config/supabaseClient'
import styles from './ShiftManagement.module.css'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

interface EmployeeWithShifts {
  id: string
  full_name: string
  department: string
  team: string
  role: string
  shifts: Record<string, Shift>
}

const locales = {
  pt: ptBR,
  de: de,
  en: enUS
}

// Função para traduzir o nome do departamento
function translateDepartment(department: string, t: TFunction) {
  const key = department.toLowerCase().replace(/\s+/g, '')
  return t(`shifts.departments.${key}`)
}

// Função para traduzir o nome do time
function translateTeam(team: string, t: TFunction) {
  const key = team.toLowerCase().replace(/\s+/g, '')
  return t(`shifts.teams.${key}`)
}

export function ShiftManagement() {
  const { t, i18n } = useTranslation()
  const currentLocale = locales[i18n.language as keyof typeof locales] || enUS
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState({
    name: '',
    team: ''
  })

  // Forçar atualização quando o idioma mudar
  useEffect(() => {
    const handleLanguageChange = () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, queryClient])

  // Gerar datas dos próximos 30 dias
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startOfToday(), i)
    return {
      full: date,
      formatted: format(date, 'yyyy-MM-dd'),
      display: {
        weekday: format(date, 'EEE', { locale: currentLocale }),
        date: format(date, 'dd/MM', { locale: currentLocale })
      }
    }
  })

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession()
      setIsAuthenticated(!!session.session)

      // Inscrever-se para mudanças na autenticação
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
      })

      return () => subscription.unsubscribe()
    }

    checkAuth()
  }, [])

  // Buscar funcionários
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.list,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  // Buscar turnos para os próximos 30 dias
  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts', dates[0].formatted, dates[dates.length - 1].formatted],
    queryFn: () => shiftService.getShifts(
      dates[0].formatted, // Data inicial (hoje)
      dates[dates.length - 1].formatted // Data final (hoje + 30 dias)
    ),
    staleTime: 0, // Sempre buscar dados frescos
    refetchInterval: 5000 // Recarregar a cada 5 segundos
  })

  // Combinar funcionários com seus turnos
  const employeesWithShifts: EmployeeWithShifts[] = employees.map(employee => {
    const employeeShifts = shifts
      .filter(shift => shift.employee_id === employee.id)
      .reduce((acc, shift) => ({
        ...acc,
        [shift.date]: shift
      }), {} as Record<string, Shift>)

    return {
      ...employee,
      shifts: employeeShifts
    }
  })

  // Filtrar funcionários
  const filteredEmployees = employeesWithShifts.filter(employee => {
    const nameMatch = employee.full_name.toLowerCase().includes(filter.name.toLowerCase())
    const teamMatch = !filter.team || employee.team === filter.team
    return nameMatch && teamMatch
  })

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logout realizado com sucesso')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-gray-600">
          Você precisa estar autenticado para gerenciar turnos
        </p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + '/shifts'
            }
          })}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Entrar com Google
        </button>
      </div>
    )
  }

  if (isLoadingEmployees || isLoadingShifts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-blue-600 dark:text-blue-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('shifts.stats.totalEmployees')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredEmployees.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-green-600 dark:text-green-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('shifts.stats.totalShifts')} 7 {t('shifts.stats.days')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(shifts).length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-purple-600 dark:text-purple-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('shifts.stats.average')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(Object.keys(shifts).length / filteredEmployees.length || 0).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {t('shifts.workPlan')} {t('shifts.from')} {format(dates[0].full, 'PPP', { locale: currentLocale })} {t('shifts.to')} {format(dates[dates.length - 1].full, 'PPP', { locale: currentLocale })}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('shifts.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('shifts.department')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('shifts.team')}
                </th>
                {dates.map(({ full, formatted }) => {
                  const isWeekend = [0, 6].includes(full.getDay())
                  return (
                    <th
                      key={formatted}
                      className={`px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                        isWeekend ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase">
                        {format(full, 'EEE', { locale: currentLocale })}
                      </div>
                      <div className="text-[11px]">
                        {format(full, 'dd/MM', { locale: currentLocale })}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={index % 2 === 0 ? styles.bodyRow : styles.stripedRow}
                  >
                    <td className={styles.stickyNameColumn}>
                      <div className={styles.employeeName}>{employee.full_name}</div>
                    </td>
                    <td className={styles.stickyDepartmentColumn}>
                      <div className={styles.employeeInfo}>
                        {translateDepartment(employee.department, t)}
                      </div>
                    </td>
                    <td className={styles.stickyTeamColumn}>
                      <div className={styles.employeeInfo}>
                        {translateTeam(employee.team, t)}
                      </div>
                    </td>
                    {dates.map(({ full, formatted }) => {
                      const isWeekend = [0, 6].includes(full.getDay())
                      return (
                        <td 
                          key={formatted} 
                          className={`${styles.bodyCell} ${isWeekend ? styles.weekendDay : ''}`}
                        >
                          <ShiftCell
                            employeeId={employee.id}
                            date={formatted}
                            shift={employee.shifts[formatted]}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={dates.length + 3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {t('shifts.noShifts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 