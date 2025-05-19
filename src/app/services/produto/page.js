'use strict';
import axios from 'axios';
import { getAuthHeader, isAuthenticated } from '../../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getProduto = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/product/${id}`);
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
        const response = await axios.get(`${API_URL}/product/${validIds.join(',')}`);
        
        // Verificar se a resposta contém dados válidos
        if (response && response.data) {
            console.log('Produtos recuperados:', Array.isArray(response.data) ? response.data.length : 1);
            
            // Se a resposta não for um array, converta para um array
            const products = Array.isArray(response.data) ? response.data : [response.data];
            
            // Processar cada produto para adicionar a URL da imagem como pro_imagem e garantir IDs compatíveis
            const processedProducts = products.map(product => {
                const newProduct = { ...product };
                
                // Garantir que temos um ID consistente
                if (product.id && !product.pro_codigo) {
                    newProduct.pro_codigo = product.id;
                } else if (product.pro_codigo && !product.id) {
                    newProduct.id = product.pro_codigo;
                }
                
                // Processar imagens para compatibilidade
                if (product.images && product.images.length > 0) {
                    newProduct.pro_imagem = product.images[0].url;
                    if (!newProduct.imagens) {
                        newProduct.imagens = product.images;
                    }
                } else if (product.imagens && product.imagens.length > 0) {
                    newProduct.pro_imagem = product.imagens[0].url;
                    if (!newProduct.images) {
                        newProduct.images = product.imagens;
                    }
                }
                
                // Adicionar name se não existir
                if (product.pro_descricao && !product.name) {
                    newProduct.name = product.pro_descricao;
                } else if (product.name && !product.pro_descricao) {
                    newProduct.pro_descricao = product.name;
                }
                
                // Garantir consistência no preço
                if (product.price && !product.pro_precovenda) {
                    newProduct.pro_precovenda = Number(product.price);
                } else if (product.pro_precovenda && !product.price) {
                    newProduct.price = String(product.pro_precovenda);
                }
                
                return newProduct;
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
        const url = `${API_URL}/product?limit=${limit}&page=${page}${category? '&categoria='+category : ''}${fabricante? '&fabricante='+fabricante : ''}${timestamp ? '&_t='+timestamp : ''}`;
        
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
        const response = await axios.get(`${API_URL}/category/products?limit=${limit}`);
        return response;
    }
    catch (err) {
        console.error('Erro ao obter categorias de produtos:', err);
        return err;
    }
};

export const getProdutosFabricante = async () => {
    try {
        const response = await axios.get(`${API_URL}/category/menu`);
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
        if (!response.data || !response.data.items) {
            console.log('Resposta da API não contém a estrutura esperada de cart_data');
            return { data: { cart_data: [] } };
        }
        
        // Verificar se cart_data é um array
        if (!Array.isArray(response.data.items)) {
            console.log('cart_data não é um array, convertendo para array vazio');
            response.data.items = [];
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

export const addCartToServer = async (data) => {

    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: data };
    }

    try {
        console.log('\n\n\nEnviando dados para o servidor:', JSON.stringify(data));
        const response = await axios.post(`${API_URL}/cart/items/addLocal`, data, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao adicionar ao carrinho local:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto simulando sucesso
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, simulando sucesso');
            return { status: 200, data: data };
        }
        return err;
    }
};

export const addToCartServer = async (data,productId) => {

    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: data };
    }

    try {
        console.log('\n\n\nEnviando dados para o servidor:', JSON.stringify(data));
        const response = await axios.post(`${API_URL}/cart/items/product/${productId}`, data, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao adicionar ao carrinho:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto simulando sucesso
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, simulando sucesso');
            return { status: 200, data: data };
        }
        return err;
    }
};

export const removeFromCartServer = async (productId) => {

    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: data };
    }

    try {
        console.log('\n\n\nEnviando dados para o servidor');
        const response = await axios.delete(`${API_URL}/cart/items/${productId}`, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao remover do carrinho:', err);
        // Em caso de erro de autenticação (401) ou não encontrado (404), retornamos um objeto simulando sucesso
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            console.log('Erro de autenticação ou carrinho não encontrado, simulando sucesso');
            return { status: 200, data: data };
        }
        return err;
    }
};

export const cartUpdate = async (data,productId) => {
    // Se o usuário não estiver autenticado, não enviamos a atualização para o servidor
    // e retornamos um objeto simulando sucesso para que o frontend continue funcionando
    if (!isAuthenticated()) {
        console.log('Usuário não autenticado, não enviando atualização do carrinho para o servidor');
        return { status: 200, data: data };
    }

    try {
        console.log('\n\n\nEnviando dados para o servidor:', JSON.stringify(data));
        const response = await axios.put(`${API_URL}/cart/items/product/${productId}`, data, {
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

