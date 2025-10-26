import { ProfileType } from "./AuthUser";

export interface RegisterRequestPJ {
    email: string;
    password: string;
    profileType: ProfileType.PJ;
    companyName?: string;
    cnpj?: string;
    tradingName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
  }
  

  
export interface RegisterRequestPF {
    email: string;
    password: string;
    profileType: ProfileType.PF;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
    lastname?: string;
    cpf?: string;
    birthDate?: string;
    gender?: string | null;
  }
  

  export type RegisterRequest = RegisterRequestPF | RegisterRequestPJ;