import type { ProfileType } from '@/api/user/types';

export interface CheckoutProfilePF {
    firstName: string;
    lastName: string;
    cpf: string;
    birthDate?: string;
    gender?: string;
}

export interface CheckoutProfilePJ {
    companyName: string;
    cnpj: string;
    tradingName?: string;
}

export interface CheckoutAddressNew {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
}

export interface CheckoutAddressExisting {
    id: number;
    isDefault?: boolean;
}

export type CheckoutAddress = CheckoutAddressNew | CheckoutAddressExisting;

export interface CheckoutPhoneNew {
    ddd: string;
    number: string;
    isDefault?: boolean;
}

export interface CheckoutPhoneExisting {
    id: number;
}

export type CheckoutPhone = CheckoutPhoneNew | CheckoutPhoneExisting;

export interface CheckoutCard {
    cardToken: string;
    saveCard?: boolean;
    lastFourDigits?: string;
    holderName?: string;
    expirationMonth?: string;
    expirationYear?: string;
    brand?: string;
    isDefault?: boolean;
}

interface CheckoutRequestBase {
    profileType: ProfileType;
    profile: CheckoutProfilePF | CheckoutProfilePJ;
    address: CheckoutAddress;
    phone: CheckoutPhone;
    card?: CheckoutCard;
}

export interface CheckoutRequestNewUser extends CheckoutRequestBase {
    isRegistered: false;
    email: string;
    password: string;
}

export interface CheckoutRequestExistingUser extends CheckoutRequestBase {
    isRegistered: true;
}

export type CheckoutRequest = CheckoutRequestNewUser | CheckoutRequestExistingUser;

export interface CheckoutResponse {
    userId: number;
    profileId: number;
    addressId: number;
    phoneId: number;
    cardId?: number;
    cardToken?: string;
    accessToken: string;
}
