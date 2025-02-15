import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService } from '@/services/shiftService'
import { FiUsers, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import { ReadOnlyShiftTable } from '@/components/shifts/ReadOnlyShiftTable'
import { YearlyCalendar } from '@/components/shifts/YearlyCalendar'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthContext } from '@/providers/AuthProvider'
import { useTranslation } from 'react-i18next'

export function Dashboard() {
  const { isAdmin } = useAuthContext()
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

  const { t } = useTranslation()

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
    <div className="space-y-6 px-4">
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Card de Funcionários */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FiUsers className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">
                  {t('dashboard.stats.employees')}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-blue-600">
                    {employees.length}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    funcionários
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Turnos */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FiCalendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">
                  {t('dashboard.stats.shifts')} 7 {t('shifts.stats.days')}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-green-600">
                    {shifts.length}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    próx. 7 dias
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Média */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FiTrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-500">
                  {t('dashboard.stats.average')}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-purple-600">
                    {employees.length > 0
                      ? (shifts.length / employees.length).toFixed(1)
                      : '0'}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    por funcionário
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Turnos */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {t('shifts.workPlan')} {t('shifts.from')} {format(new Date(), "dd 'de' MMMM", { locale: ptBR })} {t('shifts.to')} {format(addDays(new Date(), 6), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>
        <ReadOnlyShiftTable />
      </div>

      {/* Calendário Anual */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <YearlyCalendar />
      </div>
    </div>
  )
} 