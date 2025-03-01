'use strict';
import axios from 'axios';
import Cookies from 'js-cookie';
import { checkAuth } from '../auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Função auxiliar para obter o token JWT
const getAuthHeader = () => {
    const token = Cookies.get('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Função auxiliar para verificar se o usuário está autenticado
const isAuthenticated = () => {
    const token = Cookies.get('jwt');
    return !!token; // Verificamos apenas se o token existe, a validação completa é feita pelo backend
};

export const getProduto = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/produtos/${id}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const getProdsArr = async (arr) => {
    try {
        const response = await axios.get(`${API_URL}/produtos/${arr.join(',')}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const getProdsLimit = async (limit, category = '') => {
    try {
        const response = await axios.get(`${API_URL}/produtos?limit=${limit}${category? '&categoria='+category : ''}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const getProdutosCategoria = async (limit) => {
    try {
        const response = await axios.get(`${API_URL}/produtotipo?limit=${limit}`);
        return response;
    }
    catch (err) {
        return err;
    }
};

export const getCart = async () => {
    try {
        // Se o usuário não estiver autenticado, retorna um objeto vazio
        // O carrinho será gerenciado localmente pelo contexto
        const token = Cookies.get('jwt');
        if (!token) {
            console.log('Usuário não autenticado (sem token), retornando carrinho local');
            const localCart = Cookies.get('cart');
            return { 
                data: { 
                    cart_data: localCart ? JSON.parse(localCart) : [] 
                } 
            };
        }
        
        // Verifica se o token é válido
        const isValid = await checkAuth();
        if (!isValid) {
            console.log('Token JWT inválido, retornando carrinho local');
            const localCart = Cookies.get('cart');
            return { 
                data: { 
                    cart_data: localCart ? JSON.parse(localCart) : [] 
                } 
            };
        }
        
        console.log('Usuário autenticado, buscando carrinho do backend');
        const response = await axios.get(`${API_URL}/carrinho`, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao obter carrinho:', err);
        // Em caso de erro, retorna o carrinho local como fallback
        const localCart = Cookies.get('cart');
        return { 
            data: { 
                cart_data: localCart ? JSON.parse(localCart) : [] 
            } 
        };
    }
};

export const cartUpdate = async (data) => {
    try {
        // Se o usuário não estiver autenticado, salva apenas localmente
        // e retorna um objeto simulando sucesso
        const token = Cookies.get('jwt');
        if (!token) {
            console.log('Usuário não autenticado (sem token), salvando carrinho localmente');
            Cookies.set('cart', JSON.stringify(data), { expires: 7 });
            return { 
                status: 200, 
                data: { 
                    success: true, 
                    message: 'Carrinho atualizado localmente' 
                } 
            };
        }
        
        // Verifica se o token é válido
        const isValid = await checkAuth();
        if (!isValid) {
            console.log('Token JWT inválido, salvando carrinho localmente');
            Cookies.set('cart', JSON.stringify(data), { expires: 7 });
            return { 
                status: 200, 
                data: { 
                    success: true, 
                    message: 'Carrinho atualizado localmente' 
                } 
            };
        }
        
        console.log('Usuário autenticado, atualizando carrinho no backend');
        const response = await axios.patch(`${API_URL}/carrinho`, { cart_data: data }, {
            headers: getAuthHeader()
        });
        return response;
    }
    catch (err) {
        console.error('Erro ao atualizar carrinho:', err);
        // Em caso de erro, salva localmente como fallback
        Cookies.set('cart', JSON.stringify(data), { expires: 7 });
        return { 
            status: 200, 
            data: { 
                success: true, 
                message: 'Carrinho atualizado localmente devido a erro no backend' 
            } 
        };
    }
};

// Sincroniza o carrinho local com o backend após o login
export const syncCartAfterLogin = async () => {
    try {
        // Verifica se o usuário está autenticado
        const token = Cookies.get('jwt');
        if (!token) {
            console.log('Usuário não está autenticado (sem token), não é possível sincronizar o carrinho');
            return { success: false, message: 'Usuário não autenticado' };
        }
        
        // Verifica se o token é válido
        const isValid = await checkAuth();
        if (!isValid) {
            console.log('Token JWT inválido, não é possível sincronizar o carrinho');
            return { success: false, message: 'Token JWT inválido' };
        }

        // Obtém o carrinho local dos cookies
        const localCartCookie = Cookies.get('cart');
        if (!localCartCookie) {
            console.log('Nenhum carrinho local encontrado para sincronizar');
            return { success: true, message: 'Nenhum carrinho local para sincronizar' };
        }

        // Converte o carrinho local de string para objeto
        let localCart;
        try {
            localCart = JSON.parse(localCartCookie);
        } catch (error) {
            console.error('Erro ao analisar o carrinho local:', error);
            return { success: false, message: 'Erro ao analisar o carrinho local' };
        }
        
        if (!Array.isArray(localCart) || localCart.length === 0) {
            console.log('Carrinho local vazio, nada para sincronizar');
            return { success: true, message: 'Carrinho local vazio' };
        }

        // Envia o carrinho local para o backend
        console.log('Enviando carrinho local para o backend...');
        const response = await cartUpdate(localCart);
        
        if (response && response.status === 200) {
            console.log('Carrinho sincronizado com sucesso após login');
            return { success: true, message: 'Carrinho sincronizado com sucesso' };
        } else {
            console.error('Erro ao sincronizar carrinho com o backend:', response);
            return { success: false, message: 'Erro ao sincronizar com o backend' };
        }
    } catch (error) {
        console.error('Erro ao sincronizar carrinho após login:', error);
        return { success: false, message: error.message || 'Erro desconhecido' };
    }
};

