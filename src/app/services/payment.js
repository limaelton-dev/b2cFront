'use strict';
import axios from 'axios';
import { getToken } from '../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const MERCADO_PAGO = process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN;

const headerValidate = {
    Authorization: `Bearer ${getToken()}`,
};

const headerProcess = {
    Authorization: `Bearer ${getToken()}`,
};

export const validatePayment = async (dados) => {
    console.log(headerValidate)
    try {
        const response = await axios.post(`${API_URL}/checkout/validate`, dados, {headers: headerValidate});
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};

export const processPayment = async (dados, token) => {
    const header = {
        Authorization: `Bearer ${token}`
    }
    try {
        const response = await axios.post(`${API_URL}/mercado-pago/process-payment`, dados, {headers: header});
        console.log(response)
        return response.data;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
};
