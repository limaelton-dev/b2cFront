'use strict';
import axios from 'axios';
import { getToken } from '../../../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const headerValidate = {
    Authorization: `Bearer ${getToken()}`
};

export const cpfValidation = async (cpf) => {
    const data = {
        cpf: cpf
    }
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        const response = await axios.post(`${API_URL}/checkout/validacpf`, data, { headers });
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};

export const emailVerify = async (email) => {
    const data = {
        email: email
    }
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        const response = await axios.post(`${API_URL}/checkout/validaEmail`, data, { headers });
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
}

export const registerWithoutPass = async (dados) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        const response = await axios.post(`${API_URL}/user/registerWithoutPass`, dados, { headers });
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
}

export const addAddress = async (addressData) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        // Formatar os dados para a nova API
        const formattedData = {
            street: addressData.street,
            number: addressData.number,
            complement: addressData.complement,
            neighborhood: addressData.neighborhood,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode || addressData.postal_code,
            isDefault: addressData.isDefault || addressData.is_default || true
        };
        
        const response = await axios.post(`${API_URL}/address`, formattedData, { headers });
        return response.data;
    }
    catch (err) {
        console.error('Erro ao adicionar endereço:', err);
        return err;
    }
}

export const addCard = async (cardData) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        
        // Formatar os dados para a nova API
        const formattedData = {
            cardNumber: cardData.card_number ? cardData.card_number.replace(/\s+/g, '') : cardData.cardNumber,
            holderName: cardData.holder_name || cardData.holderName,
            expirationDate: cardData.expiration_date || cardData.expirationDate,
            brand: cardData.card_type || cardData.brand,
            cvv: cardData.cvv,
            isDefault: cardData.is_default || cardData.isDefault || true
        };
        
        const response = await axios.post(`${API_URL}/card`, formattedData, { headers });
        return response.data;
    }
    catch (err) {
        console.error('Erro ao adicionar cartão:', err);
        return err;
    }
}

export const addPhone = async (phoneData) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`
        };
        
        let ddd, number;
        
        // Verificar o formato dos dados de entrada
        if (typeof phoneData === 'string') {
            // Se for uma string, é o número completo
            if (phoneData.length >= 2) {
                ddd = phoneData.substring(0, 2);
                number = phoneData.substring(2);
            } else {
                throw new Error('Formato de telefone inválido');
            }
        } else if (phoneData.phone) {
            // Formato antigo com campo 'phone'
            const cleanNumber = phoneData.phone.replace(/\D/g, '');
            if (cleanNumber.length >= 2) {
                ddd = cleanNumber.substring(0, 2);
                number = cleanNumber.substring(2);
            } else {
                throw new Error('Formato de telefone inválido');
            }
        } else if (phoneData.ddd && phoneData.number) {
            // Já está no formato correto
            ddd = phoneData.ddd;
            number = phoneData.number;
        } else {
            throw new Error('Dados de telefone inválidos');
        }
        
        // Formatar para a nova API
        const formattedData = {
            ddd,
            number,
            isDefault: phoneData.isDefault || phoneData.is_primary || true
        };
        
        const response = await axios.post(`${API_URL}/phone`, formattedData, { headers });
        return response.data;
    }
    catch (err) {
        console.error('Erro ao adicionar telefone:', err);
        throw err; // Lançar o erro para ser tratado pelo chamador
    }
}

export const valorFrete = async (cep) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        };
        
        // Obter o CEP limpo sem traços
        const cleanZipCode = cep.replace(/\D/g, '');
        
        // Rota correta para usuários autenticados
        const response = await axios.get(
            `${API_URL}/cart/shipping?zipCode=${cleanZipCode}&shippingType=ALL`,
            { headers }
        );
        
        console.log('Resposta do cálculo de frete (autenticado):', response.data);
        return response;
    }
    catch (err) {
        console.error('Erro ao calcular frete (autenticado):', err);
        return err;
    }
}

export const valorFreteDeslogado = async (cep, dados) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // CEP de origem padrão
        const originZipCode = "85010100";
        
        // Obter o CEP limpo sem traços
        const cleanZipCode = cep.replace(/\D/g, '');
        
        // Formatando os produtos para o formato correto da API
        const products = Array.isArray(dados) 
            ? dados.map(item => ({
                productId: Number(item.id || item.produto_id),
                quantity: Number(item.qty || item.quantity || 1)
              }))
            : dados.map(item => ({
                productId: Number(item.produto_id),
                quantity: Number(item.quantity || 1)
              }));
        
        // Corpo da requisição para usuários não autenticados
        const requestBody = {
            originZipCode,
            destinationZipCode: cleanZipCode,
            products,
            shippingType: "ALL"
        };
        
        // Usar POST para a rota correta de usuários não autenticados
        const response = await axios.post(
            `${API_URL}/shipping/calculate-by-ids`,
            requestBody,
            { headers }
        );
        
        console.log('Resposta do cálculo de frete (não autenticado):', response.data);
        return response;
    }
    catch (err) {
        console.error('Erro ao calcular frete (não autenticado):', err);
        return err;
    }
}