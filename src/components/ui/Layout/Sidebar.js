import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiCalendar } from 'react-icons/fi';
export function Sidebar({ isOpen, setIsOpen }) {
    const location = useLocation();
    const { user } = useAuthContext();
    const menuItems = [
        {
            path: '/',
            label: 'Dashboard',
            icon: _jsx(FiHome, { className: "w-5 h-5" })
        },
        {
            path: '/employees',
            label: 'Funcionários',
            icon: _jsx(FiUsers, { className: "w-5 h-5" })
        },
        {
            path: '/shifts',
            label: 'Turnos',
            icon: _jsx(FiCalendar, { className: "w-5 h-5" })
        },
        {
            path: '/changes',
            label: 'Gestão de Turnos',
            icon: (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" }) }))
        },
        {
            path: '/reports',
            label: 'Relatórios',
            icon: (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z", clipRule: "evenodd" }) }))
        },
        {
            path: '/settings',
            label: 'Configurações',
            icon: (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z", clipRule: "evenodd" }) }))
        }
    ];
    return (_jsxs("div", { children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200", "aria-label": isOpen ? 'Fechar menu' : 'Abrir menu', children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" }) }) }), _jsx("div", { children: isOpen && (_jsx(motion.aside, { initial: { x: -240 }, animate: { x: 0 }, exit: { x: -240 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: `fixed top-0 left-0 z-40 h-screen w-60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 shadow-lg ${isOpen ? 'w-64' : 'w-20'}`, children: _jsxs("nav", { className: "h-full pt-20 pb-4 px-3 flex flex-col", children: [_jsx("div", { className: "flex-1 space-y-1", children: menuItems.map(item => (_jsxs(Link, { to: item.path, className: `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${location.pathname === item.path
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'}`, children: [_jsx("span", { className: "w-5 h-5", children: item.icon }), isOpen && _jsx("span", { className: "ml-3", children: item.label })] }, item.path))) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-4 mt-4", children: _jsxs("div", { className: "flex items-center px-3 py-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400", children: user?.email?.[0].toUpperCase() }), _jsx("div", { className: "ml-3 overflow-hidden", children: _jsx("p", { className: "text-sm font-medium text-gray-800 dark:text-white truncate", children: user?.email }) })] }) })] }) })) }), _jsx("div", { children: isOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsOpen(false), className: "fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" })) })] }));
}
