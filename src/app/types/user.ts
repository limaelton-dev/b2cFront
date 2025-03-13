import { Address } from "./address";
import { Card } from "./card";
import { Phone } from "./phones";

export type ProfileTypeEnum = 'PF' | 'PJ';

export interface User {
    id: number;
    email: string;
    password: string;
    profile_type?: ProfileTypeEnum;
    profile?: ProfilePF | ProfilePJ;
    address?: Address[];
    phone?: Phone[];
    card?: Card[];
}

export interface Profiles {
    id: number;
    user_id: number;
    profile_type: ProfileTypeEnum;
}

export interface ProfilePF {
    profile_id: number;
    full_name: string;
    cpf: string;
    birth_date: string;
    gender: string | null;
}

export interface ProfilePJ {
    profile_id: number;
    company_name: string;
    cnpj: string;
    trading_name: string;
    state_registration: string;
    municipal_registration: string;
}