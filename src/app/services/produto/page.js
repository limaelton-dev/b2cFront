'use strict';
import axios from 'axios';
import { getAuthHeader, isAuthenticated } from '../../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getProduto = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/produtos/${id}`);
        return response;
    }
    catch (err) {
        console.error('Erro ao obter produto:', err);
        return err;
    }
};

export const getProdsArr = async (arr) => {
    if (!arr || arr.length === 0) {
        return { data: [] };
    }
    
    try {
        const response = await axios.get(`${API_URL}/produtos/${arr.join(',')}`);
        return response;
    }
    catch (err) {
        console.error('Erro ao obter produtos:', err);
        return err;
    }
};

export const getProdsLimit = async (limit, category = '') => {
    try {
        const response = await axios.get(`${API_URL}/produtos?limit=${limit}${category? '&categoria='+category : ''}`);
        return response;
    }
    catch (err) {
        console.error('Erro ao obter produtos com limite:', err);
        return err;
    }
};

export const getProdutosCategoria = async (limit) => {
    try {
        const response = await axios.get(`${API_URL}/produtotipo?limit=${limit}`);
        return response;
    }
    catch (err) {
        console.error('Erro ao obter categorias de produtos:', err);
        return err;
    }
};

export const getCart = async () => {
    // Se o usuário não estiver autenticado, retornamos um objeto vazio
    // para que o frontend possa usar o carrinho local
    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, retornando carrinho vazio');
        return { data: { cart_data: [] } };
    }

    try {
        const response = await axios.get(`${API_URL}/cart`, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao obter carrinho:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto vazio
        // para que o frontend possa usar o carrinho local
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, retornando carrinho vazio');
            return { data: { cart_data: [] } };
        }
        return err;
    }
};

export const cartUpdate = async (data) => {
    // Se o usuário não estiver autenticado, não enviamos a atualização para o servidor
    // e retornamos um objeto simulando sucesso para que o frontend continue funcionando
    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: { cart_data: data } };
    }

    try {
        const response = await axios.patch(`${API_URL}/cart`, { cart_data: data }, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao atualizar carrinho:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto simulando sucesso
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, simulando sucesso');
            return { status: 200, data: { cart_data: data } };
        }
        return err;
    }
};

