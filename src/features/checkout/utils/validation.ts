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

export const validateCNPJ = (cnpj: string): boolean => {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const calcDigit = (digits: string, weights: number[]): number => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += parseInt(digits[i]) * weights[i];
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const digit1 = calcDigit(cnpj.substring(0, 12), weights1);
    const digit2 = calcDigit(cnpj.substring(0, 12) + digit1, weights2);

    return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2;
};

export const validateEmail = (email: string): { isValid: boolean; errorMessage: string } => {
    if (!email) {
        return { isValid: false, errorMessage: 'Email é obrigatório' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, errorMessage: 'Formato de email inválido' };
    }
    return { isValid: true, errorMessage: '' };
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

export const validateBirthDate = (birthDate: string): { isValid: boolean; errorMessage: string } => {
    if (!birthDate || birthDate.length !== 10) {
        return { isValid: false, errorMessage: 'Data de nascimento é obrigatória' };
    }
    
    const [dayStr, monthStr, yearStr] = birthDate.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return { isValid: false, errorMessage: 'Data de nascimento inválida' };
    }
    
    if (month < 1 || month > 12) {
        return { isValid: false, errorMessage: 'Mês inválido' };
    }
    
    if (day < 1 || day > 31) {
        return { isValid: false, errorMessage: 'Dia inválido' };
    }
    
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        return { isValid: false, errorMessage: 'Ano inválido' };
    }
    
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1) {
        return { isValid: false, errorMessage: 'Data inválida' };
    }
    
    const today = new Date();
    const age = today.getFullYear() - year - ((today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) ? 1 : 0);
    if (age < 18) {
        return { isValid: false, errorMessage: 'Você deve ter pelo menos 18 anos' };
    }
    
    return { isValid: true, errorMessage: '' };
};

export const detectCardBrand = detectBrand;

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'discover' | 'unknown';

const ACCEPTED_BRANDS: CardBrand[] = ['visa', 'mastercard', 'amex', 'elo', 'hipercard'];

export const validateLuhn = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length === 0) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
};

export const getCardBrandInfo = (cardNumber: string): { brand: CardBrand; cvvLength: number; cardLength: number[] } => {
    const brand = detectBrand(cardNumber) as CardBrand;
    
    switch (brand) {
        case 'amex':
            return { brand, cvvLength: 4, cardLength: [15] };
        case 'visa':
            return { brand, cvvLength: 3, cardLength: [13, 16, 19] };
        case 'mastercard':
            return { brand, cvvLength: 3, cardLength: [16] };
        case 'elo':
        case 'hipercard':
            return { brand, cvvLength: 3, cardLength: [16] };
        case 'discover':
            return { brand, cvvLength: 3, cardLength: [16] };
        default:
            return { brand: 'unknown', cvvLength: 3, cardLength: [13, 14, 15, 16, 17, 18, 19] };
    }
};

export const validateCardNumber = (cardNumber: string): { isValid: boolean; errorMessage: string; brand: CardBrand } => {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (!digits) {
        return { isValid: false, errorMessage: 'Número do cartão é obrigatório', brand: 'unknown' };
    }
    
    if (digits.length < 13) {
        return { isValid: false, errorMessage: 'Número do cartão incompleto', brand: 'unknown' };
    }
    
    if (digits.length > 19) {
        return { isValid: false, errorMessage: 'Número do cartão muito longo', brand: 'unknown' };
    }
    
    const { brand, cardLength } = getCardBrandInfo(digits);
    
    if (brand !== 'unknown' && !cardLength.includes(digits.length)) {
        return { isValid: false, errorMessage: `Número inválido para ${brand.toUpperCase()}`, brand };
    }
    
    if (!validateLuhn(digits)) {
        return { isValid: false, errorMessage: 'Número do cartão inválido', brand };
    }
    
    if (!ACCEPTED_BRANDS.includes(brand)) {
        return { isValid: false, errorMessage: 'Bandeira não aceita', brand };
    }
    
    return { isValid: true, errorMessage: '', brand };
};

export const validateCardExpiration = (expiration: string): { isValid: boolean; errorMessage: string } => {
    if (!expiration || expiration.length !== 5) {
        return { isValid: false, errorMessage: 'Data de validade é obrigatória' };
    }
    
    const [monthStr, yearStr] = expiration.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    if (isNaN(month) || isNaN(year)) {
        return { isValid: false, errorMessage: 'Data inválida' };
    }
    
    if (month < 1 || month > 12) {
        return { isValid: false, errorMessage: 'Mês inválido (01-12)' };
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return { isValid: false, errorMessage: 'Cartão expirado' };
    }
    
    if (year > currentYear + 20) {
        return { isValid: false, errorMessage: 'Data de validade inválida' };
    }
    
    return { isValid: true, errorMessage: '' };
};

export const validateCVV = (cvv: string, cardNumber: string): { isValid: boolean; errorMessage: string } => {
    const digits = cvv.replace(/\D/g, '');
    
    if (!digits) {
        return { isValid: false, errorMessage: 'CVV é obrigatório' };
    }
    
    const { cvvLength, brand } = getCardBrandInfo(cardNumber);
    
    if (digits.length !== cvvLength) {
        const expected = brand === 'amex' ? '4 dígitos' : '3 dígitos';
        return { isValid: false, errorMessage: `CVV deve ter ${expected}` };
    }
    
    if (/^(\d)\1+$/.test(digits)) {
        return { isValid: false, errorMessage: 'CVV inválido' };
    }
    
    return { isValid: true, errorMessage: '' };
};

export const validateCardHolderName = (name: string): { isValid: boolean; errorMessage: string } => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, errorMessage: 'Nome do titular é obrigatório' };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 3) {
        return { isValid: false, errorMessage: 'Nome muito curto' };
    }
    
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(trimmedName)) {
        return { isValid: false, errorMessage: 'Nome contém caracteres inválidos' };
    }
    
    const words = trimmedName.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) {
        return { isValid: false, errorMessage: 'Informe nome e sobrenome' };
    }
    
    return { isValid: true, errorMessage: '' };
};

export const validateCardHolderDocument = (cpf: string): { isValid: boolean; errorMessage: string } => {
    const digits = cpf.replace(/\D/g, '');
    
    if (!digits) {
        return { isValid: false, errorMessage: 'CPF do titular é obrigatório' };
    }
    
    if (digits.length !== 11) {
        return { isValid: false, errorMessage: 'CPF incompleto' };
    }
    
    if (!validateCPF(cpf)) {
        return { isValid: false, errorMessage: 'CPF inválido' };
    }
    
    return { isValid: true, errorMessage: '' };
};
