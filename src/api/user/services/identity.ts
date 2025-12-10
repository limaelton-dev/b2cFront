import { validateCpf, validateEmail } from '../../checkout/services/checkout-service';

export async function checkIfCPFAlreadyRegistered(cpf: string): Promise<boolean> {
    try {
        const response = await validateCpf(cpf);
        return response?.status === 409;
    } catch {
        return false;
    }
}

export async function checkIfEmailAlreadyRegistered(email: string): Promise<boolean> {
    try {
        const response = await validateEmail(email);
        return response?.status === 409;
    } catch {
        return false;
    }
}

