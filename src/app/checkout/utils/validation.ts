/**
 * Funções utilitárias para validação de dados do checkout
 */

/**
 * Valida um CPF
 * @param cpf - CPF a ser validado
 * @returns Boolean indicando se o CPF é válido
 */
export const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += parseInt(cpf[i]) * (10 - i);
    }
    let digito1 = (soma1 * 10) % 11;
    if (digito1 === 10 || digito1 === 11) {
        digito1 = 0;
    }

    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
        soma2 += parseInt(cpf[i]) * (11 - i);
    }
    let digito2 = (soma2 * 10) % 11;
    if (digito2 === 10 || digito2 === 11) {
        digito2 = 0;
    }

    return parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2;
};

/**
 * Valida um número de telefone
 * @param telefone - Número de telefone a ser validado
 * @returns Boolean indicando se o telefone é válido
 */
export const validatePhone = (telefone: string): {isValid: boolean, errorMessage: string} => {
    const phoneDigits = telefone.replace(/\D/g, '');
    
    // Validação básica - telefone precisa ter ao menos 8 dígitos (fixo) ou 10/11 dígitos (celular)
    if (phoneDigits.length < 8) {
        return {
            isValid: false,
            errorMessage: 'O telefone deve ter ao menos 8 dígitos'
        };
    } else if (phoneDigits.length > 11) {
        return {
            isValid: false,
            errorMessage: 'O telefone não pode ter mais que 11 dígitos'
        };
    } else {
        return {
            isValid: true,
            errorMessage: ''
        };
    }
};

/**
 * Valida senhas e confirma se são iguais
 * @param password - Senha fornecida
 * @param confirmPassword - Confirmação da senha
 * @returns Objeto com resultado da validação e mensagem de erro
 */
export const validatePasswords = (password: string, confirmPassword: string): {isValid: boolean, errorMessage: string} => {
    if (password !== confirmPassword) {
        return {
            isValid: false,
            errorMessage: 'As senhas não coincidem'
        };
    } else if (password.length < 6) {
        return {
            isValid: false,
            errorMessage: 'A senha deve ter pelo menos 6 caracteres'
        };
    } else {
        return {
            isValid: true,
            errorMessage: ''
        };
    }
};

/**
 * Verifica se os campos obrigatórios estão preenchidos
 * @param fields - Objeto com os campos a serem validados
 * @param requiredFields - Array com os nomes dos campos obrigatórios
 * @returns Boolean indicando se todos os campos obrigatórios estão preenchidos
 */
export const validateRequiredFields = (fields: any, requiredFields: string[]): boolean => {
    return requiredFields.every(field => !!fields[field]);
};

/**
 * Detecta a bandeira do cartão com base no número
 * @param cardNumber - Número do cartão de crédito
 * @returns String com o nome da bandeira
 */
export const detectCardBrand = (cardNumber: string): string => {
    // Remover espaços e caracteres não numéricos
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Visa: começa com 4
    if (/^4/.test(cleanNumber)) return "Visa";
    
    // Mastercard: começa com 5 seguido por 1-5
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    
    // Amex: começa com 34 ou 37
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    
    // Discover: começa com 6011 ou 65
    if (/^(6011|65)/.test(cleanNumber)) return "Discover";
    
    // Elo: vários padrões
    if (/^(401178|401179|438935|457631|457632|431274|451416|457393|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8])|(65092[1-9]|65097[0-8]))/.test(cleanNumber)) return "Elo";
    
    // Hipercard: começa com 606282
    if (/^(606282)/.test(cleanNumber)) return "Hipercard";
    
    return "Desconhecido";
}; 