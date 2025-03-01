'use strict';
import axios from 'axios';
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';
import { syncCartAfterLogin } from './produto/page';
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (email, password, repassword) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, { email, password });
        
        // Se o login for bem-sucedido e tivermos um token
        if (response.data && response.data.token) {
            // Armazena o token JWT nos cookies
            Cookies.set('jwt', response.data.token, { expires: 7 });
            
            // Não sincronizamos o carrinho aqui
            // A sincronização será feita pelo contexto do carrinho quando detectar o login
        }
        
        return response.data;
    }
    catch (err) {
        return err;
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/register`, userData);
        
        // Se o registro for bem-sucedido e tivermos um token
        if (response.data && response.data.token) {
            // Armazena o token JWT nos cookies
            Cookies.set('jwt', response.data.token, { expires: 7 });
            
            // Não sincronizamos o carrinho aqui
            // A sincronização será feita pelo contexto do carrinho quando detectar o login
        }
        
        return response.data;
    } catch (err) {
        return err;
    }
};

export async function checkAuth() {
    const token = Cookies.get('jwt');
    
    try {
        if (!token) {
            return false;
        }
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        return true;
    } catch (error) {
        return false;
    }
}

export const logout = () => {
    // Remove o token JWT dos cookies
    Cookies.remove('jwt');
    // Limpa o usuário do localStorage
    localStorage.removeItem('user');
    // Não limpa o carrinho local para manter os itens quando o usuário deslogar
};
