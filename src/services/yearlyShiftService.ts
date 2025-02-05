import { supabase } from '@/config/supabaseClient'

export type ShiftType = '🔴' | '🟢' | '🔵' | '⚪'
export type TeamType = 'A' | 'B' | 'C' | 'D'

export interface YearlyShift {
  id?: string
  date: string
  team: TeamType
  shift_type: ShiftType
  year: number
  created_at?: string
  updated_at?: string
}

class YearlyShiftService {
  private checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      throw new Error('Usuário não autenticado')
    }
    return session
  }

  getYearShifts = async (year: number): Promise<YearlyShift[]> => {
    try {
      await this.checkAuth()

      const { data, error } = await supabase
        .from('yearly_shifts')
        .select('*')
        .eq('year', year)
        .order('date')

      if (error) throw error

      return data as YearlyShift[]
    } catch (error) {
      console.error('[YearlyShiftService] Erro ao buscar turnos:', error)
      throw new Error('Não foi possível carregar os turnos anuais')
    }
  }

  updateShift = async (shift: Omit<YearlyShift, 'id' | 'created_at' | 'updated_at'>): Promise<YearlyShift> => {
    try {
      const session = await this.checkAuth()

      // Verificar se já existe um turno para esta data e equipe
      const { data: existingShift, error: findError } = await supabase
        .from('yearly_shifts')
        .select('*')
        .eq('date', shift.date)
        .eq('team', shift.team)
        .eq('year', shift.year)
        .single()

      if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw findError
      }

      if (existingShift) {
        // Se existe, atualizar
        const { data: updatedShift, error: updateError } = await supabase
          .from('yearly_shifts')
          .update({ shift_type: shift.shift_type })
          .eq('id', existingShift.id)
          .select()
          .single()

        if (updateError) throw updateError
        return updatedShift as YearlyShift
      } else {
        // Se não existe, criar
        const { data: newShift, error: createError } = await supabase
          .from('yearly_shifts')
          .insert([{
            ...shift,
            created_by: session.user.id
          }])
          .select()
          .single()

        if (createError) throw createError
        return newShift as YearlyShift
      }
    } catch (error) {
      console.error('[YearlyShiftService] Erro ao atualizar turno:', error)
      throw new Error('Não foi possível atualizar o turno')
    }
  }
}

export const yearlyShiftService = new YearlyShiftService() 