import { register } from '@/api/auth';
import type { RegisterRequestPF } from '@/api/auth';
import { cleanPhoneNumber } from '@/utils/formatters';
import { getToken, saveToken } from '@/utils/auth';

interface GuestCustomer {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cpf: string;
    birthDate?: string;  // Formato DD/MM/AAAA
}

/**
 * Converte data de DD/MM/AAAA para AAAA-MM-DD (ISO)
 */
function convertBirthDateToISO(dateStr?: string): string {
    if (!dateStr || dateStr.length !== 10) {
        // Fallback: data padrão se não informada (não ideal, mas melhor que data atual)
        return '1990-01-01';
    }
    
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}

export async function createGuestAccount(customer: GuestCustomer) {
    const userData: RegisterRequestPF = {
        email: customer.email,
        password: customer.password,
        profileType: 'PF',
        profile: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            cpf: cleanPhoneNumber(customer.cpf),
            birthDate: convertBirthDateToISO(customer.birthDate)
        }
    };
    
    const response = await register(userData);
    
    if (!response?.id) {
        throw new Error('Falha ao criar conta');
    }
    
    const token = getToken();
    if (token) {
        saveToken(token, { maxAge: 60 * 60 * 24 * 7 });
    }
    
    return response;
}

