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
                const userDataToStore = {
                    id: userData.id,
                    email: userData.email,
                    profileId: userData.profileId,
                    profileType: userData.profileType,
                    name: userData.profileType === 'PF' 
                        ? (userData.profile?.firstName && userData.profile?.lastName)
                            ? `${userData.profile.firstName} ${userData.profile.lastName}`
                            : userData.profile?.fullName || ''
                        : userData.profile?.companyName || '',
                    profile: userData.profile
                };
                
                localStorage.setItem('user', JSON.stringify(userDataToStore));
            }
        }
        
        return response.data;
    }
    catch (err) {
        console.error('Erro ao fazer login:', err);
        throw err;
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
            profileType: userData.profileType || 'PF',
            profile: {}
        };
        
        if (userData.profileType === 'PJ') {
            requestData.profile = {
                companyName: userData.companyName || '',
                cnpj: userData.cnpj || '',
                tradingName: userData.tradingName || '',
                stateRegistration: userData.stateRegistration || '',
                municipalRegistration: userData.municipalRegistration || ''
            };
        } else {
            // Caso seja PF
            // Garantir que o CPF esteja presente em todas as condições
            const cpf = userData.cpf || '';
            
            if (userData.firstName && userData.lastName) {
                // Se já tiver firstName e lastName separados
                requestData.profile = {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    cpf: cpf,
                    birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
                    gender: userData.gender || null
                };
            } else if (userData.fullName) {
                // Se tiver fullName, dividir em firstName e lastName
                const fullNameParts = userData.fullName.trim().split(' ');
                const firstName = fullNameParts[0] || '';
                const lastName = fullNameParts.slice(1).join(' ') || '';
                
                requestData.profile = {
                    firstName: firstName,
                    lastName: lastName,
                    cpf: cpf,
                    birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
                    gender: userData.gender || null
                };
            } else if (userData.name && userData.lastname) {
                // Suporte para o formato vindo do checkout
                requestData.profile = {
                    firstName: userData.name,
                    lastName: userData.lastname,
                    cpf: cpf,
                    birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
                    gender: userData.gender || null
                };
            } else {
                // Caso não tenha nenhuma informação de nome
                requestData.profile = {
                    firstName: "",
                    lastName: "",
                    cpf: cpf,
                    birthDate: userData.birthDate || new Date().toISOString().split('T')[0],
                    gender: userData.gender || null
                };
            }
        }
        
        console.log('Dados de registro enviados:', JSON.stringify(requestData));
        
        const response = await axios.post(`${API_URL}/auth/signup`, requestData);
        
        if (response.data && response.data.access_token) {
            saveToken(response.data.access_token);
        }
        
        return response.data;
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        throw err;
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
