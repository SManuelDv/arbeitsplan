import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { FiPlus, FiFilter, FiX } from 'react-icons/fi'

interface ShiftFilter {
  name: string
  department: string
  team: string
}

export function ShiftList() {
  const [filters, setFilters] = useState<ShiftFilter>({
    name: '',
    department: '',
    team: ''
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({ name: '', department: '', team: '' })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 text-xs text-red-700 bg-red-50 rounded-md border border-red-200">
        Erro ao carregar dados
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium text-gray-900 dark:text-white">
          Gestão de Turnos
        </h1>
        <div className="flex items-center gap-3">
          {/* Filtro */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Filtrar lista"
            >
              <FiFilter className="w-3.5 h-3.5" />
              {Object.values(filters).some(v => v) && (
                <span className="flex items-center justify-center w-4 h-4 text-[10px] text-white bg-primary-500 rounded-full">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-64">
                <div className="p-3 space-y-3">
                  <div>
                    <label htmlFor="filter-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome
                    </label>
                    <input
                      id="filter-name"
                      type="text"
                      value={filters.name}
                      onChange={(e) => handleFilterChange('name', e.target.value)}
                      placeholder="Buscar por nome..."
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-department" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Departamento
                    </label>
                    <select
                      id="filter-department"
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos</option>
                      <option value="Laboratório">Laboratório</option>
                      <option value="Empacotamento">Empacotamento</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter-team" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <select
                      id="filter-team"
                      value={filters.team}
                      onChange={(e) => handleFilterChange('team', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos</option>
                      <option value="A">Time A</option>
                      <option value="B">Time B</option>
                      <option value="C">Time C</option>
                      <option value="D">Time D</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                    >
                      <FiX className="w-3.5 h-3.5" />
                      Limpar
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/shifts/new"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Novo Turno
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {employee.full_name}
                    </div>
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {employee.department}
                    </div>
                  </td>
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Time {employee.team}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 