import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { shiftService } from '@/services/shiftService'
import { FiPlus } from 'react-icons/fi'
import { ShiftFilter } from './ShiftFilter'
import { Menu } from '@headlessui/react'
import { ShiftCell } from '@/components/shifts/ShiftCell'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
  const [filters, setFilters] = useState<Filters>({
    name: '',
    department: '',
    team: ''
  })

  // Buscar funcionários
  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.list()
  })

  // Calcular a semana atual
  const currentWeek = useMemo(() => {
    const now = new Date()
    const start = startOfWeek(now, { weekStartsOn: 1 }) // Segunda-feira
    const end = endOfWeek(now, { weekStartsOn: 1 }) // Domingo
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    }
  }, [])

  // Buscar turnos
  const shiftsQuery = useQuery({
    queryKey: ['shifts', currentWeek.start, currentWeek.end],
    queryFn: () => shiftService.getShifts(currentWeek.start, currentWeek.end),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  })

  // Filtrar funcionários
  const filteredEmployees = useMemo(() => {
    if (!employeesQuery.data) return []

    return employeesQuery.data.filter(employee => {
      const nameMatch = employee.full_name.toLowerCase().includes(filters.name.toLowerCase())
      const departmentMatch = !filters.department || employee.department === filters.department
      const teamMatch = !filters.team || employee.team === filters.team
      return nameMatch && departmentMatch && teamMatch
    })
  }, [employeesQuery.data, filters])

  // Gerar datas da semana
  const weekDays = useMemo(() => {
    const start = new Date(currentWeek.start)
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(format(date, 'yyyy-MM-dd'))
    }
    return dates
  }, [currentWeek])

  if (employeesQuery.isLoading || shiftsQuery.isLoading) {
    return <div>Carregando...</div>
  }

  if (employeesQuery.isError || shiftsQuery.isError) {
    return <div>Erro ao carregar dados</div>
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">Gestão de Turnos</h1>
        <div className="flex items-center">
          <ShiftFilter filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th scope="col" className="px-2 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {weekDays.map(date => (
                <th key={date} scope="col" className="px-2 py-1 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  {format(new Date(date), 'EEE, dd/MM', { locale: ptBR })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="text-[11px] font-medium text-gray-900">{employee.full_name}</div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="text-[11px] text-gray-500">{employee.department}</div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="text-[11px] text-gray-500">{employee.team}</div>
                </td>
                {weekDays.map(date => {
                  const shift = shiftsQuery.data?.find(
                    s => s.employee_id === employee.id && s.date === date
                  )
                  return (
                    <ShiftCell
                      key={`${employee.id}-${date}`}
                      employeeId={employee.id}
                      date={date}
                      shift={shift}
                    />
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
