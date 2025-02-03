import { supabase } from '@/config/supabaseClient'
import { z } from 'zod'

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().nullable(),
  department: z.string().min(1, 'Departamento é obrigatório'),
  team: z.enum(['A', 'B', 'C', 'D'], {
    errorMap: () => ({ message: 'Time deve ser A, B, C ou D' })
  }),
  role: z.enum([
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
  ], {
    errorMap: () => ({ message: 'Função inválida' })
  }),
  contract_start: z.string().min(1, 'Data de início é obrigatória'),
  active: z.boolean(),
  created_at: z.string().nullable(),
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
      
      return EmployeeSchema.array().parse(data)
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

      if (error) {
        if (error.code === '23505' && error.message.includes('employees_email_key')) {
          throw new Error('Já existe um funcionário cadastrado com este email')
        }
        throw new Error(error.message)
      }
      
      return EmployeeSchema.parse(data)
    } catch (error: unknown) {
      console.error('Erro ao criar funcionário:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.issues.map(e => e.message).join(', '))
      }
      throw error // Repassar o erro original para manter a mensagem personalizada
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

      if (error) {
        if (error.code === '23505' && error.message.includes('employees_email_key')) {
          throw new Error('Já existe um funcionário cadastrado com este email')
        }
        throw new Error(error.message)
      }
      
      return EmployeeSchema.parse(data)
    } catch (error: unknown) {
      console.error('Erro ao atualizar funcionário:', error)
      if (error instanceof z.ZodError) {
        throw new Error('Dados inválidos: ' + error.issues.map(e => e.message).join(', '))
      }
      throw error // Repassar o erro original para manter a mensagem personalizada
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