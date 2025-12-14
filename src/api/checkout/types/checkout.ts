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
    stateRegistration?: string;
    municipalRegistration?: string;
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
    saveCard: boolean;
    lastFourDigits: string;
    holderName: string;
    expirationMonth: string;
    expirationYear: string;
    brand: string;
    isDefault?: boolean;
}

export interface GuestCheckoutRequest {
    email: string;
    password: string;
    profileType: ProfileType;
    profile: CheckoutProfilePF | CheckoutProfilePJ;
    address: CheckoutAddressNew;
    phone: CheckoutPhoneNew;
    card?: CheckoutCard;
}

export interface GuestCheckoutResponse {
    userId: number;
    profileId: number;
    accessToken: string;
}

export interface RegisteredCheckoutProfile {
    pf?: CheckoutProfilePF;
    pj?: CheckoutProfilePJ;
}

export interface RegisteredCheckoutRequest {
    profile: RegisteredCheckoutProfile;
    address: CheckoutAddress;
    phone: CheckoutPhone;
    card?: CheckoutCard;
}

export interface RegisteredCheckoutResponse {
    profileId: number;
    addressId: number;
    phoneId: number;
    cardId?: number;
}

export interface ShippingAddressOverride {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface CreateOrderRequest {
    shippingAddressId?: number;
    shippingAddressOverride?: ShippingAddressOverride;
    shippingOptionCode: string;
}

export interface OrderItemResponse {
    skuId: number;
    title: string;
    quantity: number;
    unitPrice: string;
    total: string;
}

export interface CreateOrderResponse {
    orderId: number;
    partnerOrderId: string;
    status: string;
    itemsTotal: string;
    shippingTotal: string;
    discountTotal: string;
    grandTotal: string;
    items: OrderItemResponse[];
}
