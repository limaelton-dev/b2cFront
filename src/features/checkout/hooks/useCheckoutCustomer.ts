import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { prefillCustomerData } from '../services/prefill-customer-data';
import { fetchAddressByCep } from '@/api/address/services/cep';

export const PROFILE_TYPE = { PF: '1', PJ: '2' } as const;
export const PAYMENT_METHOD = { CREDIT_CARD: '1', PIX: '2' } as const;

export interface CheckoutFormData {
    profileType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;  // Data de nascimento (DD/MM/AAAA)
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
    cardHolderName: string;
    cardExpirationDate: string;
    cardCVV: string;
    saveCard: boolean;
    companyPurchaseAuthorization: boolean;
    receiveOffers: boolean;
    acceptPrivacyPolicy: boolean;
}

const initialFormData: CheckoutFormData = {
    profileType: PROFILE_TYPE.PF,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
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
    cardHolderName: '',
    cardExpirationDate: '',
    cardCVV: '',
    saveCard: false,
    companyPurchaseAuthorization: false,
    receiveOffers: false,
    acceptPrivacyPolicy: false
};

export function useCheckoutCustomer(onAddressLoaded?: (postalCode: string) => void) {
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToastSide();
    const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [maskedCard, setMaskedCard] = useState({ isMasked: false, cardId: 0, finalDigits: '', cardHolder: '', expiration: '', brand: '' });
    
    const [disabledFields, setDisabledFields] = useState({
        user: false,
        personalPF: false,
        personalPJ: false,
        address: false
    });
    
    // Ref para evitar atualizações de estado após desmontagem ou mudança de usuário
    const prefillRequestRef = useRef(0);
    
    useEffect(() => {
        if (!user?.id) return;
        
        const currentRequest = ++prefillRequestRef.current;
        
        prefillCustomerData(user).then(data => {
            // Ignorar resposta se houve nova requisição ou componente desmontou
            if (currentRequest !== prefillRequestRef.current) return;
            if (!data) return;
            
            setFormData(prev => ({
                ...prev,
                firstName: data.firstName,
                lastName: data.lastName,
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
                // Notificar que endereço foi carregado para calcular frete
                if (data.address.postalCode && onAddressLoaded) {
                    onAddressLoaded(data.address.postalCode);
                }
            }
            
            if (data.card) {
                setMaskedCard({
                    isMasked: true,
                    cardId: data.card.cardId,
                    finalDigits: data.card.finalDigits,
                    cardHolder: data.card.holderName,
                    expiration: data.card.expiration,
                    brand: data.card.brand
                });
                setFormData(prev => ({
                    ...prev,
                    cardNumber: data.card!.maskedNumber,
                    cardHolderName: data.card!.holderName,
                    cardExpirationDate: data.card!.expiration,
                    cardCVV: ''  // CVV não é armazenado - usuário deve informar novamente
                }));
            }
        });
        
        // Cleanup: invalida a requisição atual ao desmontar ou quando user.id mudar
        return () => {
            prefillRequestRef.current++;
        };
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

