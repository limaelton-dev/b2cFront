/**
 * Funções utilitárias para manipulação de endereços
 */
import axios from 'axios';

/**
 * Interface para representar um endereço
 */
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

/**
 * Busca endereço pelo CEP usando a API do ViaCEP
 * @param cep CEP a ser consultado (formato: 12345-678)
 * @returns Promise com os dados do endereço
 */
export const fetchAddressByCEP = async (cep: string): Promise<Partial<Address> | null> => {
    if (cep.length !== 9) {
        throw new Error('CEP inválido');
    }

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return {
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            postal_code: cep
        };
    } catch (error) {
        console.error('Erro ao buscar o endereço:', error);
        throw error;
    }
};

/**
 * Formata um endereço completo como string
 * @param address Objeto de endereço
 * @returns String formatada do endereço completo
 */
export const formatFullAddress = (address: Partial<Address>): string => {
    if (!address) return '';
    
    const { street, number, complement, neighborhood, city, state, postal_code } = address;
    
    return `${street || ''}, ${number || ''}${complement ? ', ' + complement : ''}, ${neighborhood || ''}, ${city || ''} - ${state || ''}, ${postal_code || ''}`;
};

/**
 * Limpa um CEP, removendo caracteres não numéricos
 * @param cep CEP a ser formatado
 * @returns CEP apenas com números
 */
export const cleanPostalCode = (cep: string): string => {
    return cep.replace(/\D/g, '');
}; 