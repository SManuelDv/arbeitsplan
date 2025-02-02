import { supabase } from '@/config/supabaseClient'
import { z } from 'zod'

export const ShiftSchema = z.object({
  id: z.string().uuid().optional(),
  employee_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  shift_type: z.enum(['🔴', '🟢', '🔵', '⚪']),
  mission: z.enum(['ZK', 'Lab Messung', 'K', 'U', 'Lab Koordinator'], {
    errorMap: () => ({ message: 'Missão deve ser ZK, Lab Messung, K, U ou Lab Koordinator' })
  }).nullable().transform(val => val || 'ZK'),
  created_at: z.string().optional()
})

export type Shift = z.infer<typeof ShiftSchema>

class ShiftService {
  async getShifts(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (error) throw new Error(error.message)
      
      const shifts = data as Shift[]
      return ShiftSchema.array().parse(shifts)
    } catch (error) {
      console.error('Erro ao buscar turnos:', error)
      throw new Error('Não foi possível carregar os turnos')
    }
  }

  async create(shift: Omit<Shift, 'id' | 'created_at'>) {
    try {
      // Validar dados antes de enviar
      ShiftSchema.omit({ id: true, created_at: true }).parse(shift)

      const { data, error } = await supabase
        .from('shifts')
        .insert([shift])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      return ShiftSchema.parse(data)
    } catch (error) {
      console.error('Erro ao criar turno:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.errors.map(e => e.message).join(', '))
      }
      throw new Error('Não foi possível criar o turno')
    }
  }

  async update(id: string, shift: Partial<Shift>) {
    try {
      // Validar dados parciais antes de enviar
      ShiftSchema.partial().parse(shift)

      const { data, error } = await supabase
        .from('shifts')
        .update(shift)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      return ShiftSchema.parse(data)
    } catch (error) {
      console.error('Erro ao atualizar turno:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.errors.map(e => e.message).join(', '))
      }
      throw new Error('Não foi possível atualizar o turno')
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    } catch (error) {
      console.error('Erro ao excluir turno:', error)
      throw new Error('Não foi possível excluir o turno')
    }
  }

  async getByEmployeeId(employeeId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (error) throw new Error(error.message)
      
      const shifts = data as Shift[]
      return ShiftSchema.array().parse(shifts)
    } catch (error) {
      console.error('Erro ao buscar turnos do funcionário:', error)
      throw new Error('Não foi possível carregar os turnos do funcionário')
    }
  }
}

export const shiftService = new ShiftService() 