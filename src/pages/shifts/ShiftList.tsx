import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { FiPlus } from 'react-icons/fi'
import { ShiftFilter } from './ShiftFilter'
import { Menu } from '@headlessui/react'

type ShiftType = 'K' | 'Lab Messung' | 'ZK' | 'CP Verpacker' | 'fU' | 'Lab Koordinator' | 
  'PC SAP' | 'PC Spleisser' | 'PC Training' | 'SV AGM' | 'SV Battery' | 'SV CSX' | 
  'U' | 'WW Bevorrater' | 'WW CaseLoader' | null;
type ShiftColor = 'blue' | 'green' | 'red' | 'gray';

interface ShiftData {
  type: ShiftType;
  color: ShiftColor;
}

interface Filters {
  name: string;
  department: string;
  team: string;
}

const SHIFT_COLORS = {
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-blue-700',
    light: 'bg-blue-50',
    label: '',  // Removendo a letra
    title: 'Noite'
  },
  green: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-green-700',
    light: 'bg-green-50',
    label: '',  // Removendo a letra
    title: 'Tarde'
  },
  red: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-red-700',
    light: 'bg-red-50',
    label: '',  // Removendo a letra
    title: 'Manhã'
  },
  gray: {
    bg: 'bg-gray-200',
    hover: 'hover:bg-gray-300',
    text: 'text-gray-700',
    light: 'bg-gray-50',
    label: '',  // Removendo a letra
    title: 'Folga'
  }
} as const

const FUNCTIONS = [
  'CP Verpacker',
  'fU',
  'K',
  'Lab Koordinator',
  'Lab Messung',
  'PC SAP',
  'PC Spleisser',
  'PC Training',
  'SV AGM',
  'SV Battery',
  'SV CSX',
  'U',
  'WW Bevorrater',
  'WW CaseLoader',
  'ZK'
] as const

// Mock data for shifts
const INITIAL_SHIFTS: Record<string, ShiftData[]> = {
  'Isabel Rodrigues': [
    { type: 'K', color: 'blue' },
    { type: 'K', color: 'red' },
    { type: 'ZK', color: 'red' },
    { type: 'ZK', color: 'red' }
  ],
  'Maria António 2': [
    { type: 'Lab Messung', color: 'green' },
    { type: 'Lab Messung', color: 'gray' },
    { type: 'ZK', color: 'red' },
    { type: 'ZK', color: 'red' }
  ]
}

