import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FiFilter } from 'react-icons/fi';
export function ShiftFilter({ filters, onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    const handleFilterChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };
    const clearFilters = () => {
        const emptyFilters = { name: '', department: '', team: '' };
        setLocalFilters(emptyFilters);
        onFilterChange(emptyFilters);
        setIsOpen(false);
    };
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: `p-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative ${hasActiveFilters ? 'text-primary-600 border-primary-600' : 'text-gray-500'}`, title: "Filtrar lista", "aria-label": "Filtrar lista", children: [_jsx(FiFilter, { className: "w-5 h-5" }), hasActiveFilters && (_jsx("span", { className: "absolute -top-2 -right-2 w-4 h-4 text-[10px] font-medium text-white bg-primary-600 rounded-full flex items-center justify-center", children: Object.values(filters).filter(v => v !== '').length }))] }), isOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4 space-y-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", placeholder: "Filtrar por nome...", value: localFilters.name, onChange: e => handleFilterChange('name', e.target.value), className: "px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" }), _jsxs("select", { value: localFilters.department, onChange: e => handleFilterChange('department', e.target.value), className: "px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Departamento" }), _jsx("option", { value: "CP", children: "CP" }), _jsx("option", { value: "Lab", children: "Lab" }), _jsx("option", { value: "PC", children: "PC" }), _jsx("option", { value: "SV", children: "SV" }), _jsx("option", { value: "WW", children: "WW" })] }), _jsxs("select", { value: localFilters.team, onChange: e => handleFilterChange('team', e.target.value), className: "px-2 py-1 text-[11px] border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Time" }), _jsx("option", { value: "A", children: "A" }), _jsx("option", { value: "B", children: "B" }), _jsx("option", { value: "C", children: "C" }), _jsx("option", { value: "D", children: "D" })] }), _jsx("button", { onClick: clearFilters, className: "px-2 py-1 text-[11px] text-gray-600 hover:text-gray-900", children: "Limpar" })] }) }))] }));
}
