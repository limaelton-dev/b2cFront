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
    const response = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
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
    const personalDataResponse = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
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
    const dataToUpdate: Record<string, string> = {
      [apiField]: value,
    };
    
    // Determinar o endpoint correto com base no campo
    let endpoint = '';
    if (field === 'email' || field === 'username') {
      endpoint = `${API_URL}/user/update`;
    } else if (field === 'phone') {
      endpoint = `${API_URL}/my-account/phones`;
    } else {
      endpoint = `${API_URL}/user/profile/details`;
    }
    
    // Enviar a atualização
    await axios.put(endpoint, dataToUpdate, getAuthConfig());
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
    await axios.patch(`${API_URL}/my-account/set-default-address/${addressId}`, {}, getAuthConfig());
  } catch (error) {
    console.error('Erro ao definir endereço como padrão:', error);
    throw error;
  }
};

// Função para excluir um endereço
export const deleteAddress = async (addressId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/my-account/remove-address/${addressId}`, getAuthConfig());
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
    await axios.patch(`${API_URL}/my-account/set-default-card/${cardId}`, {}, getAuthConfig());
  } catch (error) {
    console.error('Erro ao definir cartão como padrão:', error);
    throw error;
  }
};

// Função para excluir um cartão
export const deleteCard = async (cardId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/my-account/remove-card/${cardId}`, getAuthConfig());
  } catch (error) {
    console.error('Erro ao excluir cartão:', error);
    throw error;
  }
};

/**
 * Adiciona um novo cartão
 * @param cardData Dados do cartão a ser adicionado
 */
export const addCard = async (cardData: Partial<CartaoType>): Promise<CartaoType> => {
  try {
    // Obter o perfil do usuário para pegar o profile_id
    const profileResponse = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
    const profileData = profileResponse.data;
    
    // Criar uma cópia dos dados para não modificar o objeto original
    const cardWithProfileId = { ...cardData };
    
    // Adicionar o profile_id aos dados do cartão
    cardWithProfileId.profile_id = profileData.id;
    
    // Remover espaços do número do cartão
    if (cardWithProfileId.card_number) {
      // Remover todos os espaços do número do cartão
      cardWithProfileId.card_number = cardWithProfileId.card_number.replace(/\s+/g, '');
      
      // Extrair os últimos 4 dígitos do número do cartão, se não fornecido
      if (!cardWithProfileId.last_four_digits) {
        cardWithProfileId.last_four_digits = cardWithProfileId.card_number.slice(-4);
      }
      
      // Detectar o tipo do cartão se não fornecido
      if (!cardWithProfileId.card_type) {
        cardWithProfileId.card_type = detectCardType(cardWithProfileId.card_number);
      }
    }
    
    const response = await axios.post(`${API_URL}/my-account/add-card`, cardWithProfileId, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar cartão:', error);
    throw error;
  }
};

/**
 * Detecta o tipo do cartão com base no número
 * @param cardNumber Número do cartão
 */
const detectCardType = (cardNumber: string): string => {
  // Remover espaços e outros caracteres não numéricos
  const cleanedNumber = cardNumber.replace(/\s+/g, '');
  
  // Regras para detectar o tipo do cartão
  if (/^4/.test(cleanedNumber)) return 'visa';
  if (/^(5[1-5]|50[0-9][0-9])/.test(cleanedNumber)) return 'master'; // Incluindo 50xx para cartões de teste
  if (/^3[47]/.test(cleanedNumber)) return 'amex';
  if (/^(6011|65|64[4-9]|622)/.test(cleanedNumber)) return 'discover';
  if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|636369|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]|6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))/.test(cleanedNumber)) return 'elo';
  if (/^(384100|384140|384160|606282|637095|637568|60(?!11))/.test(cleanedNumber)) return 'hipercard';
  if (/^(5018|5020|5038|6304|6759|6761|6762|6763)/.test(cleanedNumber)) return 'maestro';
  
  // Cartões de teste específicos do Mercado Pago
  if (/^(5031)/.test(cleanedNumber)) return 'master';
  
  // Se não conseguir detectar, retornar um valor padrão
  return 'unknown';
};

/**
 * Atualiza um cartão existente
 * @param cardId ID do cartão
 * @param cardData Dados do cartão a serem atualizados
 */
