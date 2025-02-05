import React, { useState, useEffect } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService, type Shift } from '@/services/shiftService'
import { ShiftCell } from '@/components/shifts/ShiftCell'
import { toast } from 'react-hot-toast'
import { supabase } from '@/config/supabaseClient'
import styles from './ShiftManagement.module.css'

interface EmployeeWithShifts {
  id: string
  full_name: string
  department: string
  team: string
  role: string
  shifts: Record<string, Shift>
}

export function ShiftManagement() {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState({
    name: '',
    team: ''
  })

  // Gerar datas dos próximos 30 dias
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startOfToday(), i)
    return {
      full: date,
      formatted: format(date, 'yyyy-MM-dd'),
      display: {
        weekday: format(date, 'EEE', { locale: ptBR }),
        date: format(date, 'dd/MM', { locale: ptBR })
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
    <div className="px-4 sm:px-6 lg:px-8 pt-2">
      <div className="sm:flex sm:items-center sm:justify-between mb-2">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-black text-gray-900">
            Gestão de Turnos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {format(dates[0].full, "dd 'de' MMMM", { locale: ptBR })} - {format(dates[dates.length - 1].full, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyHeaderName}>
                <div className="text-[10px] uppercase">Nome</div>
              </th>
              <th className={styles.stickyHeaderDepartment}>
                <div className="text-[10px] uppercase">Departamento</div>
              </th>
              <th className={styles.stickyHeaderTeam}>
                <div className="text-[10px] uppercase">Time</div>
              </th>
              {dates.map(({ full, formatted }) => {
                const isWeekend = [0, 6].includes(full.getDay())
                return (
                  <th
                    key={formatted}
                    className={`${styles.headerCell} ${isWeekend ? styles.weekendDay : ''}`}
                  >
                    <div className="text-[10px] uppercase">{format(full, 'EEE', { locale: ptBR })}</div>
                    <div className="text-[11px]">{format(full, 'dd/MM')}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className={index % 2 === 0 ? styles.bodyRow : styles.stripedRow}
              >
                <td className={styles.stickyNameColumn}>
                  <div className={styles.employeeName}>{employee.full_name}</div>
                </td>
                <td className={styles.stickyDepartmentColumn}>
                  <div className={styles.employeeInfo}>
                    {employee.department}
                  </div>
                </td>
                <td className={styles.stickyTeamColumn}>
                  <div className={styles.employeeInfo}>
                    Time {employee.team}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 