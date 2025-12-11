import { detectCardBrand as detectBrand } from '@/utils/formatters';

export const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += parseInt(cpf[i]) * (10 - i);
    }
    let digito1 = (soma1 * 10) % 11;
    if (digito1 >= 10) digito1 = 0;

    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
        soma2 += parseInt(cpf[i]) * (11 - i);
    }
    let digito2 = (soma2 * 10) % 11;
    if (digito2 >= 10) digito2 = 0;

    return parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2;
};

export const validatePhone = (telefone: string): { isValid: boolean; errorMessage: string } => {
    const phoneDigits = telefone.replace(/\D/g, '');
    
    if (phoneDigits.length < 8) {
        return { isValid: false, errorMessage: 'O telefone deve ter ao menos 8 dígitos' };
    }
    if (phoneDigits.length > 11) {
        return { isValid: false, errorMessage: 'O telefone não pode ter mais que 11 dígitos' };
    }
    return { isValid: true, errorMessage: '' };
};

export const validatePasswords = (password: string, confirmPassword: string): { isValid: boolean; errorMessage: string } => {
    if (password !== confirmPassword) {
        return { isValid: false, errorMessage: 'As senhas não coincidem' };
    }
    if (password.length < 6) {
        return { isValid: false, errorMessage: 'A senha deve ter pelo menos 6 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, errorMessage: 'A senha deve conter pelo menos uma letra maiúscula' };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, errorMessage: 'A senha deve conter pelo menos uma letra minúscula' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, errorMessage: 'A senha deve conter pelo menos um número' };
    }
    return { isValid: true, errorMessage: '' };
};

export const detectCardBrand = detectBrand;
