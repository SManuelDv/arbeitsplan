import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { AuthCallback } from '../pages/auth/AuthCallback';
import { Dashboard } from '../pages/Dashboard';
import { Employees } from '../pages/employees/Employees';
import { EmployeeForm } from '../pages/employees/EmployeeForm';
import { ShiftManagement } from '../pages/shifts/ShiftManagement';
import { useAuthContext } from '../providers/AuthProvider';
// Componente de loading
function LoadingSpinner() {
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
}
// Componente para rotas protegidas
function PrivateRoute({ children }) {
    const { user, loading } = useAuthContext();
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    if (!user) {
        return _jsx(Navigate, { to: "/auth/login" });
    }
    return _jsx(_Fragment, { children: children });
}
// Componente para rotas públicas
function PublicRoute({ children }) {
    const { user, loading } = useAuthContext();
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    if (user) {
        return _jsx(Navigate, { to: "/" });
    }
    return _jsx(_Fragment, { children: children });
}
// Configuração das rotas
const router = createBrowserRouter([
    // Rotas públicas
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                element: _jsx(PublicRoute, { children: _jsx(Login, {}) })
            },
            {
                path: 'register',
                element: _jsx(PublicRoute, { children: _jsx(Register, {}) })
            },
            {
                path: 'forgot-password',
                element: _jsx(PublicRoute, { children: _jsx(ForgotPassword, {}) })
            },
            {
                path: 'callback',
                element: _jsx(AuthCallback, {})
            }
        ]
    },
    // Redirecionar rotas antigas
    {
        path: '/login',
        element: _jsx(Navigate, { to: "/auth/login", replace: true })
    },
    {
        path: '/register',
        element: _jsx(Navigate, { to: "/auth/register", replace: true })
    },
    {
        path: '/forgot-password',
        element: _jsx(Navigate, { to: "/auth/forgot-password", replace: true })
    },
    // Rotas protegidas
    {
        path: '/',
        element: _jsx(PrivateRoute, { children: _jsx(DefaultLayout, {}) }),
        children: [
            {
                path: '',
                element: _jsx(Dashboard, {})
            },
            {
                path: 'employees',
                element: _jsx(Employees, {})
            },
            {
                path: 'employees/new',
                element: _jsx(EmployeeForm, {})
            },
            {
                path: 'employees/:id/edit',
                element: _jsx(EmployeeForm, {})
            },
            {
                path: 'shifts',
                element: _jsx(ShiftManagement, {})
            }
        ]
    },
    // Rota 404
    {
        path: '*',
        element: _jsx(Navigate, { to: "/" })
    }
]);
// Componente principal de rotas
export function AppRoutes() {
    return (_jsx(Suspense, { fallback: _jsx(LoadingSpinner, {}), children: _jsx(RouterProvider, { router: router }) }));
}
