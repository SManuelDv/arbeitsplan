import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeService, type Employee } from '@/services/employeeService'

export function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Employee>>({
    department: '',
  })

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? employeeService.getById(id) : null),
    enabled: isEditing
  })

  const mutation = useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'created_at'>) => {
      if (isEditing && id) {
        return employeeService.update(id, data)
      }
      return employeeService.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formElement = e.currentTarget
    const formData = new FormData(formElement)
    
    const departmentValue = formData.get('department_other')?.toString() || formData.get('department')?.toString() || ''
    
    const data = {
      full_name: formData.get('full_name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || undefined,
      department: departmentValue,
      team: formData.get('team')?.toString() as 'A' | 'B' | 'C' | 'D',
      role: formData.get('role')?.toString() as 'admin' | 'manager' | 'employee',
      contract_start: formData.get('contract_start')?.toString() || '',
      active: formData.get('active') === 'true',
      created_by: null
    }

    mutation.mutate(data)
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, department: e.target.value }))
  }

  if (isEditing && isLoadingEmployee) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h1>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 text-xs text-red-700 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome Completo
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                required
                defaultValue={employee?.full_name}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                defaultValue={employee?.email}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="(00) 00000-0000"
                defaultValue={employee?.phone}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="contract_start"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Data de Início
              </label>
              <input
                type="date"
                name="contract_start"
                id="contract_start"
                required
                defaultValue={employee?.contract_start}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Departamento
              </label>
              {formData.department === 'Outros' ? (
                <input
                  type="text"
                  name="department_other"
                  id="department_other"
                  required
                  placeholder="Especifique o departamento"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <select
                  name="department"
                  id="department"
                  required
                  value={formData.department || employee?.department || ''}
                  onChange={handleDepartmentChange}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecione um departamento</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Empacotamento">Empacotamento</option>
                  <option value="Outros">Outros</option>
                </select>
              )}
            </div>

            <div>
              <label
                htmlFor="team"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Time
              </label>
              <select
                name="team"
                id="team"
                required
                defaultValue={employee?.team}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="A">Time A</option>
                <option value="B">Time B</option>
                <option value="C">Time C</option>
                <option value="D">Time D</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Função
              </label>
              <select
                name="role"
                id="role"
                required
                defaultValue={employee?.role}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="employee">Funcionário</option>
                <option value="manager">Gestor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="active"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                name="active"
                id="active"
                required
                defaultValue={employee?.active?.toString()}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {mutation.isPending
                ? 'Salvando...'
                : isEditing
                ? 'Atualizar'
                : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 