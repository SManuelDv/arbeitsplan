import React, { useState } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService, type ShiftType } from '@/services/shiftService'
import { FiFilter, FiX } from 'react-icons/fi'
import styles from './ReadOnlyShiftTable.module.css'
import { useAuthContext } from '@/providers/AuthProvider'
import { Employee } from '../../services/employeeService'
import { useTranslation } from 'react-i18next'

type MissionType = 'ZK' | 'Lab Messung' | 'K' | 'U' | 'Lab Koordinator' | 'CP Verpacker' | 'fU' | 'PC SAP' | 'PC Spleisser' | 'PC Training' | 'SV AGM' | 'SV Battery' | 'SV CSX' | 'WW Bevorrater' | 'WW CaseLoader'

interface Shift {
  employee_id: string
  date: string
  shift_type: ShiftType
  mission: MissionType | null
  id?: string
  created_at?: string
  updated_at?: string
}

interface EmployeeWithShifts {
  id: string
  full_name: string
  department: string
  team: string
  shifts: Record<string, Shift>
}

const SHIFT_COLORS: Record<string, string> = {
  '🔴': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  '🟢': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  '🔵': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  '⚪': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
} as const;

const SHIFT_EMOJIS: Record<string, string> = {
  '🔴': 'morning',
  '🟢': 'afternoon',
  '🔵': 'night',
  '⚪': 'off'
} as const;

function getShiftColor(shift: Shift) {
  if (!shift) {
    return SHIFT_COLORS['⚪']
  }
  return SHIFT_COLORS[shift.shift_type as keyof typeof SHIFT_COLORS]
}

export function ReadOnlyShiftTable() {
  const { profile, isAdmin } = useAuthContext()
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    team: ''
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { t } = useTranslation()

  // Gerar datas dos próximos 7 dias
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => format(addDays(today, i), 'yyyy-MM-dd'))

  // Buscar funcionários
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.list,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  // Buscar turnos para os próximos 7 dias
  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts', dates[0], dates[dates.length - 1]],
    queryFn: () => shiftService.getShifts(dates[0], dates[dates.length - 1])
  })

  // Combinar funcionários com seus turnos
  const employeesWithShifts: EmployeeWithShifts[] = employees.map(employee => {
    const employeeShifts = shifts
      .filter(shift => shift.employee_id === employee.id)
      .reduce((acc, shift) => {
        acc[shift.date] = shift
        return acc
      }, {} as Record<string, Shift>)

    return {
      ...employee,
      shifts: employeeShifts
    }
  })

  // Filtrar funcionários com base no perfil do usuário e filtros aplicados
  const filteredEmployees = employeesWithShifts.filter(employee => {
    // Primeiro, aplicar restrição por departamento se não for admin
    if (!isAdmin && profile?.department) {
      if (employee.department !== profile.department) {
        return false
      }
    }

    // Depois aplicar os filtros normais
    const nameMatch = employee.full_name.toLowerCase().includes(filters.name.toLowerCase())
    const departmentMatch = !filters.department || employee.department === filters.department
    const teamMatch = !filters.team || employee.team === filters.team
    return nameMatch && departmentMatch && teamMatch
  })

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({ name: '', department: '', team: '' })
  }

  if (isLoadingEmployees || isLoadingShifts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div>
      {/* Botão de Filtro - Mostrar apenas para admin */}
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative ${
                hasActiveFilters ? 'text-primary-600 border-primary-600' : 'text-gray-500'
              }`}
              title="Filtrar lista"
              aria-label="Filtrar lista"
            >
              <FiFilter className="w-5 h-5" />
              {hasActiveFilters && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] font-medium text-white bg-primary-600 rounded-full flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
            </button>

            {/* Popover de Filtros */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4 z-50">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="filter-name" className="block text-xs font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      id="filter-name"
                      type="text"
                      placeholder="Filtrar por nome..."
                      value={filters.name}
                      onChange={e => handleFilterChange('name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-department" className="block text-xs font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <select
                      id="filter-department"
                      value={filters.department}
                      onChange={e => handleFilterChange('department', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos</option>
                      <option value="CP">CP</option>
                      <option value="Lab">Lab</option>
                      <option value="PC">PC</option>
                      <option value="SV">SV</option>
                      <option value="WW">WW</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter-team" className="block text-xs font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      id="filter-team"
                      value={filters.team}
                      onChange={e => handleFilterChange('team', e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos</option>
                      <option value="A">Time A</option>
                      <option value="B">Time B</option>
                      <option value="C">Time C</option>
                      <option value="D">Time D</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                    >
                      <FiX className="w-4 h-4" />
                      Limpar filtros
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3 py-1 text-xs text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
              {dates.map((date) => {
                const isWeekend = [0, 6].includes(new Date(date).getDay())
                return (
                  <th
                    key={date}
                    className={`${styles.headerCell} ${isWeekend ? styles.weekendDay : ''}`}
                  >
                    <div className="text-[10px] uppercase">{format(new Date(date), 'EEE', { locale: ptBR })}</div>
                    <div className="text-[11px]">{format(new Date(date), 'dd/MM')}</div>
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
                {dates.map((date) => {
                  const isWeekend = [0, 6].includes(new Date(date).getDay())
                  const shift = employee.shifts[date]
                  return (
                    <td 
                      key={date} 
                      className={`${styles.bodyCell} ${isWeekend ? styles.weekendDay : ''}`}
                    >
                      {shift && (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div className={`text-lg font-bold leading-none ${getShiftColor(shift)}`}>
                            {t(`shifts.types.${shift.shift_type}`)}
                          </div>
                          {shift.mission && (
                            <div className="text-[9px] text-gray-700 font-medium whitespace-nowrap overflow-visible">
                              {shift.mission}
                            </div>
                          )}
                        </div>
                      )}
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