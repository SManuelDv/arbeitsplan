import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService } from '@/services/shiftService'

export function Dashboard() {
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.list
  })

  const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftService.getShifts(
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    )
  })

  if (isLoadingEmployees || isLoadingShifts) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Funcionários */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Funcionários
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {employees.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de funcionários cadastrados
          </p>
        </div>

        {/* Card de Turnos */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Turnos
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {shifts.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Turnos nos próximos 7 dias
          </p>
        </div>

        {/* Card de Média */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Média
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {employees.length > 0
              ? (shifts.length / employees.length).toFixed(1)
              : '0'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Turnos por funcionário
          </p>
        </div>
      </div>

      {/* Lista de Próximos Turnos */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Próximos Turnos
        </h3>
        <div className="space-y-4">
          {shifts.slice(0, 5).map((shift) => {
            const employee = employees.find(e => e.id === shift.employee_id)
            return (
              <div
                key={shift.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {employee?.full_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(shift.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{shift.shift_type}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {shift.mission}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 