import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { shiftService } from '@/services/shiftService';
import { FiFilter, FiX } from 'react-icons/fi';
import styles from './ReadOnlyShiftTable.module.css';
import { useAuthContext } from '@/providers/AuthProvider';
const SHIFT_COLORS = {
    '🔴': 'text-red-500',
    '🟢': 'text-green-500',
    '🔵': 'text-blue-500',
    '⚪': 'text-gray-500'
};
export function ReadOnlyShiftTable() {
    const { profile, isAdmin } = useAuthContext();
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        team: ''
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // Gerar datas dos próximos 7 dias
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfToday(), i);
        return {
            full: date,
            formatted: format(date, 'yyyy-MM-dd'),
            display: {
                weekday: format(date, 'EEE', { locale: ptBR }),
                date: format(date, 'dd/MM', { locale: ptBR })
            }
        };
    });
    // Buscar funcionários
    const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
        queryKey: ['employees'],
        queryFn: employeeService.list,
        staleTime: 5 * 60 * 1000 // 5 minutos
    });
    // Buscar turnos para os próximos 7 dias
    const { data: shifts = [], isLoading: isLoadingShifts } = useQuery({
        queryKey: ['shifts', dates[0].formatted, dates[dates.length - 1].formatted],
        queryFn: () => shiftService.getShifts(dates[0].formatted, dates[dates.length - 1].formatted),
        staleTime: 0,
        refetchInterval: 5000
    });
    // Combinar funcionários com seus turnos
    const employeesWithShifts = employees.map(employee => {
        const employeeShifts = shifts
            .filter(shift => shift.employee_id === employee.id)
            .reduce((acc, shift) => {
            acc[shift.date] = {
                ...shift,
                mission: shift.mission || null
            };
            return acc;
        }, {});
        return {
            ...employee,
            shifts: employeeShifts
        };
    });
    // Filtrar funcionários com base no perfil do usuário e filtros aplicados
    const filteredEmployees = employeesWithShifts.filter(employee => {
        // Primeiro, aplicar restrição por departamento se não for admin
        if (!isAdmin && profile?.department) {
            if (employee.department !== profile.department) {
                return false;
            }
        }
        // Depois aplicar os filtros normais
        const nameMatch = employee.full_name.toLowerCase().includes(filters.name.toLowerCase());
        const departmentMatch = !filters.department || employee.department === filters.department;
        const teamMatch = !filters.team || employee.team === filters.team;
        return nameMatch && departmentMatch && teamMatch;
    });
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    const clearFilters = () => {
        setFilters({ name: '', department: '', team: '' });
    };
    if (isLoadingEmployees || isLoadingShifts) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsx("div", { className: "w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" }) }));
    }
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    return (_jsxs("div", { children: [isAdmin && (_jsx("div", { className: "flex justify-end mb-4", children: _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsFilterOpen(!isFilterOpen), className: `p-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative ${hasActiveFilters ? 'text-primary-600 border-primary-600' : 'text-gray-500'}`, title: "Filtrar lista", "aria-label": "Filtrar lista", children: [_jsx(FiFilter, { className: "w-5 h-5" }), hasActiveFilters && (_jsx("span", { className: "absolute -top-2 -right-2 w-4 h-4 text-[10px] font-medium text-white bg-primary-600 rounded-full flex items-center justify-center", children: Object.values(filters).filter(v => v !== '').length }))] }), isFilterOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4 z-50", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "filter-name", className: "block text-xs font-medium text-gray-700 mb-1", children: "Nome" }), _jsx("input", { id: "filter-name", type: "text", placeholder: "Filtrar por nome...", value: filters.name, onChange: e => handleFilterChange('name', e.target.value), className: "w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "filter-department", className: "block text-xs font-medium text-gray-700 mb-1", children: "Departamento" }), _jsxs("select", { id: "filter-department", value: filters.department, onChange: e => handleFilterChange('department', e.target.value), className: "w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Todos" }), _jsx("option", { value: "CP", children: "CP" }), _jsx("option", { value: "Lab", children: "Lab" }), _jsx("option", { value: "PC", children: "PC" }), _jsx("option", { value: "SV", children: "SV" }), _jsx("option", { value: "WW", children: "WW" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "filter-team", className: "block text-xs font-medium text-gray-700 mb-1", children: "Time" }), _jsxs("select", { id: "filter-team", value: filters.team, onChange: e => handleFilterChange('team', e.target.value), className: "w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Todos" }), _jsx("option", { value: "A", children: "Time A" }), _jsx("option", { value: "B", children: "Time B" }), _jsx("option", { value: "C", children: "Time C" }), _jsx("option", { value: "D", children: "Time D" })] })] }), _jsxs("div", { className: "flex justify-between pt-3 border-t", children: [_jsxs("button", { onClick: clearFilters, className: "flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900", children: [_jsx(FiX, { className: "w-4 h-4" }), "Limpar filtros"] }), _jsx("button", { onClick: () => setIsFilterOpen(false), className: "px-3 py-1 text-xs text-white bg-primary-600 rounded-md hover:bg-primary-700", children: "Aplicar" })] })] }) }))] }) })), _jsx("div", { className: styles.tableWrapper, children: _jsxs("table", { className: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: styles.stickyHeaderName, children: _jsx("div", { className: "text-[10px] uppercase", children: "Nome" }) }), _jsx("th", { className: styles.stickyHeaderDepartment, children: _jsx("div", { className: "text-[10px] uppercase", children: "Departamento" }) }), _jsx("th", { className: styles.stickyHeaderTeam, children: _jsx("div", { className: "text-[10px] uppercase", children: "Time" }) }), dates.map(({ full, formatted }) => {
                                        const isWeekend = [0, 6].includes(full.getDay());
                                        return (_jsxs("th", { className: `${styles.headerCell} ${isWeekend ? styles.weekendDay : ''}`, children: [_jsx("div", { className: "text-[10px] uppercase", children: format(full, 'EEE', { locale: ptBR }) }), _jsx("div", { className: "text-[11px]", children: format(full, 'dd/MM') })] }, formatted));
                                    })] }) }), _jsx("tbody", { children: filteredEmployees.map((employee, index) => (_jsxs("tr", { className: index % 2 === 0 ? styles.bodyRow : styles.stripedRow, children: [_jsx("td", { className: styles.stickyNameColumn, children: _jsx("div", { className: styles.employeeName, children: employee.full_name }) }), _jsx("td", { className: styles.stickyDepartmentColumn, children: _jsx("div", { className: styles.employeeInfo, children: employee.department }) }), _jsx("td", { className: styles.stickyTeamColumn, children: _jsxs("div", { className: styles.employeeInfo, children: ["Time ", employee.team] }) }), dates.map(({ full, formatted }) => {
                                        const isWeekend = [0, 6].includes(full.getDay());
                                        const shift = employee.shifts[formatted];
                                        return (_jsx("td", { className: `${styles.bodyCell} ${isWeekend ? styles.weekendDay : ''}`, children: shift && (_jsxs("div", { className: "flex flex-col items-center justify-center gap-0.5", children: [_jsx("div", { className: `text-lg font-bold leading-none ${SHIFT_COLORS[shift.shift_type]}`, children: shift.shift_type }), shift.mission && (_jsx("div", { className: "text-[9px] text-gray-700 font-medium whitespace-nowrap overflow-visible", children: shift.mission }))] })) }, formatted));
                                    })] }, employee.id))) })] }) })] }));
}
