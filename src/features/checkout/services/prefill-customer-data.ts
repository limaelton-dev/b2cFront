import { getProfileDetails } from '@/api/user';
import type { ProfileDetails, ProfilePF, ProfilePJ } from '@/api/user';
import { formatPhoneNumber } from '@/utils/formatters';

const formatISOToBR = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

export interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneId?: number;
    cpf: string;
    birthDate: string;
    cnpj: string;
    tradingName: string;
    stateRegistration: string;
    profileType: 'PF' | 'PJ';
    address?: {
        id?: number;
        postalCode: string;
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    card?: {
        cardId: number;
        maskedNumber: string;
        finalDigits: string;
        holderName: string;
        expiration: string;
        brand: string;
    };
}

export async function prefillCustomerData(user: any): Promise<CustomerData | null> {
    if (!user?.id) return null;
    
    let profileData: ProfileDetails | null = null;
    try {
        profileData = await getProfileDetails();
    } catch {
        return null;
    }
    
    if (!profileData) return null;
    
    const profileType = profileData.profileType || profileData.profile_type;
    const isPJ = profileType === 'PJ';
    
    const data: CustomerData = {
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        cpf: '',
        birthDate: '',
        cnpj: '',
        tradingName: '',
        stateRegistration: '',
        profileType: isPJ ? 'PJ' : 'PF'
    };
    
    if (!isPJ && profileData.profile) {
        const pf = profileData.profile as ProfilePF;
        data.firstName = pf.firstName || '';
        data.lastName = pf.lastName || '';
        data.cpf = pf.cpf || '';
        data.birthDate = pf.birthDate ? formatISOToBR(pf.birthDate) : '';
    } else if (isPJ && profileData.profile) {
        const pj = profileData.profile as ProfilePJ;
        data.cnpj = pj.cnpj || '';
        data.tradingName = pj.tradingName || '';
        data.stateRegistration = pj.stateRegistration || '';
    }
    
    const phones = profileData.phones || profileData.phone || [];
    if (phones.length > 0) {
        const primaryPhone = phones.find(p => p.isDefault) || phones[0];
        if (primaryPhone) {
            data.phone = formatPhoneNumber(`${primaryPhone.ddd}${primaryPhone.number}`);
            data.phoneId = primaryPhone.id;
        }
    }
    
    const addresses = profileData.addresses || profileData.address || [];
    if (addresses.length > 0) {
        const addr = addresses.find(a => a.isDefault) || addresses[0];
        data.address = {
            id: addr.id,
            postalCode: addr.zipCode || '',
            street: addr.street || '',
            number: addr.number || '',
            complement: addr.complement || '',
            neighborhood: addr.neighborhood || '',
            city: addr.city || '',
            state: addr.state || ''
        };
    }
    
    const cards = profileData.cards || profileData.card || [];
    if (cards.length > 0) {
        const card = cards.find(c => c.isDefault) || cards[0];
        data.card = {
            cardId: card.id,
            maskedNumber: `**** **** **** ${card.lastFourDigits}`,
            finalDigits: card.lastFourDigits,
            holderName: card.holderName,
            expiration: `${card.expirationMonth}/${card.expirationYear.slice(-2)}`,
            brand: card.brand
        };
    }
    
    return data;
}

