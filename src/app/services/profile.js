'use strict';
import axios from 'axios';
import { getToken } from '../utils/auth';
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
export const getProfileUser = async () => {
    try {
        // Usar o endpoint do my-account para manter a mesma convenção
        const response = await axios.get(`${API_URL}/my-account/personal-data`, getAuthConfig());
        
        // Obter os endereços do usuário
        const addressesResponse = await axios.get(`${API_URL}/address`, getAuthConfig());
        
        // Obter os cartões do usuário
        const cardsResponse = await axios.get(`${API_URL}/my-account/cards`, getAuthConfig());
        
        // Combinar os dados para retornar no formato esperado pelo checkout
        const profileData = {
            ...response.data,
            addresses: addressesResponse.data || [],
            cards: cardsResponse.data || []
        };
        
        return profileData;
    }
    catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
        return null;
    }
};

// Função para obter apenas os dados pessoais do usuário
export const getUserPersonalData = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-account/personal-data`, getAuthConfig());
        return response.data;
    }
    catch (err) {
        console.error('Erro ao obter dados pessoais:', err);
        return null;
    }
};
