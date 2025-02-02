import { supabase } from '@/config/supabaseClient'

export interface Shift {
  id: string
  employee_id: string
  date: string
  shift_type: '🔴' | '🟢' | '🔵' | '⚪'
  mission: 'ZK' | 'Lab Messung' | 'K' | 'U' | 'Lab Koordinator' | string
  created_at: string
}

class ShiftService {
  async getShifts(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')

    if (error) throw error
    return data as Shift[]
  }

  async create(shift: Omit<Shift, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('shifts')
      .insert([shift])
      .select()
      .single()

    if (error) throw error
    return data as Shift
  }

  async update(id: string, shift: Partial<Shift>) {
    const { data, error } = await supabase
      .from('shifts')
      .update(shift)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Shift
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getByEmployeeId(employeeId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')

    if (error) throw error
    return data as Shift[]
  }
}

export const shiftService = new ShiftService() 