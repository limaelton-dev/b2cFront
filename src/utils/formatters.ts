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
