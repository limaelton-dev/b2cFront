export function cleanPhoneNumber(value: string): string {
    return value.replace(/\D/g, '');
}

export function formatPhoneNumber(num: string): string {
    const cleanNum = cleanPhoneNumber(num);
    if (cleanNum.length === 11) {
        return `(${cleanNum.slice(0, 2)}) ${cleanNum.slice(2, 7)}-${cleanNum.slice(7)}`;
    }
    if (cleanNum.length === 10) {
        return `(${cleanNum.slice(0, 2)}) ${cleanNum.slice(2, 6)}-${cleanNum.slice(6)}`;
    }
    return num;
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
    const trimmedName = fullName.trim();
    const parts = trimmedName.split(' ');
    
    return {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || ''
    };
}

export function formatDateBR(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export function detectCardBrand(cardNumber: string): string {
    const n = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(n)) return 'visa';
    if (/^(5[1-5]|50[0-9][0-9]|5031)/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n)) return 'amex';
    if (/^(6011|65|64[4-9]|622)/.test(n)) return 'discover';
    if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|636369)/.test(n)) return 'elo';
    if (/^(384100|384140|384160|606282|637095|637568)/.test(n)) return 'hipercard';
    if (/^(5018|5020|5038|6304|6759|6761|6762|6763)/.test(n)) return 'maestro';
    
    return 'unknown';
}