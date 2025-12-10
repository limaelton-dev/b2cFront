import axios from 'axios';

export interface Address {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
}

export async function fetchAddressByPostalCode(cep: string): Promise<Address> {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
        throw new Error('CEP inválido');
    }
    
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    
    if (response.data.erro) {
        throw new Error('CEP não encontrado');
    }
    
    return {
        street: response.data.logradouro || '',
        neighborhood: response.data.bairro || '',
        city: response.data.localidade || '',
        state: response.data.uf || ''
    };
}

