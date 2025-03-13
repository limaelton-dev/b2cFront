export type ProfileTypeEnum = 'PF' | 'PJ';

export interface UserType {
    id: number;
    email: string;
    password: string;
    profile_type?: ProfileTypeEnum;
    profile?: ProfilePFType | ProfilePJType;
}

export interface ProfilesType {
    id: number;
    user_id: number;
    profile_type: ProfileTypeEnum;
}

export interface ProfilePFType {
    profile_id: number;
    full_name: string;
    cpf: string;
    birth_date: string;
    gender: string | null;
}

export interface ProfilePJType {
    profile_id: number;
    company_name: string;
    cnpj: string;
    trading_name: string;
    state_registration: string;
    municipal_registration: string;
}