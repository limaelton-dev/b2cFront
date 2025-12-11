export interface CepAddress {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
        throw new Error('CEP inválido');
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
        throw new Error('CEP não encontrado');
    }
    
    return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
    };
}
