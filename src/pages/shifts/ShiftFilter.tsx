import React, { useState } from 'react'
import { FiFilter } from 'react-icons/fi'

interface Filters {
  name: string;
  department: string;
  team: string;
}

interface FilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function ShiftFilter({ filters, onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<Filters>(filters)

  const handleFilterChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { name: '', department: '', team: '' }
    setLocalFilters(emptyFilters)
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
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={localFilters.name}
              onChange={e => handleFilterChange('name', e.target.value)}
              className="px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <select
              value={localFilters.department}
              onChange={e => handleFilterChange('department', e.target.value)}
              className="px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Departamento</option>
              <option value="CP">CP</option>
              <option value="Lab">Lab</option>
              <option value="PC">PC</option>
              <option value="SV">SV</option>
              <option value="WW">WW</option>
            </select>
            <select
              value={localFilters.team}
              onChange={e => handleFilterChange('team', e.target.value)}
              className="px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Time</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-2 py-1 text-[11px] text-gray-600 hover:text-gray-900"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 
