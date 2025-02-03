import React, { useState, useEffect } from 'react'
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
    department: undefined,
    role: undefined,
    team: 'A',
    active: true
  })

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? employeeService.getById(id) : null),
    enabled: isEditing
  })

  useEffect(() => {
    if (employee) {
      setFormData(employee)
    }
  }, [employee])

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
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const data = {
      full_name: formData.get('full_name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || null,
      department: formData.get('department')?.toString() as Employee['department'],
      team: formData.get('team')?.toString() as Employee['team'] || 'A',
      role: formData.get('role')?.toString() as Employee['role'],
      contract_start: formData.get('contract_start')?.toString() || '',
      active: Boolean(formData.get('active')),
      created_by: null
    }

    mutation.mutate(data)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (isLoadingEmployee) {
    return <div>Carregando...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-gray-900">
                Nome completo
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.full_name || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                Departamento
              </label>
              <select
                id="department"
                name="department"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.department || ''}
                onChange={handleInputChange}
              >
                <option value="">Selecione um departamento</option>
                <option value="CasePack">CasePack</option>
                <option value="Labor">Labor</option>
                <option value="PrepCenter">PrepCenter</option>
                <option value="Service">Service</option>
                <option value="Wipes">Wipes</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="team" className="block text-sm font-medium leading-6 text-gray-900">
                Time
              </label>
              <select
                id="team"
                name="team"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.team || 'A'}
                onChange={handleInputChange}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                Função
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.role || ''}
                onChange={handleInputChange}
              >
                <option value="">Selecione uma função</option>
                <option value="CP Verpacker">CP Verpacker</option>
                <option value="fU">fU</option>
                <option value="K">K</option>
                <option value="Lab Koordinator">Lab Koordinator</option>
                <option value="Lab Messung">Lab Messung</option>
                <option value="PC SAP">PC SAP</option>
                <option value="PC Spleisser">PC Spleisser</option>
                <option value="PC Training">PC Training</option>
                <option value="SV AGM">SV AGM</option>
                <option value="SV Battery">SV Battery</option>
                <option value="SV CSX">SV CSX</option>
                <option value="U">U</option>
                <option value="WW Bevorrater">WW Bevorrater</option>
                <option value="WW CaseLoader">WW CaseLoader</option>
                <option value="ZK">ZK</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="contract_start" className="block text-sm font-medium leading-6 text-gray-900">
                Data de início
              </label>
              <input
                type="date"
                name="contract_start"
                id="contract_start"
                required
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.contract_start || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-6">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="active" className="font-medium text-gray-900">
                    Ativo
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            className="mr-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => navigate('/employees')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  )
} 