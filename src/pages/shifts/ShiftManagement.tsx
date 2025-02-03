import React, { useState } from 'react'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService, type Shift } from '@/services/shiftService'
import { ShiftEditModal } from '@/components/shifts/ShiftEditModal'
import { ShiftCell } from '@/components/shifts/ShiftCell'

interface EmployeeWithShifts {
  id: string
  full_name: string
  team: string
  role: string
  shifts: Record<string, Shift>
}

interface EditModalState {
  isOpen: boolean
  employeeId: string
  date: string
  currentShift?: Shift
}

export function ShiftManagement() {
  const [filter, setFilter] = useState({
    name: '',
    team: ''
  })

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    employeeId: '',
    date: ''
  })

  // Gerar datas dos próximos 30 dias
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i)
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
    queryFn: employeeService.list
  })

  // Buscar turnos
  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftService.getShifts(
      dates[0].formatted,
      dates[dates.length - 1].formatted
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Gestão de Turnos
          </h1>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th 
                      scope="col" 
                      className="sticky left-0 z-10 bg-white py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                    >
                      <div className="text-base">Funcionário</div>
                    </th>
                    {dates.map(date => (
                      <th
                        key={date.formatted}
                        scope="col"
                        className="p-2 text-center text-sm font-semibold text-gray-900 min-w-[6rem] bg-white"
                      >
                        <div className="text-xs sm:text-sm uppercase tracking-wider">
                          {date.display.weekday}
                        </div>
                        <div className="text-xs sm:text-sm font-bold mt-0.5">
                          {date.display.date}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredEmployees.map((employee, index) => (
                    <tr key={employee.id} className="even:bg-gray-50/80">
                      <td 
                        className={`
                          sticky left-0 z-10 whitespace-nowrap py-3 pl-4 pr-3 sm:pl-6 lg:pl-8
                          shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}
                        `}
                      >
                        <div className="text-base font-semibold text-gray-900">
                          {employee.full_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Time {employee.team} • {employee.role}
                        </div>
                      </td>
                      {dates.map(date => (
                        <ShiftCell
                          key={date.formatted}
                          employeeId={employee.id}
                          date={date.formatted}
                          shift={employee.shifts[date.formatted]}
                          onEdit={handleCellClick}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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