import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shiftService, type Shift } from '@/services/shiftService'
import { Dialog } from '@headlessui/react'

const SHIFT_TYPES = ['🔴', '🟢', '🔵', '⚪'] as const
const SHIFT_LABELS = {
  '🔴': 'Manhã',
  '🟢': 'Tarde',
  '🔵': 'Noite',
  '⚪': 'Folga'
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
    shift_type: currentShift?.shift_type || '⚪',
    mission: currentShift?.mission || null
  })

  useEffect(() => {
    // Atualizar formData quando o currentShift mudar
    setFormData({
      shift_type: currentShift?.shift_type || '⚪',
      mission: currentShift?.mission || null
    })
  }, [currentShift])

  const mutation = useMutation({
    mutationFn: async (data: Partial<Shift>) => {
      try {
        if (currentShift?.id) {
          return await shiftService.update(currentShift.id, data)
        } else {
          return await shiftService.create({
            employee_id: employeeId,
            date,
            shift_type: data.shift_type!,
            mission: data.mission
          })
        }
      } catch (err) {
        console.error('Erro ao salvar turno:', err)
        setError(err instanceof Error ? err.message : 'Erro ao salvar turno')
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      onClose()
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.shift_type) {
      setError('Selecione um turno')
      return
    }

    mutation.mutate(formData)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
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
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {currentShift ? 'Editar Turno' : 'Novo Turno'}
          </Dialog.Title>

          {error && (
            <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="shift_type" className="block text-sm font-medium text-gray-700 mb-1">
                Turno
              </label>
              <select
                id="shift_type"
                name="shift_type"
                value={formData.shift_type || '⚪'}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {SHIFT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type} {SHIFT_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mission" className="block text-sm font-medium text-gray-700 mb-1">
                Função
              </label>
              <select
                id="mission"
                name="mission"
                value={formData.mission || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Nenhuma função</option>
                {FUNCTIONS.map(func => (
                  <option key={func} value={func}>
                    {func}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 