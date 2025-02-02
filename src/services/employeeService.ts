import { supabase } from '@/config/supabaseClient'
import { z } from 'zod'

export const EmployeeSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  department: z.string().min(2, 'Departamento deve ter no mínimo 2 caracteres'),
  team: z.enum(['A', 'B', 'C', 'D'], {
    errorMap: () => ({ message: 'Time deve ser A, B, C ou D' })
  }),
  active: z.boolean().optional().default(true),
  created_at: z.string().optional(),
  created_by: z.string().uuid().nullable()
})

export type Employee = z.infer<typeof EmployeeSchema>

class EmployeeService {
  async list() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name')

      if (error) throw new Error(error.message)
      
      const employees = data as Employee[]
      return EmployeeSchema.array().parse(employees)
    } catch (error: unknown) {
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

      if (error) throw new Error(error.message)
      
      return EmployeeSchema.parse(data)
    } catch (error: unknown) {
      console.error('Erro ao buscar funcionário:', error)
      throw new Error('Não foi possível carregar os dados do funcionário')
    }
  }

  async create(employee: Omit<Employee, 'id' | 'created_at'>) {
    try {
      // Validar dados antes de enviar
      EmployeeSchema.omit({ id: true, created_at: true }).parse(employee)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error(userError.message)

      const { data, error } = await supabase
        .from('employees')
        .insert([{ ...employee, created_by: userData.user.id }])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      return EmployeeSchema.parse(data)
    } catch (error: unknown) {
      console.error('Erro ao criar funcionário:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.errors.map((e: z.ZodError) => e.message).join(', '))
      }
      throw new Error('Não foi possível criar o funcionário')
    }
  }

  async update(id: string, employee: Partial<Employee>) {
    try {
      // Validar dados parciais antes de enviar
      EmployeeSchema.partial().parse(employee)

      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      return EmployeeSchema.parse(data)
    } catch (error: unknown) {
      console.error('Erro ao atualizar funcionário:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.errors.map((e: z.ZodError) => e.message).join(', '))
      }
      throw new Error('Não foi possível atualizar o funcionário')
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    } catch (error: unknown) {
      console.error('Erro ao excluir funcionário:', error)
      throw new Error('Não foi possível excluir o funcionário')
    }
  }
}

export const employeeService = new EmployeeService() 