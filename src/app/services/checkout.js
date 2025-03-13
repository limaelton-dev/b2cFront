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
        const response = await axios.post(`${API_URL}/checkout/validacpf`, data, {headers: headerValidate});
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
        const response = await axios.post(`${API_URL}/checkout/validaEmail`, data, {headers: headerValidate});
        return response;
    }
    catch (err) {
        console.error('Erro:', err);
        return err;
    }
}
