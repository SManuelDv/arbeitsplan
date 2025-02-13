import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { validateEmail } from '../../utils/validation';
import { Feedback } from '../../components/ui/Feedback';
export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const handleChange = (e) => {
        setEmail(e.target.value);
        setErrors([]);
        setSuccess('');
    };
    const validateForm = () => {
        const emailErrors = validateEmail(email);
        setErrors(emailErrors);
        return emailErrors.length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (error) {
                throw error;
            }
            setSuccess('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
        }
        catch (error) {
            if (error instanceof Error) {
                setErrors(['Ocorreu um erro ao enviar o email de recuperação. Tente novamente.']);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Recuperar Senha" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Digite seu email para receber as instru\u00E7\u00F5es" })] }), errors.length > 0 && (_jsx(Feedback, { type: "error", message: errors, onClose: () => setErrors([]) })), success && (_jsx(Feedback, { type: "success", message: success, onClose: () => setSuccess('') })), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email", value: email, onChange: handleChange })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`, children: loading ? 'Enviando...' : 'Enviar Email de Recuperação' }) }), _jsx("div", { className: "text-sm text-center", children: _jsx(Link, { to: "/auth/login", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Voltar para o login" }) })] })] }) }));
}
