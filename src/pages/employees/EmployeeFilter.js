import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
export function EmployeeFilter({ onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        department: '',
        team: ''
    });
    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    const clearFilters = () => {
        const newFilters = { name: '', department: '', team: '' };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: [_jsx(FiFilter, { className: "w-4 h-4" }), Object.values(filters).some(v => v) && (_jsx("span", { className: "flex items-center justify-center w-5 h-5 text-xs text-white bg-primary-500 rounded-full", children: Object.values(filters).filter(v => v).length }))] }), isOpen && (_jsx("div", { className: "absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-72", children: _jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Nome" }), _jsx("input", { type: "text", value: filters.name, onChange: (e) => handleFilterChange('name', e.target.value), placeholder: "Buscar por nome...", className: "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "filter-department", className: "block text-sm font-medium text-gray-700", children: "Departamento" }), _jsxs("select", { id: "filter-department", value: filters.department, onChange: (e) => handleFilterChange('department', e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500", "aria-label": "Filtrar por departamento", children: [_jsx("option", { value: "", children: "Todos" }), _jsx("option", { value: "CasePack", children: "CasePack" }), _jsx("option", { value: "Labor", children: "Labor" }), _jsx("option", { value: "PrepCenter", children: "PrepCenter" }), _jsx("option", { value: "Service", children: "Service" }), _jsx("option", { value: "Wipes", children: "Wipes" }), _jsx("option", { value: "Outro", children: "Outro" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "filter-team", className: "block text-sm font-medium text-gray-700", children: "Time" }), _jsxs("select", { id: "filter-team", value: filters.team, onChange: (e) => handleFilterChange('team', e.target.value), className: "w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500", "aria-label": "Filtrar por time", children: [_jsx("option", { value: "", children: "Todos" }), _jsx("option", { value: "A", children: "Time A" }), _jsx("option", { value: "B", children: "Time B" }), _jsx("option", { value: "C", children: "Time C" }), _jsx("option", { value: "D", children: "Time D" })] })] }), _jsxs("div", { className: "flex justify-between pt-2", children: [_jsxs("button", { onClick: clearFilters, className: "flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900", children: [_jsx(FiX, { className: "w-4 h-4" }), "Limpar filtros"] }), _jsx("button", { onClick: () => setIsOpen(false), className: "px-3 py-1 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700", children: "Aplicar" })] })] }) }))] }));
}
