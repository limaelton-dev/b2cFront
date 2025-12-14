// =============================================================================
// TIPOS UNIFICADOS DO MÓDULO USER
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------
export type ProfileType = "PF" | "PJ";

// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------
export interface ProfilePF {
  id?: number;
  firstName: string;
  lastName: string;
  cpf: string;
  birthDate: string;
  gender?: string | null;
}

export interface ProfilePJ {
  id?: number;
  companyName: string;
  cnpj: string;
  tradingName?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
}

export type Profile = ProfilePF | ProfilePJ;

// -----------------------------------------------------------------------------
// User
// -----------------------------------------------------------------------------
export interface User {
  id: number;
  email: string;
}

export interface UserWithProfile extends User {
  profileType?: ProfileType;
  profile?: Profile;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
}

export interface AvailabilityResponse {
  available: boolean;
}

// -----------------------------------------------------------------------------
// Address
// -----------------------------------------------------------------------------
export interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
}

// -----------------------------------------------------------------------------
// Phone
// -----------------------------------------------------------------------------
export interface Phone {
  id: number;
  ddd: string;
  number: string;
  isDefault: boolean;
  verified: boolean;
}

export interface CreatePhoneRequest {
  ddd: string;
  number: string;
  isDefault?: boolean;
}

export interface UpdatePhoneRequest {
  ddd?: string;
  number?: string;
  isDefault?: boolean;
}

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------
export interface Card {
  id: number;
  lastFourDigits: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  brand: string;
  isDefault: boolean;
  cardToken?: string | null;
}

export interface CreateCardRequest {
  lastFourDigits: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  brand: string;
  isDefault?: boolean;
}

export interface UpdateCardRequest {
  holderName?: string;
  isDefault?: boolean;
}

// -----------------------------------------------------------------------------
// Profile Details (resposta completa com tudo)
// -----------------------------------------------------------------------------
export interface ProfileDetails extends UserWithProfile {
  addresses?: Address[];
  phones?: Phone[];
  cards?: Card[];
  address?: Address[];
  phone?: Phone[];
  card?: Card[];
  profile_type?: ProfileType;
}

