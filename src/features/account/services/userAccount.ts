import { get, patch } from '@/api/http';
import {
  getProfileDetails,
  getAddresses,
  createAddress,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  setDefaultAddress,
  getCards,
  createCard,
  updateCard as updateCardApi,
  deleteCard as deleteCardApi,
  setDefaultCard,
  createPhone,
  updatePhone as updatePhoneApi,
  deletePhone as deletePhoneApi,
  setDefaultPhone,
  updateProfilePF,
  updateProfilePJ,
} from '@/api/user';
import type {
  ProfilePF,
  ProfilePJ,
  Address,
  Card,
  CreateAddressRequest,
  UpdateAddressRequest,
  CreateCardRequest,
  UpdateCardRequest,
  CreatePhoneRequest,
  UpdatePhoneRequest,
} from '@/api/user';
import { formatDateBR, formatPhoneNumber } from '@/utils/formatters';
import { DadosPessoaisType, EnderecoType, CartaoType } from '../types';

export { fetchAddressByCep } from '@/api/address/services/cep';

export const getUserPersonalData = async (): Promise<DadosPessoaisType> => {
  const profileData = await getProfileDetails();
  
  const phones = profileData.phone || profileData.phones || [];
  const phoneDefault = phones.find(p => p.isDefault) || phones[0];
  
  const profileType = profileData.profile_type || profileData.profileType || 'PF';
  const isPF = profileType === 'PF';
  const profile = profileData.profile;
  
  let fullName = '';
  let cpf = '';
  let birthDate = '';
  let gender: string | null = null;
  
  if (isPF && profile) {
    const pf = profile as ProfilePF;
    fullName = `${pf.firstName || ''} ${pf.lastName || ''}`.trim();
    cpf = pf.cpf || '';
    birthDate = pf.birthDate ? formatDateBR(pf.birthDate) : '';
    gender = pf.gender || null;
  }
  
  return {
    full_name: fullName,
    firstName: isPF ? (profile as ProfilePF)?.firstName : undefined,
    lastName: isPF ? (profile as ProfilePF)?.lastName : undefined,
    cpf,
    email: profileData.email || '',
    username: profileData.email || '',
    birth_date: birthDate,
    phone: phoneDefault ? formatPhoneNumber(`${phoneDefault.ddd}${phoneDefault.number}`) : '',
    gender,
    profile_type: profileType,
  };
};

