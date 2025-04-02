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
        // Certifique-se de que estamos enviando apenas IDs válidos
        const validIds = arr.filter(id => id !== undefined && id !== null);
        
        if (validIds.length === 0) {
            return { data: [] };
        }
        
        console.log('Buscando produtos com IDs:', validIds.join(','));
        const response = await axios.get(`${API_URL}/produtos/${validIds.join(',')}`);
        
        // Verificar se a resposta contém dados válidos
        if (response && response.data) {
            console.log('Produtos recuperados:', response.data.length || 0);
            
            // Se a resposta não for um array, converta para um array
            const products = Array.isArray(response.data) ? response.data : [response.data];
            
            // Processar cada produto para adicionar a URL da imagem como pro_imagem
            const processedProducts = products.map(product => {
                if (product.imagens && product.imagens.length > 0) {
                    return {
                        ...product,
                        pro_imagem: product.imagens[0].url
                    };
                }
                return product;
            });
            
            return { data: processedProducts };
        }
        
        return { data: [] };
    }
    catch (err) {
        console.error('Erro ao obter produtos:', err);
        return { data: [] };
    }
};

export const getProdsLimit = async (limit = 12, category = '', fabricante = '', page = 1, timestamp = null) => {
    try {
        const url = `${API_URL}/produtos?limit=${limit}&page=${page}${category? '&categoria='+category : ''}${fabricante? '&fabricante='+fabricante : ''}${timestamp ? '&_t='+timestamp : ''}`;
        
        const response = await axios.get(url);
        
        // Se a resposta for um array, formatamos para o formato esperado
        if (Array.isArray(response.data)) {
            const formattedResponse = {
                data: {
                    items: response.data,
                    totalItems: response.data.length,
                    totalPages: 1,
                    currentPage: page
                }
            };
            return formattedResponse;
        }
        
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

export const getProdutosFabricante = async (limit) => {
    try {
        const response = await axios.get(`${API_URL}/produtofabricante?limit=${limit}`);
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
        const headers = getAuthHeader();
        console.log('Enviando requisição para obter carrinho com headers:', headers);
        
        const response = await axios.get(`${API_URL}/cart`, {
            headers: headers
        });
        
        console.log('Resposta da API de carrinho:', response.status);
        console.log('Dados do carrinho recebidos:', JSON.stringify(response.data));
        
        // Verificar se a resposta contém a estrutura esperada
        if (!response.data || !response.data.cart_data) {
            console.log('Resposta da API não contém a estrutura esperada de cart_data');
            return { data: { cart_data: [] } };
        }
        
        // Verificar se cart_data é um array
        if (!Array.isArray(response.data.cart_data)) {
            console.log('cart_data não é um array, convertendo para array vazio');
            response.data.cart_data = [];
        }
        
        return response;
    }
    catch (err) {
        console.error('Erro ao obter carrinho:', err);
        console.log('Detalhes do erro:', err.response ? {
            status: err.response.status,
            data: JSON.stringify(err.response.data)
        } : 'Sem resposta do servidor');
        
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto vazio
        // para que o frontend possa usar o carrinho local
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, retornando carrinho vazio');
            return { data: { cart_data: [] } };
        }
        return { data: { cart_data: [] } };
    }
};

export const cartUpdate = async (data) => {
    // Se o usuário não estiver autenticado, não enviamos a atualização para o servidor
    // e retornamos um objeto simulando sucesso para que o frontend continue funcionando
    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: data };
    }

    try {
        console.log('\n\n\nEnviando dados para o servidor:', JSON.stringify(data));
        const response = await axios.put(`${API_URL}/cart`, data, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao atualizar carrinho:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto simulando sucesso
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, simulando sucesso');
            return { status: 200, data: data };
        }
        return err;
    }
};

