import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { EmployeeFilter } from './EmployeeFilter';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
export function EmployeeList() {
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        team: ''
    });
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const queryClient = useQueryClient();
    const { data: employees, isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.list()
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => employeeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setEmployeeToDelete(null);
        }
    });
    const filteredEmployees = useMemo(() => {
        if (!employees)
            return [];
        return employees.filter(employee => {
            const nameMatch = employee.full_name.toLowerCase().includes(filters.name.toLowerCase());
            const departmentMatch = !filters.department || employee.department === filters.department;
            const teamMatch = !filters.team || employee.team === filters.team;
            return nameMatch && departmentMatch && teamMatch;
        });
    }, [employees, filters]);
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-10 bg-gray-200 rounded animate-pulse" }), [...Array(5)].map((_, i) => (_jsx("div", { className: "h-16 bg-gray-200 rounded animate-pulse" }, i)))] }));
    }
    if (error) {
        return (_jsx("div", { className: "p-4 text-sm text-red-700 bg-red-100 rounded-lg", children: "Erro ao carregar funcion\u00E1rios" }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: "Funcion\u00E1rios" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(EmployeeFilter, { onFilterChange: setFilters }), _jsxs(Link, { to: "/employees/new", className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: [_jsx(FiPlus, { className: "w-4 h-4" }), "Novo Funcion\u00E1rio"] })] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 dark:bg-gray-700/50", children: [_jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Nome" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Departamento" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Time" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: filteredEmployees.map((employee) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: [_jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: _jsx("div", { className: "text-xs font-medium text-gray-900 dark:text-white", children: employee.full_name }) }), _jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: employee.email }) }), _jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: employee.department }) }), _jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Time ", employee.team] }) }), _jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: _jsx("span", { className: `px-1.5 py-0.5 text-[10px] leading-4 font-medium rounded-full ${employee.active
                                                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                                    : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'}`, children: employee.active ? 'Ativo' : 'Inativo' }) }), _jsx("td", { className: "px-4 py-2 whitespace-nowrap text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Link, { to: `/employees/${employee.id}/edit`, className: "text-primary-600 hover:text-primary-900 transition-colors", children: _jsx(FiEdit2, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => setEmployeeToDelete(employee.id), className: "text-red-600 hover:text-red-900 transition-colors", children: _jsx(FiTrash2, { className: "w-3.5 h-3.5" }) })] }) })] }, employee.id))) })] }) }) }), employeeToDelete && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-4", children: "Confirmar exclus\u00E3o" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-6", children: "Tem certeza que deseja excluir este funcion\u00E1rio? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita." }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setEmployeeToDelete(null), className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Cancelar" }), _jsx("button", { onClick: () => {
                                        if (employeeToDelete) {
                                            deleteMutation.mutate(employeeToDelete);
                                        }
                                    }, disabled: deleteMutation.isPending, className: "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50", children: deleteMutation.isPending ? 'Excluindo...' : 'Excluir' })] })] }) }))] }));
}
