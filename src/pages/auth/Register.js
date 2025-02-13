import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { validateEmail, validatePassword, validateFullName } from '../../utils/validation';
import { Feedback } from '../../components/ui/Feedback';
export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors([]);
        setSuccess('');
    };
    const validateForm = () => {
        const allErrors = [];
        // Validar nome completo
        const nameErrors = validateFullName(formData.fullName);
        allErrors.push(...nameErrors);
        // Validar email
        const emailErrors = validateEmail(formData.email);
        allErrors.push(...emailErrors);
        // Validar senha
        const passwordErrors = validatePassword(formData.password);
        allErrors.push(...passwordErrors);
        // Validar confirmação de senha
        if (formData.password !== formData.confirmPassword) {
            allErrors.push('As senhas não coincidem');
        }
        setErrors(allErrors);
        return allErrors.length === 0;
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);
            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'normal'
                    }
                }
            });
            if (signUpError) {
                throw signUpError;
            }
            if (user) {
                setSuccess('Registro realizado com sucesso! Verifique seu email para confirmar sua conta.');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 3000);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('already registered')) {
                    setErrors(['Este email já está registrado']);
                }
                else {
                    setErrors(['Ocorreu um erro ao fazer o registro. Tente novamente.']);
                }
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsx("div", { children: _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Crie sua conta" }) }), errors.length > 0 && (_jsx(Feedback, { type: "error", message: errors, onClose: () => setErrors([]) })), success && (_jsx(Feedback, { type: "success", message: success, onClose: () => setSuccess('') })), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleRegister, children: [_jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fullName", className: "sr-only", children: "Nome Completo" }), _jsx("input", { id: "fullName", name: "fullName", type: "text", required: true, className: "appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Nome Completo", value: formData.fullName, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email", value: formData.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: "Senha" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "new-password", required: true, className: "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Senha", value: formData.password, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "sr-only", children: "Confirmar Senha" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, className: "appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Confirmar Senha", value: formData.confirmPassword, onChange: handleChange })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`, children: loading ? 'Registrando...' : 'Registrar' }) }), _jsx("div", { className: "text-sm text-center", children: _jsx(Link, { to: "/auth/login", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "J\u00E1 tem uma conta? Entre aqui" }) })] })] }) }));
}
