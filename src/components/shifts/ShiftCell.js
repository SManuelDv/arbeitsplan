import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftService } from '@/services/shiftService';
import { toast } from 'react-hot-toast';
import { Popover } from '@headlessui/react';
const SHIFT_COLORS = {
    '🔴': 'text-red-500',
    '🟢': 'text-green-500',
    '🔵': 'text-blue-500',
    '⚪': 'text-gray-400'
};
const SHIFT_TYPES = ['🔴', '🟢', '🔵', '⚪'];
const SHIFT_LABELS = {
    '🔴': 'Manhã',
    '🟢': 'Tarde',
    '🔵': 'Noite',
    '⚪': 'Folga'
};
const FUNCTIONS = [
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
];
export function ShiftCell({ employeeId, date, shift, showFunction = false }) {
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const updateShiftMutation = useMutation({
        mutationFn: async (data) => {
            console.log('[ShiftCell] Iniciando atualização:', {
                employeeId,
                date,
                data,
                currentShift: shift
            });
            try {
                const result = await shiftService.updateShift(employeeId, date, data);
                console.log('[ShiftCell] Resultado da atualização:', result);
                return result;
            }
            catch (error) {
                console.error('[ShiftCell] Erro na mutação:', error);
                throw error;
            }
        },
        onMutate: async (data) => {
            console.log('[ShiftCell] Preparando atualização otimista:', data);
            // Cancelar queries em andamento
            await queryClient.cancelQueries({ queryKey: ['shifts'] });
            // Snapshot do valor anterior
            const previousShifts = queryClient.getQueryData(['shifts']);
            console.log('[ShiftCell] Estado anterior:', previousShifts);
            // Atualizar cache otimisticamente
            queryClient.setQueryData(['shifts'], (old) => {
                if (!old)
                    return [];
                const newShift = {
                    id: shift?.id || 'temp-' + Date.now(),
                    employee_id: employeeId,
                    date: date,
                    shift_type: data.shift_type,
                    mission: data.mission,
                    created_at: shift?.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                if (shift) {
                    // Atualizar turno existente
                    return old.map(s => s.employee_id === employeeId && s.date === date ? newShift : s);
                }
                else {
                    // Criar novo turno
                    return [...old, newShift];
                }
            });
            return { previousShifts };
        },
        onError: (error, variables, context) => {
            console.error('[ShiftCell] Erro na atualização:', error);
            toast.error('Erro ao atualizar turno');
            // Reverter para o estado anterior em caso de erro
            if (context?.previousShifts) {
                queryClient.setQueryData(['shifts'], context.previousShifts);
            }
        },
        onSuccess: (data) => {
            console.log('[ShiftCell] Atualização bem sucedida:', data);
            toast.success('Turno atualizado com sucesso');
            // Atualizar cache com os dados do servidor
            queryClient.setQueryData(['shifts'], (old) => {
                if (!old)
                    return [data];
                const exists = old.some(s => s.employee_id === data.employee_id && s.date === data.date);
                if (exists) {
                    return old.map(s => s.employee_id === data.employee_id && s.date === data.date ? data : s);
                }
                else {
                    return [...old, data];
                }
            });
            // Forçar refetch para garantir dados atualizados
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
        },
        onSettled: () => {
            console.log('[ShiftCell] Finalizando atualização');
            setIsUpdating(false);
        }
    });
    const handleShiftTypeSelect = async (type) => {
        if (isUpdating)
            return;
        console.log('[ShiftCell] Selecionando turno:', {
            type,
            currentShift: shift,
            employeeId,
            date
        });
        setIsUpdating(true);
        try {
            const newData = {
                shift_type: type,
                mission: shift?.mission || null
            };
            await updateShiftMutation.mutateAsync(newData);
            // Fechar o popover após a atualização
            const button = document.activeElement;
            button?.blur();
        }
        catch (error) {
            console.error('[ShiftCell] Erro ao selecionar turno:', error);
        }
        finally {
            setIsUpdating(false);
        }
    };
    const handleMissionSelect = async (mission) => {
        if (isUpdating)
            return;
        console.log('[ShiftCell] Selecionando função:', {
            mission,
            currentShift: shift,
            employeeId,
            date
        });
        setIsUpdating(true);
        try {
            const newData = {
                shift_type: shift?.shift_type || '⚪',
                mission
            };
            await updateShiftMutation.mutateAsync(newData);
            // Fechar o popover após a atualização
            const button = document.activeElement;
            button?.blur();
        }
        catch (error) {
            console.error('[ShiftCell] Erro ao selecionar função:', error);
        }
        finally {
            setIsUpdating(false);
        }
    };
    const shiftType = shift?.shift_type || '⚪';
    return (_jsx("div", { className: "relative p-0 text-center min-w-[3rem] h-full bg-white", children: _jsxs(Popover, { className: "relative h-full", children: [_jsxs(Popover.Button, { disabled: isUpdating, className: `
            w-full h-full min-h-[2rem] p-1
            flex flex-col items-center justify-center gap-0.5
            bg-white hover:bg-gray-50
            transition-colors duration-200
            ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
          `, children: [_jsx("div", { className: `text-lg sm:text-xl font-bold leading-none ${SHIFT_COLORS[shiftType]}`, children: shiftType }), shift?.mission && (_jsx("div", { className: "text-[9px] sm:text-[10px] text-gray-700 font-medium whitespace-nowrap overflow-visible px-0.5", children: shift.mission }))] }), _jsx(Popover.Panel, { className: "absolute z-10 w-[500px] p-2 mt-0.5 bg-white rounded-lg shadow-lg", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-[10px] font-medium text-gray-700 mb-1", children: "Turno" }), _jsx("div", { className: "grid grid-cols-1 gap-1", children: SHIFT_TYPES.map(type => (_jsxs("button", { onClick: () => handleShiftTypeSelect(type), disabled: isUpdating, className: `
                      p-1 rounded-lg text-base bg-white w-10
                      ${shiftType === type ? 'ring-1 ring-primary-500' : ''}
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                      ${SHIFT_COLORS[type]}
                    `, children: [_jsx("span", { className: "sr-only", children: SHIFT_LABELS[type] }), type] }, type))) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-[10px] font-medium text-gray-700 mb-1", children: "Fun\u00E7\u00E3o" }), _jsxs("div", { className: "grid grid-cols-2 gap-1", children: [FUNCTIONS.map(func => (_jsx("button", { onClick: () => handleMissionSelect(func), disabled: isUpdating, className: `
                      px-2 py-1 text-[10px] rounded-lg text-left whitespace-normal
                      ${shift?.mission === func ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'}
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    `, children: func }, func))), _jsx("button", { onClick: () => handleMissionSelect(null), disabled: isUpdating, className: `
                    px-2 py-1 text-[10px] rounded-lg text-left whitespace-normal
                    ${shift?.mission === null ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500'}
                    ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  `, children: "Sem fun\u00E7\u00E3o" })] })] })] }) })] }) }));
}
