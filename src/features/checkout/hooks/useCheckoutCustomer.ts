import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { prefillCustomerData } from '../services/prefill-customer-data';
import { fetchAddressByCep } from '@/api/address/services/cep';

export const PROFILE_TYPE = { PF: '1', PJ: '2' } as const;
export const PAYMENT_METHOD = { CREDIT_CARD: '1', DEBIT_CARD: '2', PIX: '3' } as const;

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
    cardHolderDocument: string;  // CPF do titular do cartão (pode ser diferente do CPF do usuário)
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
    cardHolderDocument: '',
    cardExpirationDate: '',
    cardCVV: '',
    saveCard: false,
    companyPurchaseAuthorization: false,
    receiveOffers: false,
    acceptPrivacyPolicy: false
};

export interface SavedIds {
    addressId?: number;
    phoneId?: number;
}

export function useCheckoutCustomer(onAddressLoaded?: (postalCode: string) => void) {
    const { user, isAuthenticated } = useAuth();
    const { showToast } = useToastSide();
    const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [maskedCard, setMaskedCard] = useState({ isMasked: false, cardId: 0, finalDigits: '', cardHolder: '', expiration: '', brand: '' });
    const [savedIds, setSavedIds] = useState<SavedIds>({});
    
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
                birthDate: data.birthDate,
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
            
            setSavedIds({
                addressId: data.address?.id,
                phoneId: data.phoneId
            });
            
            if (data.address) {
                setFormData(prev => ({ ...prev, ...data.address }));
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
    }, [user?.id, onAddressLoaded]);
    
    const updateField = useCallback((field: keyof CheckoutFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const clearAddressFields = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            number: '',
            complement: ''
        }));
    }, []);
    
    const autoFillAddressByPostalCode = useCallback(async (postalCodeValue?: string) => {
        const cep = postalCodeValue || formData.postalCode;
        const cleanCep = cep.replace(/\D/g, '');
        
        if (cleanCep.length !== 8) return { success: false };
        
        setLoadingAddress(true);
        
        try {
            const address = await fetchAddressByCep(cleanCep);
            setFormData(prev => ({
                ...prev,
                street: address.street,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state
            }));
            return { success: true };
        } catch {
            clearAddressFields();
            showToast('CEP não encontrado', 'error');
            return { success: false };
        } finally {
            setLoadingAddress(false);
        }
    }, [formData.postalCode, showToast, clearAddressFields]);
    
    return {
        formData,
        updateField,
        isAuthenticated,
        maskedCard,
        savedIds,
        disabledFields,
        loadingAddress,
        autoFillAddressByPostalCode,
        clearAddressFields
    };
}

