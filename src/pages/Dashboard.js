import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { shiftService } from '@/services/shiftService';
import { FiUsers, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { ReadOnlyShiftTable } from '@/components/shifts/ReadOnlyShiftTable';
import { YearlyCalendar } from '@/components/shifts/YearlyCalendar';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthContext } from '@/providers/AuthProvider';
export function Dashboard() {
    const { isAdmin } = useAuthContext();
    const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
        queryKey: ['employees'],
        queryFn: employeeService.list
    });
    const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => shiftService.getShifts(new Date().toISOString().split('T')[0], new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    });
    if (isLoadingEmployees || isLoadingShifts) {
        return (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/4 mb-4" }), _jsx("div", { className: "space-y-3", children: [...Array(3)].map((_, i) => (_jsx("div", { className: "h-12 bg-gray-200 rounded" }, i))) })] }));
    }
    return (_jsxs("div", { className: "space-y-6 px-4", children: [isAdmin && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4", children: [_jsx("div", { className: "bg-gradient-to-br from-blue-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors", children: _jsx(FiUsers, { className: "w-4 h-4 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-medium text-gray-500", children: "ArbeitsPlan" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("p", { className: "text-xl font-bold text-blue-600", children: employees.length }), _jsx("p", { className: "text-[10px] text-gray-400", children: "funcion\u00E1rios" })] })] })] }) }), _jsx("div", { className: "bg-gradient-to-br from-green-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-green-100 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors", children: _jsx(FiCalendar, { className: "w-4 h-4 text-green-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-medium text-gray-500", children: "Turnos" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("p", { className: "text-xl font-bold text-green-600", children: shifts.length }), _jsx("p", { className: "text-[10px] text-gray-400", children: "pr\u00F3x. 7 dias" })] })] })] }) }), _jsx("div", { className: "bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors", children: _jsx(FiTrendingUp, { className: "w-4 h-4 text-purple-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-medium text-gray-500", children: "M\u00E9dia" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("p", { className: "text-xl font-bold text-purple-600", children: employees.length > 0
                                                        ? (shifts.length / employees.length).toFixed(1)
                                                        : '0' }), _jsx("p", { className: "text-[10px] text-gray-400", children: "por funcion\u00E1rio" })] })] })] }) })] })), _jsxs("div", { className: "bg-white shadow-sm rounded-lg p-4", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("h2", { className: "text-lg font-medium text-gray-900", children: ["Plano de Trabalho de ", format(new Date(), "dd 'de' MMMM", { locale: ptBR }), " a ", format(addDays(new Date(), 6), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })] }) }), _jsx(ReadOnlyShiftTable, {})] }), _jsx("div", { className: "bg-white shadow-sm rounded-lg p-4", children: _jsx(YearlyCalendar, {}) })] }));
}
