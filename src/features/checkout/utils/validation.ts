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
    return { isValid: true, errorMessage: '' };
};

export const detectCardBrand = (cardNumber: string): string => {
    const n = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'American Express';
    if (/^(6011|65)/.test(n)) return 'Discover';
    if (/^606282/.test(n)) return 'Hipercard';
    if (/^(401178|401179|438935|457631|457632|431274|451416|457393|504175|627780|636297|636368)/.test(n)) return 'Elo';
    
    return 'Desconhecido';
};

