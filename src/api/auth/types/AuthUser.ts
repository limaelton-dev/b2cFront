// src/api/auth/types/AuthUser.ts
export interface AuthUserProfilePJ {
    companyName?: string;
    cnpj?: string;
    tradingName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  }
  export interface AuthUserProfilePF {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    cpf?: string;
    birthDate?: string;
    gender?: string | null;
  }
  
  export enum ProfileType {
    PF = "PF",
    PJ = "PJ"
  }
  
  export interface AuthUserBase {
    id: string | number;
    email: string;
    profileId?: string | number;
    name?: string;
  }
  
  export interface AuthUserPF extends AuthUserBase {
    profileType: ProfileType.PF;
    profile?: AuthUserProfilePF;
  }
  export interface AuthUserPJ extends AuthUserBase {
    profileType: ProfileType.PJ;
    profile?: AuthUserProfilePJ;
  }
  
  export type AuthUser = AuthUserPF | AuthUserPJ;
  