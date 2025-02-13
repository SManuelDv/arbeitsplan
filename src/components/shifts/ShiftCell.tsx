import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shiftService, type Shift, type ShiftType, type MissionType } from '@/services/shiftService'
import { toast } from 'react-hot-toast'
import { Popover } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

const SHIFT_TYPES: ShiftType[] = ['morning', 'afternoon', 'night', 'off']

const FUNCTIONS: MissionType[] = [
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
]

interface ShiftCellProps {
  employeeId: string
  date: string
  shift?: Shift
  showFunction?: boolean
}

export function ShiftCell({ employeeId, date, shift, showFunction = false }: ShiftCellProps) {
  const queryClient = useQueryClient()
  const [isUpdating, setIsUpdating] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const handleLanguageChange = () => {
      setIsUpdating(prev => !prev)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const updateShiftMutation = useMutation({
    mutationFn: async (data: { shift_type: ShiftType; mission: MissionType | null }) => {
      setIsUpdating(true)
      try {
        const result = await shiftService.updateShift(employeeId, date, data)
        return result
      } catch (error) {
        console.error('[ShiftCell] Mutation error:', error)
        throw error
      }
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['shifts'] })
      
      const previousShifts = queryClient.getQueryData(['shifts'])
      
      queryClient.setQueryData(['shifts'], (old: Shift[] | undefined) => {
        if (!old) return []
        
        const newShift = {
          id: shift?.id || 'temp-' + Date.now(),
          employee_id: employeeId,
          date: date,
          shift_type: data.shift_type,
          mission: data.mission,
          created_at: shift?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        if (shift) {
          return old.map(s => 
            s.employee_id === employeeId && s.date === date ? newShift : s
          )
        } else {
          return [...old, newShift]
        }
      })
      
      return { previousShifts }
    },
    onError: (error: any, variables, context) => {
      console.error('[ShiftCell] Update error:', error)
      toast.error(t('common.error.updateFailed'))
      if (context?.previousShifts) {
        queryClient.setQueryData(['shifts'], context.previousShifts)
      }
    },
    onSuccess: (data) => {
      toast.success(t('common.success.updated'))
      
      queryClient.setQueryData(['shifts'], (old: Shift[] | undefined) => {
        if (!old) return [data]
        
        const exists = old.some(s => 
          s.employee_id === data.employee_id && s.date === data.date
        )
        
        if (exists) {
          return old.map(s => 
            s.employee_id === data.employee_id && s.date === data.date ? data : s
          )
        } else {
          return [...old, data]
        }
      })
    },
    onSettled: () => {
      setIsUpdating(false)
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    }
  })

  const handleShiftTypeSelect = async (type: ShiftType) => {
    if (isUpdating) return
    
    try {
      await updateShiftMutation.mutateAsync({
        shift_type: type,
        mission: shift?.mission || null
      })
      const button = document.activeElement as HTMLElement
      button?.blur()
    } catch (error) {
      console.error('[ShiftCell] Error selecting shift type:', error)
    }
  }

  const handleMissionSelect = async (mission: MissionType | null) => {
    if (isUpdating) return
    
    try {
      await updateShiftMutation.mutateAsync({
        shift_type: shift?.shift_type || 'off',
        mission
      })
      const button = document.activeElement as HTMLElement
      button?.blur()
    } catch (error) {
      console.error('[ShiftCell] Error selecting mission:', error)
    }
  }

  const shiftType = shift?.shift_type || 'off'

  const getShiftColor = (type: ShiftType) => {
    switch (type) {
      case 'morning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'afternoon':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'night':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'off':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="relative p-0 text-center min-w-[3rem] h-full bg-white">
      <Popover className="relative h-full">
        <Popover.Button
          disabled={isUpdating}
          className={`
            w-full h-full min-h-[2rem] p-1
            flex flex-col items-center justify-center gap-0.5
            bg-white hover:bg-gray-50
            transition-colors duration-200
            ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className={`text-lg sm:text-xl font-bold leading-none ${getShiftColor(shiftType)}`}>
            {t(`shifts.types.${shiftType}`, { defaultValue: shiftType })}
          </div>
          {shift?.mission && (
            <div className="text-[9px] sm:text-[10px] text-gray-700 font-medium whitespace-nowrap overflow-visible px-0.5">
              {t(`employees.${shift.mission.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: shift.mission })}
            </div>
          )}
        </Popover.Button>

        <Popover.Panel className="absolute z-10 w-[500px] p-2 mt-0.5 bg-white rounded-lg shadow-lg">
          <div className="flex gap-4">
            <div>
              <h3 className="text-[10px] font-medium text-gray-700 mb-1">{t('shifts.title')}</h3>
              <div className="grid grid-cols-1 gap-1">
                {SHIFT_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => handleShiftTypeSelect(type)}
                    disabled={isUpdating}
                    className={`
                      p-1 rounded-lg text-base bg-white w-full
                      ${shiftType === type ? 'ring-1 ring-primary-500' : ''}
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                      ${getShiftColor(type)}
                    `}
                  >
                    {t(`shifts.types.${type}`, { defaultValue: type })}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-[10px] font-medium text-gray-700 mb-1">{t('employees.role')}</h3>
              <div className="grid grid-cols-2 gap-1">
                {FUNCTIONS.map(func => (
                  <button
                    key={func}
                    onClick={() => handleMissionSelect(func)}
                    disabled={isUpdating}
                    className={`
                      px-2 py-1 text-[10px] rounded-lg text-left whitespace-normal
                      ${shift?.mission === func ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'}
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    `}
                  >
                    {t(`employees.${func.toLowerCase().replace(/\s+/g, '')}`, { defaultValue: func })}
                  </button>
                ))}
                <button
                  onClick={() => handleMissionSelect(null)}
                  disabled={isUpdating}
                  className={`
                    px-2 py-1 text-[10px] rounded-lg text-left whitespace-normal
                    ${shift?.mission === null ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500'}
                    ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  `}
                >
                  {t('shifts.types.unassigned')}
                </button>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  )
}