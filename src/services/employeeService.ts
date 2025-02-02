import { supabase } from '@/config/supabaseClient'

export interface Employee {
  id: string
  full_name: string
  email: string
  department: string
  team: 'A' | 'B' | 'C' | 'D'
  active: boolean
  created_at: string
  created_by: string | null
}

class EmployeeService {
  async list() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name')

      if (error) throw error
      return data as Employee[]
    } catch (error) {
      console.error('Erro ao listar funcionários:', error)
      throw new Error('Não foi possível carregar a lista de funcionários')
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Employee
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error)
      throw new Error('Não foi possível carregar os dados do funcionário')
    }
  }

  async create(employee: Omit<Employee, 'id' | 'created_at'>) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data, error } = await supabase
        .from('employees')
        .insert([{ ...employee, created_by: userData.user.id }])
        .select()
        .single()

      if (error) throw error
      return data as Employee
    } catch (error) {
      console.error('Erro ao criar funcionário:', error)
      throw new Error('Não foi possível criar o funcionário')
    }
  }

  async update(id: string, employee: Partial<Employee>) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Employee
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error)
      throw new Error('Não foi possível atualizar o funcionário')
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error)
      throw new Error('Não foi possível excluir o funcionário')
    }
  }
}

export const employeeService = new EmployeeService() 