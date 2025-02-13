import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ text, onClick, variant = 'primary' }) => {
    const baseStyle = 'px-4 py-2 rounded-md font-medium';
    const variantStyle = variant === 'primary'
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    return (_jsx("button", { onClick: onClick, className: `${baseStyle} ${variantStyle}`, type: "button", children: text }));
};
