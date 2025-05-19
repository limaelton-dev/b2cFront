'use strict';
import axios from 'axios';
import { getToken, getAuthHeader } from '../utils/auth';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Função auxiliar para configurar os headers com o token
const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Função para obter o perfil do usuário usando a mesma convenção do minhaconta
export const getProfileUser = async (profileId) => {
    try {
        // Obter dados do perfil
        const profileResponse = await axios.get(`${API_URL}/profile`, getAuthConfig());
        
        // Obter endereços separadamente
        const addressResponse = await axios.get(`${API_URL}/address`, getAuthConfig());
        
        // Obter telefones separadamente
        const phoneResponse = await axios.get(`${API_URL}/phone`, getAuthConfig());
        
        // Obter cartões separadamente
        const cardResponse = await axios.get(`${API_URL}/card`, getAuthConfig());
        
        // Combinar os dados para retornar no formato esperado pelo checkout
        const profileData = {
            id: profileResponse.data.id,
            email: profileResponse.data.email,
            profile: profileResponse.data.profile,
            profileType: profileResponse.data.profileType,
            // Usar os dados obtidos das chamadas separadas
            address: addressResponse.data || [],
            card: cardResponse.data || [],
            phone: phoneResponse.data || []
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
        const response = await axios.get(`${API_URL}/address`, getAuthConfig());
        return response.data || [];
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
        const response = await axios.get(`${API_URL}/profile`, getAuthConfig());
        
        // Formatar os dados para manter compatibilidade com o código existente
        return {
            id: response.data.id,
            email: response.data.email,
            profile: response.data.profile || {},
            profileType: response.data.profileType || 'PF'
        };
    }
    catch (err) {
        console.error('Erro ao obter dados pessoais:', err);
        return null;
    }
};
