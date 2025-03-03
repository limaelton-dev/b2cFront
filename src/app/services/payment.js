'use strict';
import axios from 'axios';
import { getToken } from '../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const MERCADO_PAGO = process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN;

// Função para validar o pagamento no backend
export const validatePayment = async (dados) => {
    const headerValidate = {
        Authorization: `Bearer ${getToken()}`
    };
    
    try {
        const response = await axios.post(`${API_URL}/checkout/validate`, dados, {headers: headerValidate});
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};

// Função para processar o pagamento no backend
export const processPayment = async (dados, token = null) => {
    const headerProcess = {
        Authorization: `Bearer ${token || getToken()}`
    };
    
    try {
        const response = await axios.post(`${API_URL}/mercado-pago/process-payment`, dados, {headers: headerProcess});
        console.log('Resposta do processamento de pagamento:', response);
        return response.data;
    }
    catch (err) {
        console.error('Erro ao processar pagamento:', err);
        return err;
    }
};
