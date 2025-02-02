import React, { useState } from 'react'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService, type Shift } from '@/services/shiftService'
import { ShiftEditModal } from '@/components/shifts/ShiftEditModal'

export type ShiftType = '🔴' | '🟢' | '🔵' | '⚪'
export type MissionType = 'ZK' | 'Lab Messung' | 'K' | 'U' | 'Lab Koordinator' | string

interface ShiftData {
  date: Date
  shift: ShiftType
  mission: MissionType
}

export interface EmployeeShift {
  id: string
  name: string
  department: string
  team: 'A' | 'B' | 'C' | 'D'
  shifts: Record<string, ShiftData>
}

interface EditModalState {
  isOpen: boolean
  employeeId: string
  date: string
  currentShift?: Shift
}

interface EmployeeWithShifts {
  id: string
  full_name: string
  team: string
  shifts: Record<string, Shift>
}

export function ShiftManagement() {
  const [filter, setFilter] = useState({
    name: '',
    shift: '' as Shift['shift_type'] | '',
    date: '',
    team: ''
  })

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    employeeId: '',
    date: ''
  })

  // Gerar datas dos próximos 15 dias
  const dates = Array.from({ length: 15 }, (_, i) => {
    const date = addDays(new Date(), i)
    return {
      full: date,
      formatted: format(date, 'EEE. dd.MM.yyyy', { locale: ptBR })
    }
  })

  // Buscar funcionários
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.list
  })

  // Buscar turnos
  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftService.getShifts(
      format(dates[0].full, 'yyyy-MM-dd'),
      format(dates[dates.length - 1].full, 'yyyy-MM-dd')
    )
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

  const handleCellClick = (employeeId: string, date: string, currentShift?: Shift) => {
    setEditModal({
      isOpen: true,
      employeeId,
      date,
      currentShift
    })
  }

  if (isLoadingEmployees || isLoadingShifts) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Gestão de Turnos
        </h1>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filter.name}
          onChange={(e) => setFilter(prev => ({ ...prev, name: e.target.value }))}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={filter.team}
          onChange={(e) => setFilter(prev => ({ ...prev, team: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Filtrar por time"
        >
          <option value="">Todos os Times</option>
          <option value="A">Time A</option>
          <option value="B">Time B</option>
          <option value="C">Time C</option>
          <option value="D">Time D</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Funcionário
              </th>
              {dates.map(date => (
                <th
                  key={date.formatted}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {date.formatted}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.full_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Time {employee.team}
                  </div>
                </td>
                {dates.map(date => {
                  const formattedDate = format(date.full, 'yyyy-MM-dd')
                  const shift = employee.shifts[formattedDate]
                  return (
                    <td
                      key={date.formatted}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleCellClick(employee.id, formattedDate, shift)}
                    >
                      {shift ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">{shift.shift_type}</span>
                          <span className="text-xs">{shift.mission}</span>
                        </div>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ShiftEditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
        employeeId={editModal.employeeId}
        date={editModal.date}
        currentShift={editModal.currentShift}
      />
    </div>
  )
} 