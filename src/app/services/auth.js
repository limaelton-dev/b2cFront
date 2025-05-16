'use strict';
import axios from 'axios';
import { jwtVerify } from 'jose';
import { getToken, saveToken, removeToken, getAuthHeader } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

const isBrowser = () => typeof window !== 'undefined';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
        
        if (response.data && response.data.access_token) {
            saveToken(response.data.access_token);
            
            const userData = response.data.user;
            
            if (isBrowser()) {
                localStorage.setItem('user', JSON.stringify({
                    id: userData.id,
                    email: userData.email,
                    profile_id: userData.profileId,
                    profile_type: userData.profileType
                }));
            }
        }
        
        return response;
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
        const requestData = {
            email: userData.email,
            password: userData.password,
            profileType: 'PF',
            profile: {
                fullName: `${userData.name} ${userData.lastname}`.trim(),
                cpf: userData.cpf || '',
                birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
                gender: userData.gender || null
            }
        };
        
        if (userData.profileType === 'PJ') {
            requestData.profileType = 'PJ';
            requestData.profile = {
                companyName: userData.companyName || '',
                cnpj: userData.cnpj || '',
                tradingName: userData.tradingName || '',
                stateRegistration: userData.stateRegistration || '',
                municipalRegistration: userData.municipalRegistration || ''
            };
        }
        
        const response = await axios.post(`${API_URL}/auth/signup`, requestData);
        
        if (response.data && response.data.access_token) {
            saveToken(response.data.access_token);
            
            if (isBrowser() && response.data.user) {
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.user.id,
                    email: response.data.user.email,
                    profile_id: response.data.user.profileId,
                    profile_type: response.data.user.profileType,
                    profile: response.data.user.profile
                }));
            }
        }
        
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
                    const payload = JSON.parse(atob(tokenParts[1]));
                    
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

export const getUserProfile = async () => {
    try {
        const headers = getAuthHeader();
        
        if (!headers.Authorization) {
            return null;
        }
        
        const response = await axios.get(`${API_URL}/user/profile/details`, { headers });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        return null;
    }
};
