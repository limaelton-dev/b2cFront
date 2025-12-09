import axios from 'axios';

export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    is_default?: boolean;
    profile_id?: number;
}

export const fetchAddressByCEP = async (cep: string): Promise<Partial<Address> | null> => {
    if (cep.length !== 9) throw new Error('CEP inválido');

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const data = response.data;

    if (data.erro) throw new Error('CEP não encontrado');

    return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        postal_code: cep
    };
};

export const formatFullAddress = (address: Partial<Address>): string => {
    if (!address) return '';
    
    const { street, number, complement, neighborhood, city, state, postal_code } = address;
    const parts = [
        street,
        number,
        complement,
        neighborhood,
        city && state ? `${city} - ${state}` : city || state,
        postal_code
    ].filter(Boolean);
    
    return parts.join(', ');
};

export const cleanPostalCode = (cep: string): string => cep.replace(/\D/g, '');
