'use strict';
import axios from 'axios';
import { getToken, getAuthHeader } from '../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Função para obter o perfil do usuário usando a nova API
export const getProfileUser = async () => {
    try {
        // Usar a nova API para obter todos os dados do perfil
        const response = await axios.get(`${API_URL}/user/profile/details`, { headers: getAuthHeader() });
        
        // Formatar os dados para manter compatibilidade com o código existente
        const profileData = {
            id: response.data.id,
            email: response.data.email,
            profile: response.data.profile,
            profileType: response.data.profileType,
            // Para manter compatibilidade com o código existente
            addresses: response.data.address || [],
            cards: response.data.card || [],
            phones: response.data.phone || []
        };
        
        return profileData;
    }
    catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
        return null;
    }
};

export const getAddressUser = async () => {
    try {
        // Usar a nova API para obter os endereços
        const response = await axios.get(`${API_URL}/user/profile/details`, { headers: getAuthHeader() });
        return response.data.address || [];
    }
    catch (err) {
        console.error('Erro ao obter endereços do usuário:', err);
        return [];
    }
}

// Função para obter apenas os dados pessoais do usuário
export const getUserPersonalData = async () => {
    try {
        // Usar a nova API para obter os dados pessoais
        const response = await axios.get(`${API_URL}/user/profile/details`, { headers: getAuthHeader() });
        
        // Formatar os dados para manter compatibilidade com o código existente
        return {
            id: response.data.id,
            email: response.data.email,
            profile: response.data.profile,
            profileType: response.data.profileType
        };
    }
    catch (err) {
        console.error('Erro ao obter dados pessoais:', err);
        return null;
    }
};
