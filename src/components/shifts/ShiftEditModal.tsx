import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shiftService, type Shift } from '@/services/shiftService'
import { Dialog } from '@headlessui/react'

type ShiftType = '🔴' | '🟢' | '🔵' | '⚪'

interface ShiftEditModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: string
  date: string
  currentShift?: Shift
}

export function ShiftEditModal({
  isOpen,
  onClose,
  employeeId,
  date,
  currentShift
}: ShiftEditModalProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Shift>>({
    shift_type: currentShift?.shift_type || undefined,
    mission: currentShift?.mission || ''
  })

  const mutation = useMutation({
    mutationFn: async (data: Partial<Shift>) => {
      try {
        if (currentShift) {
          return await shiftService.update(currentShift.id, {
            ...currentShift,
            ...data
          })
        } else {
          return await shiftService.create({
            employee_id: employeeId,
            date,
            shift_type: data.shift_type!,
            mission: data.mission || ''
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar turno')
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      onClose()
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.shift_type) {
      setError('O tipo de turno é obrigatório')
      return
    }

    mutation.mutate(formData)
  }

  const handleDelete = async () => {
    if (!currentShift?.id) return

    try {
      await shiftService.delete(currentShift.id)
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir turno')
    }
  }

  const handleShiftTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      shift_type: value as ShiftType
    }))
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-6 w-full">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {currentShift ? 'Editar Turno' : 'Novo Turno'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="shift_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Turno
              </label>
              <select
                id="shift_type"
                value={formData.shift_type || ''}
                onChange={(e) => handleShiftTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                aria-label="Selecione o tipo de turno"
              >
                <option value="">Selecione um turno</option>
                <option value="🔴">🔴 Manhã</option>
                <option value="🟢">🟢 Tarde</option>
                <option value="🔵">🔵 Noite</option>
                <option value="⚪">⚪ Folga</option>
              </select>
            </div>

            <div>
              <label htmlFor="mission" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Missão/Observação
              </label>
              <input
                id="mission"
                type="text"
                value={formData.mission}
                onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Digite a missão ou observação"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-between pt-4">
              <div className="space-x-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {mutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
              </div>

              {currentShift && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:text-red-700 focus:outline-none"
                >
                  Excluir
                </button>
              )}
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 
