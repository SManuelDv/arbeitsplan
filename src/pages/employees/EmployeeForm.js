import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
export function EmployeeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = Boolean(id);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        department: undefined,
        role: undefined,
        team: 'A',
        active: true
    });
    const { data: employee, isLoading: isLoadingEmployee } = useQuery({
        queryKey: ['employee', id],
        queryFn: () => (id ? employeeService.getById(id) : null),
        enabled: isEditing
    });
    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);
    const mutation = useMutation({
        mutationFn: (data) => {
            if (isEditing && id) {
                return employeeService.update(id, data);
            }
            return employeeService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            navigate('/employees');
        },
        onError: (error) => {
            setError(error.message);
        }
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            full_name: formData.get('full_name')?.toString() || '',
            email: formData.get('email')?.toString() || '',
            phone: formData.get('phone')?.toString() || null,
            department: formData.get('department')?.toString(),
            team: formData.get('team')?.toString() || 'A',
            role: formData.get('role')?.toString(),
            contract_start: formData.get('contract_start')?.toString() || '',
            active: Boolean(formData.get('active')),
            created_by: null
        };
        mutation.mutate(data);
    };
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }));
    };
    if (isLoadingEmployee) {
        return _jsx("div", { children: "Carregando..." });
    }
    return (_jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "sm:flex sm:items-center", children: _jsx("div", { className: "sm:flex-auto", children: _jsx("h1", { className: "text-base font-semibold leading-6 text-gray-900", children: isEditing ? 'Editar Funcionário' : 'Novo Funcionário' }) }) }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-6", children: [error && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsx("div", { className: "flex", children: _jsx("div", { className: "ml-3", children: _jsx("h3", { className: "text-sm font-medium text-red-800", children: error }) }) }) })), _jsx("div", { className: "space-y-6 bg-white px-4 py-5 sm:p-6", children: _jsxs("div", { className: "grid grid-cols-6 gap-6", children: [_jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "full_name", className: "block text-sm font-medium leading-6 text-gray-900", children: "Nome completo" }), _jsx("input", { type: "text", name: "full_name", id: "full_name", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.full_name || '', onChange: handleInputChange })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium leading-6 text-gray-900", children: "Email" }), _jsx("input", { type: "email", name: "email", id: "email", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.email || '', onChange: handleInputChange })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "phone", className: "block text-sm font-medium leading-6 text-gray-900", children: "Telefone" }), _jsx("input", { type: "tel", name: "phone", id: "phone", className: "mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.phone || '', onChange: handleInputChange })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "department", className: "block text-sm font-medium leading-6 text-gray-900", children: "Departamento" }), _jsxs("select", { id: "department", name: "department", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.department || '', onChange: handleInputChange, children: [_jsx("option", { value: "", children: "Selecione um departamento" }), _jsx("option", { value: "CasePack", children: "CasePack" }), _jsx("option", { value: "Labor", children: "Labor" }), _jsx("option", { value: "PrepCenter", children: "PrepCenter" }), _jsx("option", { value: "Service", children: "Service" }), _jsx("option", { value: "Wipes", children: "Wipes" }), _jsx("option", { value: "Outro", children: "Outro" })] })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "team", className: "block text-sm font-medium leading-6 text-gray-900", children: "Time" }), _jsxs("select", { id: "team", name: "team", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.team || 'A', onChange: handleInputChange, children: [_jsx("option", { value: "A", children: "A" }), _jsx("option", { value: "B", children: "B" }), _jsx("option", { value: "C", children: "C" }), _jsx("option", { value: "D", children: "D" })] })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "role", className: "block text-sm font-medium leading-6 text-gray-900", children: "Fun\u00E7\u00E3o" }), _jsxs("select", { id: "role", name: "role", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.role || '', onChange: handleInputChange, children: [_jsx("option", { value: "", children: "Selecione uma fun\u00E7\u00E3o" }), _jsx("option", { value: "CP Verpacker", children: "CP Verpacker" }), _jsx("option", { value: "fU", children: "fU" }), _jsx("option", { value: "K", children: "K" }), _jsx("option", { value: "Lab Koordinator", children: "Lab Koordinator" }), _jsx("option", { value: "Lab Messung", children: "Lab Messung" }), _jsx("option", { value: "PC SAP", children: "PC SAP" }), _jsx("option", { value: "PC Spleisser", children: "PC Spleisser" }), _jsx("option", { value: "PC Training", children: "PC Training" }), _jsx("option", { value: "SV AGM", children: "SV AGM" }), _jsx("option", { value: "SV Battery", children: "SV Battery" }), _jsx("option", { value: "SV CSX", children: "SV CSX" }), _jsx("option", { value: "U", children: "U" }), _jsx("option", { value: "WW Bevorrater", children: "WW Bevorrater" }), _jsx("option", { value: "WW CaseLoader", children: "WW CaseLoader" }), _jsx("option", { value: "ZK", children: "ZK" })] })] }), _jsxs("div", { className: "col-span-6 sm:col-span-3", children: [_jsx("label", { htmlFor: "contract_start", className: "block text-sm font-medium leading-6 text-gray-900", children: "Data de in\u00EDcio" }), _jsx("input", { type: "date", name: "contract_start", id: "contract_start", required: true, className: "mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", value: formData.contract_start || '', onChange: handleInputChange })] }), _jsx("div", { className: "col-span-6", children: _jsxs("div", { className: "relative flex items-start", children: [_jsx("div", { className: "flex h-6 items-center", children: _jsx("input", { id: "active", name: "active", type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600", checked: formData.active, onChange: handleInputChange }) }), _jsx("div", { className: "ml-3 text-sm leading-6", children: _jsx("label", { htmlFor: "active", className: "font-medium text-gray-900", children: "Ativo" }) })] }) })] }) }), _jsxs("div", { className: "bg-gray-50 px-4 py-3 text-right sm:px-6", children: [_jsx("button", { type: "button", className: "mr-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50", onClick: () => navigate('/employees'), children: "Cancelar" }), _jsx("button", { type: "submit", className: "inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", children: isEditing ? 'Salvar' : 'Criar' })] })] })] }));
}
