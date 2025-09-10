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
        console.log('Iniciando getProfileUser...');
        // Usar a rota correta para obter dados do usuário
        const response = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
        console.log('Dados de profile recebidos:', response.data);
        
        try {
            // Para dados adicionais específicos, fazemos chamadas separadas
            // Obter endereços
            console.log('Buscando endereços...');
            const addressResponse = await axios.get(`${API_URL}/address`, getAuthConfig());
            console.log('Endereços recebidos:', addressResponse.data);
            
            // Obter telefones
            console.log('Buscando telefones...');
            const phoneResponse = await axios.get(`${API_URL}/phone`, getAuthConfig());
            console.log('Telefones recebidos:', phoneResponse.data);
            
            // Obter cartões
            console.log('Buscando cartões...');
            const cardResponse = await axios.get(`${API_URL}/card`, getAuthConfig());
            console.log('Cartões recebidos:', cardResponse.data);
            
            // Combinar os dados para retornar no formato esperado pelo checkout
            const profileData = {
                id: response.data.id,
                email: response.data.email,
                profile: response.data.profile,
                profileType: response.data.profileType,
                // Dados específicos dos endpoints individuais
                address: addressResponse.data || [],
                card: cardResponse.data || [],
                phone: phoneResponse.data || []
            };
            
            console.log('Dados completos montados:', profileData);
            return profileData;
        } catch (innerErr) {
            console.error('Erro ao obter dados adicionais:', innerErr);
            // Se falhar ao buscar dados adicionais, retorna ao menos os dados básicos do perfil
            return {
                id: response.data.id,
                email: response.data.email,
                profile: response.data.profile,
                profileType: response.data.profileType,
                address: [],
                card: [],
                phone: []
            };
        }
    }
    catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
        return null;
    }
};

export const getAddressUser = async () => {
    try {
        // Usar a API de endereços diretamente
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
        // Usar a rota correta para obter dados do usuário
        const response = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
        
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
