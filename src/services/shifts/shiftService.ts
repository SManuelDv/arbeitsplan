import { api } from '@/lib/axios'

export interface Shift {
  id?: string
  employee_id: string
  date: string
  type: string | null
  color: 'blue' | 'green' | 'red' | 'gray'
}

export const shiftService = {
  // Buscar turnos de um período
  getShifts: async (startDate: string, endDate: string) => {
    const { data } = await api.get<Shift[]>('/shifts', {
      params: { startDate, endDate }
    })
    return data
  },

  // Atualizar um turno
  updateShift: async (shift: Shift) => {
    const { data } = await api.put<Shift>(`/shifts/${shift.id}`, shift)
    return data
  },

  // Criar um novo turno
  createShift: async (shift: Omit<Shift, 'id'>) => {
    const { data } = await api.post<Shift>('/shifts', shift)
    return data
  },

  // Salvar turno (cria ou atualiza)
  saveShift: async (shift: Partial<Shift>) => {
    if (shift.id) {
      return shiftService.updateShift(shift as Shift)
    }
    return shiftService.createShift(shift as Omit<Shift, 'id'>)
  }
} 