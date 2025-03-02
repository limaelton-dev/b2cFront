import axios from 'axios';
import Cookies from 'js-cookie';
import { DadosPessoaisType, EnderecoType, CartaoType } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Função para obter o token JWT dos cookies
const getAuthToken = () => {
  return Cookies.get('jwt');
};

// Configuração do axios com o token de autenticação
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Função para obter os dados pessoais do usuário
export const getUserPersonalData = async (): Promise<DadosPessoaisType> => {
  try {
    // Obter dados pessoais do endpoint específico
    const response = await axios.get(`${API_URL}/my-account/personal-data`, getAuthConfig());
    const personalData = response.data;
    
    // Obter dados do usuário através do endpoint de perfil para email e username
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, getAuthConfig());
    const userData = profileResponse.data || {};
    
    // Encontrar o telefone principal
    const primaryPhone = personalData.phones && personalData.phones.length > 0
      ? personalData.phones.find((phone: any) => phone.is_primary) || personalData.phones[0]
      : null;
    
    // Formatando os dados conforme a interface DadosPessoaisType
    return {
      full_name: personalData.full_name || '',
      cpf: personalData.cpf || '',
      email: userData.email || '',
      username: userData.username || '',
      birth_date: personalData.birth_date ? formatDate(personalData.birth_date) : '',
      phone: primaryPhone ? primaryPhone.number : '',
      gender: personalData.gender,
      profile_type: personalData.profile_type || 'PF',
    };
  } catch (error) {
    console.error('Erro ao buscar dados pessoais:', error);
    throw error;
  }
};

// Função para atualizar os dados pessoais do usuário
export const updateUserPersonalData = async (field: keyof DadosPessoaisType, value: string): Promise<void> => {
  try {
    // Obter dados atuais para determinar o tipo de perfil
    const personalDataResponse = await axios.get(`${API_URL}/my-account/personal-data`, getAuthConfig());
    const personalData = personalDataResponse.data;
    
    // Mapear o campo do frontend para o campo correspondente na API
    const apiFieldMap: Record<string, string> = {
      full_name: 'full_name',
      cpf: 'cpf',
      email: 'email',
      username: 'username',
      birth_date: 'birth_date',
      phone: 'phone',
      gender: 'gender',
      profile_type: 'profile_type'
    };
    
    const apiField = apiFieldMap[field];
    
    // Preparar os dados para atualização
    const updateData: Record<string, string> = {
      [apiField]: value,
    };
    
    // Determinar o endpoint correto com base no campo
    let endpoint = '';
    if (field === 'email' || field === 'username') {
      endpoint = `${API_URL}/user/update`;
    } else if (field === 'phone') {
      endpoint = `${API_URL}/my-account/phones`;
    } else {
      endpoint = `${API_URL}/my-account/personal-data`;
    }
    
    // Enviar a atualização
    await axios.put(endpoint, updateData, getAuthConfig());
  } catch (error) {
    console.error(`Erro ao atualizar ${field}:`, error);
    throw error;
  }
};

// Função para formatar a data no padrão brasileiro
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para obter todos os dados da conta do usuário
export const getUserAccountData = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-account`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da conta:', error);
    throw error;
  }
};

// Função para obter os endereços do usuário
export const getUserAddresses = async (): Promise<EnderecoType[]> => {
  try {
    const response = await axios.get(`${API_URL}/address`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    throw error;
  }
};

// Função para definir um endereço como padrão
export const setAddressAsDefault = async (addressId: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/address/${addressId}/default`, {}, getAuthConfig());
  } catch (error) {
    console.error('Erro ao definir endereço como padrão:', error);
    throw error;
  }
};

// Função para excluir um endereço
export const deleteAddress = async (addressId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/address/${addressId}`, getAuthConfig());
  } catch (error) {
    console.error('Erro ao excluir endereço:', error);
    throw error;
  }
};

// Função para obter os cartões do usuário
export const getUserCards = async (): Promise<CartaoType[]> => {
  try {
    const response = await axios.get(`${API_URL}/my-account/cards`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    throw error;
  }
};

// Função para definir um cartão como padrão
export const setCardAsDefault = async (cardId: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/my-account/cards/${cardId}/default`, {}, getAuthConfig());
  } catch (error) {
    console.error('Erro ao definir cartão como padrão:', error);
    throw error;
  }
};

// Função para excluir um cartão
export const deleteCard = async (cardId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/my-account/cards/${cardId}`, getAuthConfig());
  } catch (error) {
    console.error('Erro ao excluir cartão:', error);
    throw error;
  }
}; 