export function ShiftList() {
  const [shifts, setShifts] = useState<Record<string, ShiftData[]>>(INITIAL_SHIFTS)
  const [filters, setFilters] = useState<Filters>({
    name: '',
    department: '',
    team: ''
  })

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.list()
  })

  const filteredEmployees = useMemo(() => {
    if (!employees) return []

    return employees.filter(employee => {
      const nameMatch = employee.full_name.toLowerCase().includes(filters.name.toLowerCase())
      const departmentMatch = !filters.department || employee.department === filters.department
      const teamMatch = !filters.team || employee.team === filters.team

      return nameMatch && departmentMatch && teamMatch
    })
  }, [employees, filters])

  // Gerar próximos 30 dias a partir do dia atual
  const weekDates = useMemo(() => {
    const today = new Date()
    
    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  }, [])

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 é domingo, 6 é sábado
  }

  const formatWeekDay = (date: Date) => {
    const weekDay = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date)
    return weekDay.slice(0, 3).toLowerCase() + '.'
  }

  const handleShiftChange = (employeeName: string, dateIndex: number, newColor: ShiftColor, newType: ShiftType) => {
    setShifts(prev => {
      const employeeShifts = [...(prev[employeeName] || [])]
      employeeShifts[dateIndex] = { type: newType, color: newColor }
      
      return {
        ...prev,
        [employeeName]: employeeShifts
      }
    })
  }

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
        Erro ao carregar dados
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Gestão de Turnos
        </h1>
        <div className="flex items-center gap-3">
          <ShiftFilter onFilterChange={setFilters} />
          <Link
            to="/shifts/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <FiPlus className="w-4 h-4" />
            Novo Turno
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <table className="min-w-full relative">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-200">
                  <th className="sticky left-0 bg-white z-20 py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap min-w-[200px]">
                    Nome
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-bold text-gray-500 uppercase whitespace-nowrap min-w-[150px]">
                    Departamento
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-bold text-gray-500 uppercase whitespace-nowrap min-w-[100px]">
                    Time
                  </th>
                  {weekDates.map(date => (
                    <React.Fragment key={date.toISOString()}>
                      <th 
                        className={`
                          py-3 px-2 text-center text-xs font-bold uppercase whitespace-nowrap min-w-[50px]
                          border-r border-gray-100
                          ${isWeekend(date) ? 'text-red-500 bg-red-50' : 'text-gray-500'}
                        `}
                      >
                        <div className="font-bold tracking-wider">{formatWeekDay(date)}</div>
                        <div className="mt-1 font-medium">
                          {new Intl.DateTimeFormat('pt-BR', { 
                            day: '2-digit',
                            month: '2-digit'
                          }).format(date)}
                        </div>
                      </th>
                      <th className={`min-w-[100px] ${isWeekend(date) ? 'bg-red-50' : ''}`} />
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr 
                    key={employee.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="sticky left-0 z-10 py-4 px-6 bg-inherit">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.full_name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm text-gray-500">
                        {employee.department}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm font-medium text-gray-700">
                        {employee.team}
                      </div>
                    </td>
                    {weekDates.map((date, dateIndex) => {
                      const employeeShifts = shifts[employee.full_name] || []
                      const shift = employeeShifts[dateIndex]
                      const isWeekendDay = isWeekend(date)
                      const colors = shift ? SHIFT_COLORS[shift.color] : SHIFT_COLORS.gray
                      
                      return (
                        <React.Fragment key={date.toISOString()}>
                          {/* Coluna de Turnos */}
                          <td 
                            className={`
                              py-2 px-3 text-center relative
                              ${isWeekendDay ? 'bg-red-50' : ''}
                            `}
                          >
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button className="inline-flex items-center justify-center">
                                <div 
                                  className={`
                                    w-6 h-6 rounded-full 
                                    flex items-center justify-center 
                                    text-white text-sm font-medium
                                    transition-all duration-200 
                                    transform hover:scale-110 
                                    cursor-pointer
                                    shadow-sm
                                    aspect-square
                                    ${colors.bg} ${colors.hover}
                                  `}
                                  title={colors.title}
                                >
                                  {colors.label}
                                </div>
                              </Menu.Button>

                              <Menu.Items className="absolute z-30 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-2">
                                  <div className="grid grid-cols-4 gap-3">
                                    {(Object.entries(SHIFT_COLORS) as [ShiftColor, typeof SHIFT_COLORS[keyof typeof SHIFT_COLORS]][]).map(([color, colorData]) => (
                                      <Menu.Item key={color}>
                                        {({ active }) => (
                                          <button
                                            onClick={() => handleShiftChange(
                                              employee.full_name,
                                              dateIndex,
                                              color,
                                              shift?.type || null
                                            )}
                                            className={`
                                              w-6 h-6 rounded-full
                                              flex items-center justify-center
                                              text-white text-sm font-medium
                                              transition-all duration-200
                                              aspect-square
                                              shadow-sm
                                              ${colorData.bg} ${colorData.hover}
                                              ${active ? 'ring-2 ring-offset-2 ring-gray-200 scale-110' : ''}
                                            `}
                                            title={colorData.title}
                                          >
                                            {colorData.label}
                                          </button>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </div>
                                </div>
                              </Menu.Items>
                            </Menu>
                          </td>

                          {/* Coluna de Funções */}
                          <td 
                            className={`
                              py-2 px-3 text-center relative
                              ${isWeekendDay ? 'bg-red-50' : ''}
                            `}
                          >
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button 
                                className="inline-flex items-center justify-center px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded"
                              >
                                <span className="truncate max-w-[120px]">
                                  {shift?.type || '—'}
                                </span>
                              </Menu.Button>

                              <Menu.Items className="absolute z-30 mt-1 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {FUNCTIONS.map(func => (
                                    <Menu.Item key={func}>
                                      {({ active }) => (
                                        <button
                                          onClick={() => handleShiftChange(
                                            employee.full_name,
                                            dateIndex,
                                            shift?.color || 'gray',
                                            func
                                          )}
                                          className={`
                                            w-full text-left px-3 py-1.5 text-sm
                                            ${active ? 'bg-gray-50' : ''}
                                            ${shift?.type === func ? 'font-medium text-primary-600' : 'text-gray-700'}
                                          `}
                                        >
                                          {func}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleShiftChange(
                                          employee.full_name,
                                          dateIndex,
                                          shift?.color || 'gray',
                                          null
                                        )}
                                        className={`
                                          w-full text-left px-3 py-1.5 text-sm
                                          ${active ? 'bg-gray-50' : ''}
                                          text-gray-400 border-t border-gray-100
                                        `}
                                      >
                                        Sem função
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Menu>
                          </td>
                        </React.Fragment>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 
