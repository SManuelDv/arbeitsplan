import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { format, addMonths, startOfYear, getDaysInMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yearlyShiftService } from '@/services/yearlyShiftService';
import { useAuthContext } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';
const SHIFT_COLORS = {
    '🔴': 'bg-red-500',
    '🟢': 'bg-green-500',
    '🔵': 'bg-blue-500',
    '⚪': 'bg-gray-200'
};
const SHIFT_LABELS = {
    '🔴': 'Manhã',
    '🟢': 'Tarde',
    '🔵': 'Noite',
    '⚪': 'Livre'
};
const SHIFT_SEQUENCE = ['🔴', '🟢', '🔵', '⚪'];
const TEAMS = ['A', 'B', 'C', 'D'];
const WEEKDAYS = {
    0: 'dom',
    1: 'seg',
    2: 'ter',
    3: 'qua',
    4: 'qui',
    5: 'sex',
    6: 'sab'
};
const YEAR = 2025;
export function YearlyCalendar() {
    const { isAdmin } = useAuthContext();
    const queryClient = useQueryClient();
    const [yearShifts, setYearShifts] = useState(() => {
        const shifts = [];
        const startDate = startOfYear(new Date(YEAR, 0, 1));
        for (let month = 0; month < 12; month++) {
            const currentMonth = addMonths(startDate, month);
            const daysInMonth = getDaysInMonth(currentMonth);
            for (let day = 1; day <= daysInMonth; day++) {
                const date = format(new Date(YEAR, month, day), 'yyyy-MM-dd');
                shifts.push({
                    date,
                    shifts: {
                        A: '⚪',
                        B: '⚪',
                        C: '⚪',
                        D: '⚪'
                    }
                });
            }
        }
        return shifts;
    });
    // Buscar turnos salvos
    const { data: savedShifts, isLoading } = useQuery({
        queryKey: ['yearlyShifts', YEAR],
        queryFn: () => yearlyShiftService.getYearShifts(YEAR)
    });
    // Mutation para atualizar turnos
    const updateShiftMutation = useMutation({
        mutationFn: yearlyShiftService.updateShift,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yearlyShifts', YEAR] });
        },
        onError: (error) => {
            toast.error('Erro ao salvar turno: ' + error.message);
        }
    });
    // Atualizar estado local com dados do banco
    useEffect(() => {
        if (savedShifts) {
            const newShifts = [...yearShifts];
            savedShifts.forEach(savedShift => {
                const dayIndex = newShifts.findIndex(d => d.date === savedShift.date);
                if (dayIndex !== -1) {
                    newShifts[dayIndex].shifts[savedShift.team] = savedShift.shift_type;
                }
            });
            setYearShifts(newShifts);
        }
    }, [savedShifts]);
    const handleShiftClick = async (date, team) => {
        const dayIndex = yearShifts.findIndex(d => d.date === date);
        if (dayIndex === -1)
            return;
        const currentShift = yearShifts[dayIndex].shifts[team];
        const currentIndex = SHIFT_SEQUENCE.indexOf(currentShift);
        const nextShift = SHIFT_SEQUENCE[(currentIndex + 1) % SHIFT_SEQUENCE.length];
        // Atualizar estado local
        setYearShifts(prev => {
            const newShifts = [...prev];
            newShifts[dayIndex] = {
                ...newShifts[dayIndex],
                shifts: {
                    ...newShifts[dayIndex].shifts,
                    [team]: nextShift
                }
            };
            return newShifts;
        });
        // Salvar no banco
        try {
            await updateShiftMutation.mutateAsync({
                date,
                team,
                shift_type: nextShift,
                year: YEAR
            });
        }
        catch (error) {
            // Em caso de erro, reverter estado local
            setYearShifts(prev => {
                const newShifts = [...prev];
                newShifts[dayIndex] = {
                    ...newShifts[dayIndex],
                    shifts: {
                        ...newShifts[dayIndex].shifts,
                        [team]: currentShift
                    }
                };
                return newShifts;
            });
        }
    };
    const renderMonth = (monthIndex) => {
        const year = 2025;
        const firstDay = startOfMonth(new Date(year, monthIndex));
        const daysInMonth = getDaysInMonth(firstDay);
        const monthShifts = yearShifts.filter(shift => new Date(shift.date).getMonth() === monthIndex);
        return (_jsx("div", { className: "min-w-[220px] transform transition-all duration-300 hover:scale-[1.02]", children: _jsxs("table", { className: "w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden", children: [_jsxs("thead", { children: [_jsx("tr", { children: _jsx("th", { colSpan: 6, className: "text-sm font-medium text-gray-900 text-center py-2 border-b bg-gray-50", children: format(firstDay, 'MMMM', { locale: ptBR }) }) }), _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "px-1 py-1 text-xs font-medium text-gray-500 border-b border-r w-12", children: "Dia" }), _jsx("th", { colSpan: 4, className: "px-1 py-1 text-xs font-medium text-gray-500 border-b", children: "Grupo" })] }), _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "px-1 py-1 text-xs font-medium text-gray-500 border-b border-r" }), TEAMS.map(team => (_jsx("th", { className: "px-1 py-1 text-xs font-medium text-gray-500 border-b w-8", children: team }, team)))] })] }), _jsx("tbody", { children: Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(year, monthIndex, day);
                            const currentDate = format(date, 'yyyy-MM-dd');
                            const dayShifts = monthShifts.find(shift => shift.date === currentDate)?.shifts;
                            const weekDay = WEEKDAYS[date.getDay()];
                            return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "border-r px-1 py-0.5 text-xs", children: _jsxs("div", { className: "flex items-center gap-0.5", children: [_jsx("span", { className: "w-3 text-right", children: day }), _jsx("span", { className: "text-gray-500 text-[10px]", children: weekDay })] }) }), TEAMS.map(team => (_jsx("td", { className: "p-0 border-r last:border-r-0", children: _jsx("button", { onClick: () => handleShiftClick(currentDate, team), disabled: !isAdmin, className: `w-full h-5 ${SHIFT_COLORS[dayShifts?.[team] || '⚪']} transition-colors ${isAdmin ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed'}`, children: _jsx("span", { className: "sr-only", children: "Alterar turno" }) }) }, team)))] }, day));
                        }) })] }) }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "sticky top-0 z-10 bg-white p-4 shadow-sm rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-medium text-gray-900", children: ["Plano ", YEAR] }), _jsx("div", { className: "flex items-center gap-4", children: SHIFT_SEQUENCE.map(shift => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded ${SHIFT_COLORS[shift]}` }), _jsx("span", { className: "text-xs text-gray-600", children: SHIFT_LABELS[shift] })] }, shift))) })] }) }), isLoading ? (_jsx("div", { className: "flex justify-center p-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }) })) : (_jsx("div", { className: "overflow-x-auto pb-6", children: _jsx("div", { className: "flex gap-4 min-w-max animate-slide-left", children: Array.from({ length: 12 }).map((_, i) => (_jsx("div", { children: renderMonth(i) }, `month-${i}`))) }) }))] }));
}
