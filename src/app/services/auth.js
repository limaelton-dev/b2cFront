'use strict';
import axios from 'axios';
import { jwtVerify } from 'jose';
import { getToken, saveToken, removeToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, { email, password });
        
        // Se o login for bem-sucedido, salva o token JWT
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
    // Remove o token JWT
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
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        removeToken();
        localStorage.removeItem('user');
        return false;
    }
}
