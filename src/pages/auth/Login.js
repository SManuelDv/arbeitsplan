import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { validateEmail } from '../../utils/validation';
import { Feedback } from '../../components/ui/Feedback';
export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        const emailErrors = validateEmail(formData.email);
        const passwordErrors = formData.password ? [] : ['Senha é obrigatória'];
        const allErrors = [...emailErrors, ...passwordErrors];
        setErrors(allErrors);
        return allErrors.length === 0;
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });
            if (error) {
                setErrors(['Email ou senha inválidos']);
            }
            else {
                setSuccess('Login realizado com sucesso!');
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        }
        catch (error) {
            setErrors(['Ocorreu um erro ao fazer login. Tente novamente.']);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsx("div", { children: _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Entre na sua conta" }) }), errors.length > 0 && (_jsx(Feedback, { type: "error", message: errors, onClose: () => setErrors([]) })), success && (_jsx(Feedback, { type: "success", message: success, onClose: () => setSuccess('') })), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleLogin, children: [_jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email", value: formData.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: "Senha" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Senha", value: formData.password, onChange: handleChange })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`, children: loading ? 'Entrando...' : 'Entrar' }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/auth/register", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "N\u00E3o tem uma conta? Registre-se" }) }), _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/auth/forgot-password", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Esqueceu sua senha?" }) })] })] })] }) }));
}