export const updateProfile = async (data: any): Promise<void> => {
  const profileData = await getProfileDetails();
  
  const profileType = profileData.profile_type || profileData.profileType;
  const profileId = profileData.profile?.id;
  
  if (!profileId) {
    throw new Error('Perfil não encontrado');
  }
  
  if (profileType === 'PF') {
    const currentProfile = profileData.profile as ProfilePF;
    const pfData: Partial<Omit<ProfilePF, 'id'>> = {};
    
    if (data.firstName !== undefined) pfData.firstName = data.firstName;
    if (data.lastName !== undefined) pfData.lastName = data.lastName;
    if (data.full_name !== undefined) {
      const nameParts = data.full_name.trim().split(' ');
      pfData.firstName = nameParts[0] || '';
      pfData.lastName = nameParts.slice(1).join(' ') || '';
    }
    if (data.cpf !== undefined) {
      pfData.cpf = data.cpf.replace(/\D/g, '');
      pfData.cpf = pfData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (data.birth_date !== undefined && data.birth_date) {
      pfData.birthDate = data.birth_date;
    }
    if (data.gender !== undefined) pfData.gender = data.gender || null;
    
    if (Object.keys(pfData).length > 0) {
      await updateProfilePF(profileId, pfData);
    }
  } else {
    const pjData: Partial<Omit<ProfilePJ, 'id'>> = {};
    if (data.companyName !== undefined) pjData.companyName = data.companyName;
    if (data.cnpj !== undefined) pjData.cnpj = data.cnpj;
    if (data.tradingName !== undefined) pjData.tradingName = data.tradingName;
    if (data.stateRegistration !== undefined) pjData.stateRegistration = data.stateRegistration;
    if (data.municipalRegistration !== undefined) pjData.municipalRegistration = data.municipalRegistration;
    
    if (Object.keys(pjData).length > 0) {
      await updateProfilePJ(profileId, pjData);
    }
  }
  
  if (data.phone !== undefined && data.phone) {
    const phones = profileData.phone || profileData.phones || [];
    const defaultPhone = phones.find(p => p.isDefault) || phones[0];
    
    if (defaultPhone) {
      await updatePhone(defaultPhone.id, data.phone);
    } else {
      await addPhone(data.phone);
    }
  }
};

export const updateUser = async (data: Partial<DadosPessoaisType>): Promise<void> => {
  const dataToUpdate: Record<string, string> = {};
  if (data.email !== undefined) dataToUpdate.email = data.email;
  
  if (Object.keys(dataToUpdate).length > 0) {
    await patch('/user', dataToUpdate);
  }
};

export const getUserAddresses = async (): Promise<EnderecoType[]> => {
  const addressList = await getAddresses();
  return addressList.map(mapAddressToEndereco);
};

export const setAddressAsDefault = async (addressId: number): Promise<void> => {
  await setDefaultAddress(addressId);
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  await deleteAddressApi(addressId);
};

export const addAddress = async (addressData: Partial<EnderecoType>): Promise<EnderecoType> => {
  const payload: CreateAddressRequest = {
    street: addressData.street || '',
    number: addressData.number || '',
    complement: addressData.complement,
    neighborhood: addressData.neighborhood || '',
    city: addressData.city || '',
    state: addressData.state || '',
    zipCode: addressData.postal_code || '',
    isDefault: addressData.is_default,
  };
  
  const created = await createAddress(payload);
  return mapAddressToEndereco(created);
};

export const updateAddress = async (
  addressId: number,
  addressData: Partial<EnderecoType>
): Promise<EnderecoType> => {
  const payload: UpdateAddressRequest = {};
  
  if (addressData.street !== undefined) payload.street = addressData.street;
  if (addressData.number !== undefined) payload.number = addressData.number;
  if (addressData.complement !== undefined) payload.complement = addressData.complement;
  if (addressData.neighborhood !== undefined) payload.neighborhood = addressData.neighborhood;
  if (addressData.city !== undefined) payload.city = addressData.city;
  if (addressData.state !== undefined) payload.state = addressData.state;
  if (addressData.postal_code !== undefined) payload.zipCode = addressData.postal_code;
  if (addressData.is_default !== undefined) payload.isDefault = addressData.is_default;
  
  const updated = await updateAddressApi(addressId, payload);
  return mapAddressToEndereco(updated);
};

export const checkAddressLinkedToOrders = async (addressId: number): Promise<boolean> => {
  try {
    const response = await get<{ linked: boolean }>(`/address/${addressId}/check-usage`);
    return response.linked || false;
  } catch {
    return false;
  }
};

export const getUserCards = async (): Promise<CartaoType[]> => {
  const cardList = await getCards();
  return cardList.map(mapCardToCartao);
};

export const setCardAsDefault = async (cardId: number): Promise<void> => {
  await setDefaultCard(cardId);
};

export const deleteCard = async (cardId: number): Promise<void> => {
  await deleteCardApi(cardId);
};

export const addCard = async (cardData: Partial<CartaoType>): Promise<CartaoType> => {
  const payload: CreateCardRequest = {
    lastFourDigits: cardData.last_four_digits || '',
    holderName: cardData.holder_name || '',
    expirationMonth: cardData.expiration_month || '',
    expirationYear: cardData.expiration_year || '',
    brand: cardData.card_type || '',
    isDefault: cardData.is_default,
  };
  
  const created = await createCard(payload);
  return mapCardToCartao(created);
};

export const updateCard = async (
  cardId: number,
  cardData: Partial<CartaoType>
): Promise<CartaoType> => {
  const payload: UpdateCardRequest = {};
  
  if (cardData.holder_name !== undefined) payload.holderName = cardData.holder_name;
  if (cardData.is_default !== undefined) payload.isDefault = cardData.is_default;
  
  const updated = await updateCardApi(cardId, payload);
  return mapCardToCartao(updated);
};

export const addPhone = async (phoneNumber: string): Promise<void> => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const ddd = cleanNumber.substring(0, 2);
  const number = cleanNumber.substring(2);
  
  const payload: CreatePhoneRequest = {
    ddd,
    number,
    isDefault: true,
  };
  
  await createPhone(payload);
};

export const updatePhone = async (phoneId: number, phoneNumber: string): Promise<void> => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const ddd = cleanNumber.substring(0, 2);
  const number = cleanNumber.substring(2);
  
  const payload: UpdatePhoneRequest = { ddd, number };
  await updatePhoneApi(phoneId, payload);
};

export const removePhone = async (phoneId: number): Promise<void> => {
  await deletePhoneApi(phoneId);
};

export const setPrimaryPhone = async (phoneId: number): Promise<void> => {
  await setDefaultPhone(phoneId);
};

function mapAddressToEndereco(address: Address): EnderecoType {
  return {
    id: address.id,
    profile_id: 0,
    street: address.street,
    number: address.number,
    complement: address.complement || '',
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    postal_code: address.zipCode,
    is_default: address.isDefault,
    created_at: '',
    updated_at: '',
  };
}

function mapCardToCartao(card: Card): CartaoType {
  return {
    id: card.id,
    profile_id: 0,
    holder_name: card.holderName,
    expiration_month: card.expirationMonth,
    expiration_year: card.expirationYear,
    is_default: card.isDefault,
    card_type: card.brand,
    last_four_digits: card.lastFourDigits,
    card_token: card.cardToken,
    created_at: '',
    updated_at: '',
  };
}
