import { register } from '@/api/auth';
import type { RegisterRequestPF } from '@/api/auth';
import { splitFullName, cleanPhoneNumber } from '@/utils/formatters';
import { getToken, saveToken } from '@/utils/auth';

interface GuestCustomer {
    fullName: string;
    email: string;
    password: string;
    cpf: string;
}

export async function createGuestAccount(customer: GuestCustomer) {
    const { firstName, lastName } = splitFullName(customer.fullName);
    
    const userData: RegisterRequestPF = {
        email: customer.email,
        password: customer.password,
        profileType: 'PF',
        profile: {
            firstName,
            lastName,
            cpf: cleanPhoneNumber(customer.cpf),
            birthDate: new Date().toISOString().split('T')[0]
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

