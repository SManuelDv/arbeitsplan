import React, { useState } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService } from '@/services/shiftService'
import { FiFilter, FiX } from 'react-icons/fi'
import styles from './ReadOnlyShiftTable.module.css'

interface EmployeeWithShifts {
  id: string
  full_name: string
  department: string
  team: string
  shifts: Record<string, any>
}

const SHIFT_COLORS = {
  '🔴': 'text-red-500',
  '🟢': 'text-green-500',
  '🔵': 'text-blue-500',
  '⚪': 'text-gray-400'
}

export function ReadOnlyShiftTable() {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    team: ''
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Gerar datas dos próximos 7 dias
  const dates = Array.from({ length: 7 }, (_, i) => {
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

  // Buscar funcionários
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.list,
    staleTime: 5 * 60 * 1000 // 5 minutos
  })

  // Buscar turnos para os próximos 7 dias
  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts', dates[0].formatted, dates[dates.length - 1].formatted],
    queryFn: () => shiftService.getShifts(
      dates[0].formatted,
      dates[dates.length - 1].formatted
    ),
    staleTime: 0,
    refetchInterval: 5000
  })

  // Combinar funcionários com seus turnos
  const employeesWithShifts: EmployeeWithShifts[] = employees.map(employee => {
    const employeeShifts = shifts
      .filter(shift => shift.employee_id === employee.id)
      .reduce((acc, shift) => ({
        ...acc,
        [shift.date]: shift
      }), {} as Record<string, any>)

    return {
      ...employee,
      shifts: employeeShifts
    }
  })

  // Filtrar funcionários
  const filteredEmployees = employeesWithShifts.filter(employee => {
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
      {/* Botão de Filtro */}
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
                  const shift = employee.shifts[formatted]
                  return (
                    <td 
                      key={formatted} 
                      className={`${styles.bodyCell} ${isWeekend ? styles.weekendDay : ''}`}
                    >
                      {shift && (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div className={`text-lg font-bold leading-none ${SHIFT_COLORS[shift.shift_type]}`}>
                            {shift.shift_type}
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