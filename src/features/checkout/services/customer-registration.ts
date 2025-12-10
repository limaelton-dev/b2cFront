import { register } from '@/api/auth/services/auth-service';
import { ProfileType } from '@/api/auth/types/AuthUser';
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
    
    const userData = {
        profileType: ProfileType.PF,
        firstName,
        lastName,
        email: customer.email,
        password: customer.password,
        cpf: cleanPhoneNumber(customer.cpf)
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

