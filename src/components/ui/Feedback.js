import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
export function Feedback({ type = 'info', message, onClose, className = '' }) {
    const messages = Array.isArray(message) ? message : [message];
    const styles = {
        success: 'bg-green-100 text-green-800 border-green-300',
        error: 'bg-red-100 text-red-800 border-red-300',
        info: 'bg-blue-100 text-blue-800 border-blue-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    const icons = {
        success: _jsx(FiCheckCircle, { className: "w-5 h-5" }),
        error: _jsx(FiAlertCircle, { className: "w-5 h-5" }),
        info: _jsx(FiInfo, { className: "w-5 h-5" }),
        warning: _jsx(FiAlertCircle, { className: "w-5 h-5" })
    };
    return (_jsx("div", { className: `rounded-lg p-4 mb-4 border ${styles[type]} ${className}`, role: "alert", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: icons[type] }), _jsx("div", { className: "ml-3", children: messages.map((msg, index) => (_jsx("p", { className: "text-sm", children: msg }, index))) }), onClose && (_jsxs("button", { onClick: onClose, className: "ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8", children: [_jsx("span", { className: "sr-only", children: "Fechar" }), _jsx(FiX, { className: "w-5 h-5" })] }))] }) }));
}
