'use strict';
import axios from 'axios';
import { jwtVerify } from 'jose';
import { getToken, saveToken, removeToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

const isBrowser = () => typeof window !== 'undefined';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, { email, password });
        
        if (response.data && response.data.token) {
            saveToken(response.data.token);
        }
        
        return response.data;
    }
    catch (err) {
        console.error('Erro ao fazer login:', err);
        return err;
    }
};

export const logout = () => {
    removeToken();
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/register`, userData);
        return response.data;
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        return err;
    }
};

export async function checkAuth() {
    const token = getToken();
    
    try {
        if (!token) {
            return false;
        }
        
        // Verificar se o token tem formato válido antes de tentar verificá-lo
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            removeToken();
            if (isBrowser()) {
                localStorage.removeItem('user');
            }
            return false;
        }
        
        try {
            if (typeof window !== 'undefined' && 
                (typeof CryptoKey === 'undefined' || typeof window.crypto?.subtle === 'undefined')) {
                
                try {
                    // Decodificar a parte de payload do token (segunda parte)
                    const payload = JSON.parse(atob(tokenParts[1]));
                    
                    // Verificar se o token está expirado
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        removeToken();
                        if (isBrowser()) {
                            localStorage.removeItem('user');
                        }
                        return false;
                    }
                    
                    return true;
                } catch (decodeError) {
                    removeToken();
                    if (isBrowser()) {
                        localStorage.removeItem('user');
                    }
                    return false;
                }
            }
            
            // Se a API CryptoKey estiver disponível, continua com a verificação completa
            const secret = new TextEncoder().encode(JWT_SECRET);
            
            const { payload } = await jwtVerify(token, secret);
            
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                removeToken();
                if (isBrowser()) {
                    localStorage.removeItem('user');
                }
                return false;
            }
            
            return true;
        } catch (jwtError) {
            removeToken();
            if (isBrowser()) {
                localStorage.removeItem('user');
            }
            return false;
        }
    } catch (error) {
        removeToken();
        if (isBrowser()) {
            localStorage.removeItem('user');
        }
        return false;
    }
}
