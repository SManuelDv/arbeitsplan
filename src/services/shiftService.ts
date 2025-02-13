import { supabase } from '@/config/supabaseClient'

export type ShiftType = 'morning' | 'afternoon' | 'night' | 'off'
export type MissionType = 
  | 'CP Verpacker'
  | 'fU'
  | 'K'
  | 'Lab Koordinator'
  | 'Lab Messung'
  | 'PC SAP'
  | 'PC Spleisser'
  | 'PC Training'
  | 'SV AGM'
  | 'SV Battery'
  | 'SV CSX'
  | 'U'
  | 'WW Bevorrater'
  | 'WW CaseLoader'
  | 'ZK'

export interface Shift {
  id: string
  employee_id: string
  date: string
  shift_type: ShiftType
  mission: MissionType | null
  created_at: string
  updated_at: string
}

class ShiftService {
  private async checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[ShiftService] Auth error:', error.message)
      throw new Error('Authentication failed')
    }
    
    if (!session) {
      console.error('[ShiftService] No active session')
      throw new Error('No active session')
    }
    
    return session
  }

  async getShifts(startDate: string, endDate: string): Promise<Shift[]> {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Fetching shifts:', { startDate, endDate })

      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })

      if (error) {
        console.error('[ShiftService] Database error:', error.message)
        throw new Error('Failed to fetch shifts')
      }

      console.log('[ShiftService] Fetched shifts:', data?.length)
      return data as Shift[]
    } catch (error) {
      console.error('[ShiftService] Error in getShifts:', error)
      throw error
    }
  }

  async create(shift: Omit<Shift, 'id' | 'created_at'>) {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Criando turno:', shift)

      const { data, error } = await supabase
        .from('shifts')
        .insert([shift])
        .select()
        .single()

      if (error) throw error
      
      return data as Shift
    } catch (error) {
      console.error('[ShiftService] Erro ao criar turno:', error)
      throw new Error('Não foi possível criar o turno')
    }
  }

  async update(id: string, shift: Partial<Shift>) {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Atualizando turno:', id, shift)

      const { data, error } = await supabase
        .from('shifts')
        .update(shift)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      return data as Shift
    } catch (error) {
      console.error('[ShiftService] Erro ao atualizar turno:', error)
      throw new Error('Não foi possível atualizar o turno')
    }
  }

  async delete(id: string) {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Excluindo turno:', id)

      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('[ShiftService] Erro ao excluir turno:', error)
      throw new Error('Não foi possível excluir o turno')
    }
  }

  async getByEmployeeId(employeeId: string, startDate: string, endDate: string): Promise<Shift[]> {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Buscando turnos do funcionário:', employeeId)

      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (error) throw error
      
      return data as Shift[]
    } catch (error) {
      console.error('[ShiftService] Erro ao buscar turnos do funcionário:', error)
      throw new Error('Não foi possível carregar os turnos do funcionário')
    }
  }

  async updateShift(
    employeeId: string,
    date: string,
    data: { shift_type: ShiftType; mission: MissionType | null }
  ): Promise<Shift> {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Updating shift:', { employeeId, date, data })

      // First, try to find an existing shift
      const { data: existingShift, error: findError } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', date)
        .maybeSingle()

      if (findError) {
        console.error('[ShiftService] Error finding shift:', findError.message)
        throw new Error('Failed to check existing shift')
      }

      let result
      if (existingShift) {
        // Update existing shift
        const { data: updated, error: updateError } = await supabase
          .from('shifts')
          .update({
            shift_type: data.shift_type,
            mission: data.mission,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingShift.id)
          .select()
          .single()

        if (updateError) {
          console.error('[ShiftService] Error updating shift:', updateError.message)
          throw new Error('Failed to update shift')
        }
        result = updated
      } else {
        // Create new shift
        const { data: created, error: insertError } = await supabase
          .from('shifts')
          .insert([{
            employee_id: employeeId,
            date,
            shift_type: data.shift_type,
            mission: data.mission,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (insertError) {
          console.error('[ShiftService] Error creating shift:', insertError.message)
          throw new Error('Failed to create shift')
        }
        result = created
      }

      console.log('[ShiftService] Shift updated successfully:', result)
      return result as Shift
    } catch (error) {
      console.error('[ShiftService] Error in updateShift:', error)
      throw error
    }
  }

  async deleteShift(id: string): Promise<void> {
    try {
      await this.checkAuth()
      console.log('[ShiftService] Deleting shift:', id)

      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[ShiftService] Error deleting shift:', error.message)
        throw new Error('Failed to delete shift')
      }

      console.log('[ShiftService] Shift deleted successfully')
    } catch (error) {
      console.error('[ShiftService] Error in deleteShift:', error)
      throw error
    }
  }
}

export const shiftService = new ShiftService() 