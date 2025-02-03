import React, { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'

interface FilterProps {
  onFilterChange: (filters: {
    name: string
    department: string
    team: string
  }) => void
}

export function EmployeeFilter({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    team: ''
  })

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { name: '', department: '', team: '' }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <FiFilter className="w-4 h-4" />
        {Object.values(filters).some(v => v) && (
          <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-primary-500 rounded-full">
            {Object.values(filters).filter(v => v).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-72">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="filter-department" className="block text-sm font-medium text-gray-700">Departamento</label>
              <select
                id="filter-department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filtrar por departamento"
              >
                <option value="">Todos</option>
                <option value="CasePack">CasePack</option>
                <option value="Labor">Labor</option>
                <option value="PrepCenter">PrepCenter</option>
                <option value="Service">Service</option>
                <option value="Wipes">Wipes</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-team" className="block text-sm font-medium text-gray-700">Time</label>
              <select
                id="filter-team"
                value={filters.team}
                onChange={(e) => handleFilterChange('team', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filtrar por time"
              >
                <option value="">Todos</option>
                <option value="A">Time A</option>
                <option value="B">Time B</option>
                <option value="C">Time C</option>
                <option value="D">Time D</option>
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <FiX className="w-4 h-4" />
                Limpar filtros
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 