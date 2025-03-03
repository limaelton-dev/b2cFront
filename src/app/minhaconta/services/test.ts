// Este arquivo é apenas para testes e pode ser removido em produção
import { getUserPersonalData, getUserAccountData } from './userAccount';
import axios from 'axios';
import Cookies from 'js-cookie';

// Configuração do axios com o token de autenticação
const getAuthConfig = () => {
  const token = Cookies.get('jwt');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Função para testar a obtenção de dados pessoais
export const testGetUserPersonalData = async () => {
  try {
    console.log('Testando getUserPersonalData...');
    const data = await getUserPersonalData();
    console.log('Dados pessoais obtidos com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao obter dados pessoais:', error);
    throw error;
  }
};

// Função para testar a obtenção de todos os dados da conta
export const testGetUserAccountData = async () => {
  try {
    console.log('Testando getUserAccountData...');
    const data = await getUserAccountData();
    console.log('Dados da conta obtidos com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao obter dados da conta:', error);
    throw error;
  }
};

// Função para depurar a estrutura da resposta da API
export const debugApiResponse = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Depurando resposta da API...');
    
    // Testar endpoint /my-account
    console.log('Testando endpoint /my-account');
    const accountResponse = await axios.get(`${API_URL}/my-account`, getAuthConfig());
    console.log('Estrutura completa da resposta:', JSON.stringify(accountResponse.data, null, 2));
    
    // Testar endpoint /my-account/personal-data
    console.log('Testando endpoint /my-account/personal-data');
    const personalDataResponse = await axios.get(`${API_URL}/my-account/personal-data`, getAuthConfig());
    console.log('Estrutura da resposta de dados pessoais:', JSON.stringify(personalDataResponse.data, null, 2));
    
    return {
      accountData: accountResponse.data,
      personalData: personalDataResponse.data
    };
  } catch (error) {
    console.error('Erro ao depurar resposta da API:', error);
    throw error;
  }
};

// Exportando as funções de teste
export default {
  testGetUserPersonalData,
  testGetUserAccountData,
  debugApiResponse
}; 