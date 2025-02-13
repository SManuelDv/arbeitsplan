import { jsx as _jsx } from "react/jsx-runtime";
import { EmployeeList } from './EmployeeList';
export function Employees() {
    return (_jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(EmployeeList, {}) }));
}
