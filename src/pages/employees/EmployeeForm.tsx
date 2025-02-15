import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeService, type Employee } from '@/services/employeeService'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

type Role = "CP Verpacker" | "fU" | "K" | "Lab Koordinator" | "Lab Messung" | "PC SAP" | "PC Spleisser" | "PC Training" | "SV AGM" | "SV Battery" | "SV CSX" | "U" | "WW Bevorrater" | "WW CaseLoader" | "ZK"
type Team = 'A' | 'B' | 'C' | 'D'

interface FormData {
  full_name: string
  email: string
  phone: string | undefined
  department: string
  team: Team
  role: Role
  contract_start: string
  active: boolean
  created_by: string | null
}

const defaultValues: FormData = {
  full_name: '',
  email: '',
  phone: undefined,
  department: '',
  team: 'A',
  role: 'CP Verpacker',
  contract_start: '',
  active: true,
  created_by: null
}

export function EmployeeForm({ employee }: { employee?: Employee }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(id)
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: employee ? {
      ...employee,
      phone: employee.phone || undefined,
      team: (employee.team || 'A') as Team,
      role: employee.role as Role
    } : defaultValues
  })

  const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? employeeService.getById(id) : null),
    enabled: isEditing
  })

  useEffect(() => {
    if (employeeData) {
      reset({
        full_name: employeeData.full_name,
        email: employeeData.email,
        phone: employeeData.phone || undefined,
        department: employeeData.department,
        team: employeeData.team,
        role: employeeData.role,
        contract_start: employeeData.contract_start,
        active: employeeData.active,
        created_by: employeeData.created_by
      })
    }
  }, [employeeData, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        phone: data.phone || null
      }
      if (employee) {
        return employeeService.update(employee.id, payload)
      }
      return employeeService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const onSubmit = (data: FormData) => {
    setError(null)
    mutation.mutate(data)
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
                {t('employees.fullName')}
              </label>
              <input
                type="text"
                id="full_name"
                {...register('full_name', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.email')}
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email?.type === 'required' && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="mt-1 text-sm text-red-600">{t('validation.invalidEmail')}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.department')}
              </label>
              <select
                id="department"
                {...register('department', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t('employees.selectDepartment')}</option>
                <option value="CasePack">{t('shifts.departments.casepack')}</option>
                <option value="Labor">{t('shifts.departments.labor')}</option>
                <option value="PrepCenter">{t('shifts.departments.prepcenter')}</option>
                <option value="Service">{t('shifts.departments.service')}</option>
                <option value="Wipes">{t('shifts.departments.wipes')}</option>
                <option value="Outro">{t('employees.other')}</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="team" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.team')}
              </label>
              <select
                id="team"
                {...register('team', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t('employees.selectTeam')}</option>
                <option value="A">{t('shifts.teams.timea')}</option>
                <option value="B">{t('shifts.teams.timeb')}</option>
                <option value="C">{t('shifts.teams.timec')}</option>
                <option value="D">{t('shifts.teams.timed')}</option>
              </select>
              {errors.team && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.role')}
              </label>
              <select
                id="role"
                {...register('role', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t('employees.selectRole')}</option>
                <option value="CP Verpacker">{t('employees.cpVerpacker')}</option>
                <option value="fU">{t('employees.fu')}</option>
                <option value="K">{t('employees.k')}</option>
                <option value="Lab Koordinator">{t('employees.labKoordinator')}</option>
                <option value="Lab Messung">{t('employees.labMessung')}</option>
                <option value="PC SAP">{t('employees.pcSap')}</option>
                <option value="PC Spleisser">{t('employees.pcSpleisser')}</option>
                <option value="PC Training">{t('employees.pcTraining')}</option>
                <option value="SV AGM">{t('employees.svAgm')}</option>
                <option value="SV Battery">{t('employees.svBattery')}</option>
                <option value="SV CSX">{t('employees.svCsx')}</option>
                <option value="U">{t('employees.u')}</option>
                <option value="WW Bevorrater">{t('employees.wwBevorrater')}</option>
                <option value="WW CaseLoader">{t('employees.wwCaseLoader')}</option>
                <option value="ZK">{t('employees.zk')}</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="contract_start" className="block text-sm font-medium leading-6 text-gray-900">
                {t('employees.startDate')}
              </label>
              <input
                type="date"
                id="contract_start"
                {...register('contract_start', { required: true })}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.contract_start && (
                <p className="mt-1 text-sm text-red-600">{t('validation.required')}</p>
              )}
            </div>

            <div className="col-span-6">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="active"
                    {...register('active')}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="active" className="font-medium text-gray-900">
                    {t('common.active')}
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
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('common.create')}
          </button>
        </div>
      </form>
    </div>
  )
} 