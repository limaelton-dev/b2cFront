'use strict';
import axios from 'axios';
import { getToken } from '../utils/auth';
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
        const response = await axios.post(`${API_URL}/my-account/add-address`, addressData, { headers });
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
        const response = await axios.post(`${API_URL}/my-account/add-card`, cardData, { headers });
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
        
        // Garantir que o objeto tenha o campo 'number' em vez de 'phone'
        const formattedData = {
            number: phoneData.phone ? phoneData.phone.replace(/\D/g, '') : '',
            profile_id: phoneData.profile_id,
            type: phoneData.type || 'celular',
            is_primary: phoneData.is_primary || true
        };
        
        const response = await axios.post(`${API_URL}/my-account/add-phone`, formattedData, { headers });
        return response.data;
    }
    catch (err) {
        console.error('Erro ao adicionar telefone:', err);
        throw err; // Lançar o erro para ser tratado pelo chamador
    }
}

export const valorFrete = async (cep, profileId) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        };
        
        // Obtendo os dados do carrinho do localStorage com a chave correta
        const cartDataStr = localStorage.getItem('cart');
        const cartData = cartDataStr ? JSON.parse(cartDataStr) : [];
        
        // Formatando os dados do carrinho para a API
        const cart_data = cartData.map(item => ({
            produto_id: item.id || item.produto_id,
            quantity: item.qty || item.quantity || 1
        }));
        
        const response = await axios.post(
            `${API_URL}/api/logistica/carrinho/frete?cepDestino=${cep.replace(/\D/g, '')}&profileId=${profileId}`,
            { cart_data },
            { headers }
        );
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
}

export const valorFreteDeslogado = async (cep, dados) => {
    try {
        const headers = {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        };
        
        // Se dados já estiver formatado corretamente, use-o. Caso contrário, construa o cart_data
        const cart_data = Array.isArray(dados) 
            ? dados.map(item => ({
                produto_id: item.id || item.produto_id,
                quantity: item.qty || item.quantity || 1
              }))
            : dados;
        
        const response = await axios.post(
            `${API_URL}/api/logistica/carrinho/frete?cepDestino=${cep.replace(/\D/g, '')}`,
            { cart_data },
            { headers }
        );
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
}