export const updateCard = async (cardId: number, cardData: Partial<CartaoType>): Promise<CartaoType> => {
  try {
    // Criar uma cópia dos dados para não modificar o objeto original
    const dataToUpdate = { ...cardData };
    
    // Se o número do cartão for atualizado, atualizar também os últimos 4 dígitos
    if (dataToUpdate.card_number) {
      // Remover todos os espaços do número do cartão
      dataToUpdate.card_number = dataToUpdate.card_number.replace(/\s+/g, '');
      
      dataToUpdate.last_four_digits = dataToUpdate.card_number.slice(-4);
      
      // Detectar o tipo do cartão se não fornecido
      if (!dataToUpdate.card_type) {
        dataToUpdate.card_type = detectCardType(dataToUpdate.card_number);
      }
    }
    
    const response = await axios.patch(`${API_URL}/my-account/update-card/${cardId}`, dataToUpdate, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
    throw error;
  }
};

/**
 * Atualiza os dados de perfil do usuário (nome, CPF, data de nascimento, gênero)
 * @param data Dados a serem atualizados
 */
export const updateProfile = async (data: Partial<DadosPessoaisType>): Promise<void> => {
  try {
    const dataToUpdate: Record<string, any> = {};
    
    // Adicionar logs para debug
    console.log('Dados recebidos para atualização de perfil:', data);
    
    // Adicionar apenas os campos que foram fornecidos
    if (data.firstName !== undefined) dataToUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) dataToUpdate.lastName = data.lastName;
    if (data.full_name !== undefined) dataToUpdate.full_name = data.full_name;
    if (data.cpf !== undefined) dataToUpdate.cpf = data.cpf;
    if (data.birth_date !== undefined) dataToUpdate.birth_date = data.birth_date;
    if (data.gender !== undefined) dataToUpdate.gender = data.gender;
    
    console.log('Dados formatados para envio:', dataToUpdate);
    
    // Enviar requisição PATCH para atualizar o perfil
    await axios.patch(`${API_URL}/my-account/update-profile`, dataToUpdate, getAuthConfig());
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    console.error('Detalhes do erro:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Atualiza os dados de usuário (username, email)
 * @param data Dados a serem atualizados
 */
export const updateUser = async (data: Partial<DadosPessoaisType>): Promise<void> => {
  try {
    const dataToUpdate: Record<string, any> = {};
    
    // Adicionar apenas os campos que foram fornecidos
    if (data.username !== undefined) dataToUpdate.username = data.username;
    if (data.email !== undefined) dataToUpdate.email = data.email;
    
    // Enviar requisição PATCH para atualizar o usuário
    await axios.patch(`${API_URL}/my-account/update-user`, dataToUpdate, getAuthConfig());
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

/**
 * Adiciona um novo telefone
 * @param phoneNumber Número do telefone
 */
export const addPhone = async (phoneNumber: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/my-account/add-phone`, { phone: phoneNumber }, getAuthConfig());
  } catch (error) {
    console.error('Erro ao adicionar telefone:', error);
    throw error;
  }
};

/**
 * Atualiza um telefone existente
 * @param phoneId ID do telefone
 * @param phoneNumber Novo número de telefone
 */
export const updatePhone = async (phoneId: number, phoneNumber: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/my-account/update-phone/${phoneId}`, { phone: phoneNumber }, getAuthConfig());
  } catch (error) {
    console.error('Erro ao atualizar telefone:', error);
    throw error;
  }
};

/**
 * Remove um telefone
 * @param phoneId ID do telefone
 */
export const removePhone = async (phoneId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/my-account/remove-phone/${phoneId}`, getAuthConfig());
  } catch (error) {
    console.error('Erro ao remover telefone:', error);
    throw error;
  }
};

/**
 * Define um telefone como principal
 * @param phoneId ID do telefone
 */
export const setPrimaryPhone = async (phoneId: number): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/my-account/set-primary-phone/${phoneId}`, {}, getAuthConfig());
  } catch (error) {
    console.error('Erro ao definir telefone como principal:', error);
    throw error;
  }
};

/**
 * Adiciona um novo endereço
 * @param addressData Dados do endereço a ser adicionado
 */
export const addAddress = async (addressData: Partial<EnderecoType>): Promise<EnderecoType> => {
  try {
    // Obter o perfil do usuário para pegar o profile_id
    const profileResponse = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
    
    // Adicionar o profile_id aos dados do endereço
    const addressWithProfileId = {
      ...addressData,
    };
    
    const response = await axios.post(`${API_URL}/address`, addressWithProfileId, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar endereço:', error);
    throw error;
  }
};

/**
 * Atualiza um endereço existente
 * @param addressId ID do endereço
 * @param addressData Dados do endereço a serem atualizados
 */
export const updateAddress = async (addressId: number, addressData: Partial<EnderecoType>): Promise<EnderecoType> => {
  try {
    // Obter o perfil do usuário para pegar o profile_id, caso não esteja nos dados
    let dataToUpdate = { ...addressData };
    
    if (!dataToUpdate.profile_id) {
      const profileResponse = await axios.get(`${API_URL}/user/profile/details`, getAuthConfig());
      const profileData = profileResponse.data;
      
      // Adicionar o profile_id aos dados do endereço
      dataToUpdate = {
        ...dataToUpdate,
        profile_id: profileData.id
      };
    }
    
    const response = await axios.patch(`${API_URL}/my-account/update-address/${addressId}`, dataToUpdate, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

/**
 * Busca informações de endereço a partir do CEP
 * @param cep CEP a ser consultado (apenas números ou no formato 00000-000)
 */
export const fetchAddressByCEP = async (cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}> => {
  try {
    // Remover caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
    }
    
    // Consultar a API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = response.data;
    
    // Verificar se o CEP existe
    if (data.erro) {
      throw new Error('CEP não encontrado.');
    }
    
    // Retornar os dados formatados
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

/**
 * Verifica se um endereço está vinculado a pedidos
 * @param addressId ID do endereço
 */
export const checkAddressLinkedToOrders = async (addressId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/my-account/check-address-usage/${addressId}`, getAuthConfig());
    return response.data.linked || false;
  } catch (error: any) {
    // Se o erro for 409 (Conflict), significa que o endereço está vinculado
    if (error.response && error.response.data && error.response.data.statusCode === 409) {
      return true;
    }
    console.error('Erro ao verificar uso do endereço:', error);
    return false;
  }
}; 