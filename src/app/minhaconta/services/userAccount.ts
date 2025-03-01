import axios from 'axios';
import Cookies from 'js-cookie';
import { DadosPessoaisType } from '../types';

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
    // Obter todos os dados da conta para ter acesso completo às informações
    const accountResponse = await axios.get(`${API_URL}/my-account`, getAuthConfig());
    const accountData = accountResponse.data;
    
    // Extrair dados pessoais
    const personalData = accountData.personalData || {};
    
    // Extrair telefones
    const phones = accountData.phones || [];
    
    // Obter dados do usuário através do endpoint de perfil
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, getAuthConfig());
    const userData = profileResponse.data || {};
    
    // Formatando os dados conforme a interface DadosPessoaisType
    return {
      nome: personalData.profile_type === 'PF' 
        ? personalData.full_name 
        : personalData.company_name || '',
      cpf: personalData.profile_type === 'PF' 
        ? personalData.cpf 
        : personalData.cnpj || '',
      email: userData.email || '',
      username: userData.username || '',
      dob: personalData.profile_type === 'PF' 
        ? formatDate(personalData.birth_date) 
        : '',
      phone: phones.length > 0 ? phones[0].number : '',
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
    const apiFieldMap: Record<keyof DadosPessoaisType, string> = {
      nome: personalData.profile_type === 'PF' ? 'full_name' : 'company_name',
      cpf: personalData.profile_type === 'PF' ? 'cpf' : 'cnpj',
      email: 'email',
      username: 'username',
      dob: 'birth_date',
      phone: 'phone',
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