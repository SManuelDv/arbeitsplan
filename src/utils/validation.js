import { z } from 'zod';
export const passwordSchema = z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');
export const emailSchema = z
    .string()
    .email('Email inválido')
    .min(5, 'Email muito curto')
    .max(100, 'Email muito longo');
export const fullNameSchema = z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras')
    .transform(val => val.trim())
    .refine(val => val.includes(' '), 'Digite o nome completo');
export const roleSchema = z.enum(['admin', 'normal'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' })
});
export function validatePassword(password) {
    const errors = [];
    if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial');
    }
    return errors;
}
export function validateEmail(email) {
    const errors = [];
    if (!email) {
        errors.push('Email é obrigatório');
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email inválido');
    }
    return errors;
}
export function validateFullName(name) {
    const errors = [];
    if (!name) {
        errors.push('Nome é obrigatório');
    }
    else {
        if (name.length < 3) {
            errors.push('Nome deve ter no mínimo 3 caracteres');
        }
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
            errors.push('Nome deve conter apenas letras');
        }
        if (!name.includes(' ')) {
            errors.push('Digite o nome completo');
        }
    }
    return errors;
}
