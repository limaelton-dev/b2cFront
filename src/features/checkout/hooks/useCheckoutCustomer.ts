import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { prefillCustomerData } from '../services/prefill-customer-data';
import { fetchAddressByCep } from '@/api/address/services/cep';

export const PROFILE_TYPE = { PF: '1', PJ: '2' } as const;
export const PAYMENT_METHOD = { CREDIT_CARD: '1', PIX: '2' } as const;

export interface CheckoutFormData {
    profileType: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
    confirmPassword: string;
    cnpj: string;
    tradingName: string;
    stateRegistration: string;
    postalCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    paymentMethod: string;
    cardNumber: string;
    cardExpirationDate: string;
    cardCVV: string;
    saveCard: boolean;
    companyPurchaseAuthorization: boolean;
    receiveOffers: boolean;
    acceptPrivacyPolicy: boolean;
}

const initialFormData: CheckoutFormData = {
    profileType: PROFILE_TYPE.PF,
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    cnpj: '',
    tradingName: '',
    stateRegistration: '',
    postalCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    paymentMethod: PAYMENT_METHOD.CREDIT_CARD,
    cardNumber: '',
    cardExpirationDate: '',
    cardCVV: '',
    saveCard: false,
    companyPurchaseAuthorization: false,
    receiveOffers: false,
    acceptPrivacyPolicy: false
};

export function useCheckoutCustomer() {
    const { user } = useAuth();
    const { showToast } = useToastSide();
    const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [maskedCard, setMaskedCard] = useState({ isMasked: false, finalDigits: '', cardHolder: '', expiration: '' });
    
    const [disabledFields, setDisabledFields] = useState({
        user: false,
        personalPF: false,
        personalPJ: false,
        address: false
    });
    
    useEffect(() => {
        if (!user?.id) return;
        
        setIsAuthenticated(true);
        
        prefillCustomerData(user).then(data => {
            if (!data) return;
            
            setFormData(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                phone: data.phone,
                profileType: data.profileType === 'PJ' ? PROFILE_TYPE.PJ : PROFILE_TYPE.PF,
                cpf: data.cpf,
                cnpj: data.cnpj,
                tradingName: data.tradingName,
                stateRegistration: data.stateRegistration
            }));
            
            setDisabledFields({
                user: true,
                personalPF: !!data.cpf,
                personalPJ: !!(data.cnpj && data.tradingName && data.stateRegistration),
                address: !!data.address?.street
            });
            
            if (data.address) {
                setFormData(prev => ({ ...prev, ...data.address }));
            }
            
            if (data.card) {
                setMaskedCard({
                    isMasked: true,
                    finalDigits: data.card.finalDigits,
                    cardHolder: data.card.holderName,
                    expiration: data.card.expiration
                });
                setFormData(prev => ({
                    ...prev,
                    cardNumber: data.card!.maskedNumber,
                    cardExpirationDate: 'XX/XX',
                    cardCVV: 'XXX'
                }));
            }
        });
    }, [user?.id]);
    
    const updateField = useCallback((field: keyof CheckoutFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const autoFillAddressByPostalCode = useCallback(async () => {
        if (formData.postalCode.length !== 9) return;
        
        setLoadingAddress(true);
        
        try {
            const address = await fetchAddressByCep(formData.postalCode);
            setFormData(prev => ({
                ...prev,
                street: address.street,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state
            }));
        } catch {
            showToast('Erro ao buscar endereço', 'error');
        } finally {
            setLoadingAddress(false);
        }
    }, [formData.postalCode, showToast]);
    
    return {
        formData,
        updateField,
        isAuthenticated,
        maskedCard,
        disabledFields,
        loadingAddress,
        autoFillAddressByPostalCode
    };
}

