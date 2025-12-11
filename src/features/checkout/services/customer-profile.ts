import { addAddress, addPhone, addCard, updateProfile } from '@/features/account/services/userAccount';
import { cleanPhoneNumber } from '@/utils/formatters';

interface ProfileData {
    firstName: string;
    lastName: string;
    cpf?: string;
    cnpj?: string;
    tradingName?: string;
    stateRegistration?: string;
    profileType: 'PF' | 'PJ';
}

interface PhoneData {
    phone: string;
}

interface AddressData {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
}

interface CardData {
    cardNumber: string;
    holderName: string;
    expirationDate: string;
}

export async function saveCustomerProfile(profileId: number, data: ProfileData): Promise<void> {
    const profileUpdateData: any = {
        profile_type: data.profileType,
        profile_id: profileId
    };
    
    if (data.profileType === 'PF') {
        profileUpdateData.cpf = cleanPhoneNumber(data.cpf || '');
        profileUpdateData.firstName = data.firstName;
        profileUpdateData.lastName = data.lastName;
    } else {
        profileUpdateData.cnpj = cleanPhoneNumber(data.cnpj || '');
        profileUpdateData.trading_name = data.tradingName;
        profileUpdateData.state_registration = data.stateRegistration;
    }
    
    await updateProfile(profileUpdateData);
}

export async function saveCustomerPhone(data: PhoneData): Promise<void> {
    if (!data.phone) return;
    await addPhone(cleanPhoneNumber(data.phone));
}

export async function saveCustomerAddress(profileId: number, data: AddressData): Promise<void> {
    await addAddress({
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        is_default: true,
        profile_id: profileId
    });
}

export async function saveCustomerCard(profileId: number, data: CardData): Promise<void> {
    await addCard({
        card_number: data.cardNumber.replace(/\D/g, ''),
        holder_name: data.holderName,
        expiration_date: data.expirationDate,
        is_default: true,
        profile_id: profileId
    });
}

