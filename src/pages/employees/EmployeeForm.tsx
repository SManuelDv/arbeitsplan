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

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? employeeService.getById(id) : null),
    enabled: isEditing
  })

  const mutation = useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'created_at' | 'created_by'>) => {
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
    const formData = new FormData(e.currentTarget)
    
    const data = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string,
      team: formData.get('team') as 'A' | 'B' | 'C' | 'D',
      active: formData.get('active') === 'true'
    }

    mutation.mutate(data)
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
      </h1>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nome Completo
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            required
            defaultValue={employee?.full_name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            defaultValue={employee?.email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Departamento
          </label>
          <input
            type="text"
            name="department"
            id="department"
            required
            defaultValue={employee?.department}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Time
          </label>
          <select
            name="team"
            id="team"
            required
            defaultValue={employee?.team}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="A">Time A</option>
            <option value="B">Time B</option>
            <option value="C">Time C</option>
            <option value="D">Time D</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="active"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <select
            name="active"
            id="active"
            required
            defaultValue={employee?.active?.toString()}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
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
  )
} 