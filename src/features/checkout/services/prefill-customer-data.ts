import { getProfileUser, getUserPersonalData } from '@/api/user/profile/services/profile';
import { formatPhoneNumber } from '@/utils/formatters';

export interface CustomerData {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cnpj: string;
    tradingName: string;
    stateRegistration: string;
    profileType: 'PF' | 'PJ';
    address?: {
        postalCode: string;
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    card?: {
        maskedNumber: string;
        finalDigits: string;
        holderName: string;
        expiration: string;
    };
}

export async function prefillCustomerData(user: any): Promise<CustomerData | null> {
    if (!user?.id) return null;
    
    const [profileData, userData] = await Promise.all([
        getProfileUser(),
        getUserPersonalData()
    ]);
    
    if (!profileData) return null;
    
    const data: CustomerData = {
        name: user.name,
        email: user.email,
        phone: '',
        cpf: '',
        cnpj: '',
        tradingName: '',
        stateRegistration: '',
        profileType: profileData.profile_type === 'PJ' ? 'PJ' : 'PF'
    };
    
    if (data.profileType === 'PF') {
        data.cpf = profileData.cpf || '';
    } else {
        data.cnpj = profileData.cnpj || '';
        data.tradingName = profileData.trading_name || '';
        data.stateRegistration = profileData.state_registration || '';
    }
    
    if (userData?.phones?.length > 0) {
        const primaryPhone = userData.phones.find((p: any) => p.is_primary) || userData.phones[0];
        if (primaryPhone) {
            data.phone = formatPhoneNumber(primaryPhone.number);
        }
    }
    
    if (profileData.addresses?.length > 0) {
        const addr = profileData.addresses[0];
        data.address = {
            postalCode: addr.postal_code || '',
            street: addr.street || '',
            number: addr.number || '',
            complement: addr.complement || '',
            neighborhood: addr.neighborhood || '',
            city: addr.city || '',
            state: addr.state || ''
        };
    }
    
    if (profileData.cards?.length > 0) {
        const card = profileData.cards[0];
        const lastFour = card.card_number.slice(-4);
        data.card = {
            maskedNumber: `XXXX XXXX XXXX ${lastFour}`,
            finalDigits: lastFour,
            holderName: card.holder_name,
            expiration: card.expiration_date
        };
    }
    
    return data;
}

