import React, { useState } from 'react'
import type { Shift } from '@/services/shiftService'

interface ShiftCellProps {
  employeeId: string
  date: string
  shift?: Shift
  onEdit: (employeeId: string, date: string, currentShift?: Shift) => void
}

const SHIFT_COLORS = {
  '🔴': 'bg-red-100 hover:bg-red-200',
  '🟢': 'bg-green-100 hover:bg-green-200',
  '🔵': 'bg-blue-100 hover:bg-blue-200',
  '⚪': 'bg-gray-100 hover:bg-gray-200'
} as const

export function ShiftCell({ employeeId, date, shift, onEdit }: ShiftCellProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleClick = () => {
    if (!isUpdating) {
      onEdit(employeeId, date, shift)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isUpdating) {
      onEdit(employeeId, date, shift)
    }
  }

  const shiftType = shift?.shift_type || '⚪'
  const bgColor = SHIFT_COLORS[shiftType]

  return (
    <td 
      className={`
        relative p-0 text-center cursor-pointer select-none
        min-w-[6rem] max-w-[8rem] transition-all duration-200
        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      title="Clique para editar o turno"
    >
      <div className={`
        w-full h-full min-h-[5rem] p-2
        flex flex-col items-center justify-center gap-2
        ${bgColor}
      `}>
        <div className="text-4xl sm:text-5xl font-bold leading-none">
          {shiftType}
        </div>
        {shift?.mission && (
          <div className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-full px-1">
            {shift.mission}
          </div>
        )}
      </div>

      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </td>
  )
} 