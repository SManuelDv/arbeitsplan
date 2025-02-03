import React, { useState } from 'react'
import { FiFilter } from 'react-icons/fi'

interface Filters {
  name: string;
  department: string;
  team: string;
}

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
}

export function ShiftFilter({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    name: '',
    department: '',
    team: ''
  })

  const handleFilterChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { name: '', department: '', team: '' }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
    setIsOpen(false)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  id="filter-name"
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Buscar por nome..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="filter-department" className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <select
                  id="filter-department"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Empacotamento">Empacotamento</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-team" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  id="filter-team"
                  value={filters.team}
                  onChange={(e) => handleFilterChange('team', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="A">Time A</option>
                  <option value="B">Time B</option>
                  <option value="C">Time C</option>
                  <option value="D">Time D</option>
                </select>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
