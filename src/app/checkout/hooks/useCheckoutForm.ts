"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useToastSide } from '../../context/ToastSideProvider';
import { validateCPF, validatePhone, validatePasswords } from '../utils/validation';
import { fetchAddressByCEP } from '../utils/address';
import { getProfileUser, getUserPersonalData } from '../../api/user/profile/services/profile';
import { addAddress, addPhone, addCard, updateProfile } from '../../minhaconta/services/userAccount';
import { validateCpf, validateEmail } from '../../api/checkout';
import { register } from '../../api/auth/services/auth-service';
import { ProfileType } from '../../api/auth/types/AuthUser';
import { useCookies } from 'react-cookie';
import { getToken } from '../../utils/auth';

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

export interface FormErrors {
    cpf: boolean;
    email: boolean;
    phone: boolean;
    phoneMessage: string;
    passwords: boolean;
    passwordsMessage: string;
}

export interface DisabledFields {
    user: boolean;
    personalPF: boolean;
    personalPJ: boolean;
    address: boolean;
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

const initialErrors: FormErrors = {
    cpf: false,
    email: false,
    phone: false,
    phoneMessage: '',
    passwords: false,
    passwordsMessage: ''
};

const initialDisabledFields: DisabledFields = {
    user: false,
    personalPF: false,
    personalPJ: false,
    address: false
};

export const useCheckoutForm = () => {
    const { showToast } = useToastSide();
    const { user, refreshProfile } = useAuth();
    const [cookies, setCookie] = useCookies(['jwt']);
    
    const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [loadings, setLoadings] = useState({ form: false, personalData: false, cep: false, submit: false });
    const [disabledFields, setDisabledFields] = useState<DisabledFields>(initialDisabledFields);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [maskedCard, setMaskedCard] = useState({
        isMasked: false,
        finalDigits: '',
        cardHolder: '',
        expiration: ''
    });

    const loadUserProfile = useCallback(async () => {
        if (!user?.id) return;
        
        setLoadings(prev => ({ ...prev, form: true }));
        
        try {
            const [profileData, userData] = await Promise.all([
                getProfileUser(),
                getUserPersonalData()
            ]);
            
            if (!profileData) return;

            if (profileData.profile_type === 'PF') {
                setFormData(prev => ({ ...prev, profileType: PROFILE_TYPE.PF, cpf: profileData.cpf || '' }));
                setDisabledFields(prev => ({ ...prev, personalPF: !!profileData.cpf }));
            } else if (profileData.profile_type === 'PJ') {
                setFormData(prev => ({
                    ...prev,
                    profileType: PROFILE_TYPE.PJ,
                    cnpj: profileData.cnpj || '',
                    tradingName: profileData.trading_name || '',
                    stateRegistration: profileData.state_registration || ''
                }));
                setDisabledFields(prev => ({
                    ...prev,
                    personalPJ: !!(profileData.cnpj && profileData.trading_name && profileData.state_registration)
                }));
            }

            if (userData?.phones?.length > 0) {
                const primaryPhone = userData.phones.find((p: any) => p.is_primary) || userData.phones[0];
                if (primaryPhone) {
                    const num = primaryPhone.number;
                    const formatted = num.length === 11
                        ? `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`
                        : num.length === 10
                            ? `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`
                            : num;
                    setFormData(prev => ({ ...prev, phone: formatted }));
                }
            }

            if (profileData.addresses?.length > 0) {
                const addr = profileData.addresses[0];
                setFormData(prev => ({
                    ...prev,
                    postalCode: addr.postal_code || '',
                    street: addr.street || '',
                    number: addr.number || '',
                    complement: addr.complement || '',
                    neighborhood: addr.neighborhood || '',
                    city: addr.city || '',
                    state: addr.state || ''
                }));
                setDisabledFields(prev => ({
                    ...prev,
                    address: !!(addr.street && addr.neighborhood && addr.city && addr.state && addr.postal_code && addr.number)
                }));
            }

            if (profileData.cards?.length > 0) {
                const card = profileData.cards[0];
                const lastFour = card.card_number.slice(-4);
                setMaskedCard({
                    isMasked: true,
                    finalDigits: lastFour,
                    cardHolder: card.holder_name,
                    expiration: card.expiration_date
                });
                setFormData(prev => ({
                    ...prev,
                    cardNumber: `XXXX XXXX XXXX ${lastFour}`,
                    cardExpirationDate: 'XX/XX',
                    cardCVV: 'XXX'
                }));
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        } finally {
            setLoadings(prev => ({ ...prev, form: false }));
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            setIsAuthenticated(true);
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
            setDisabledFields(prev => ({ ...prev, user: true }));
            loadUserProfile();
        }
    }, [user?.id, loadUserProfile]);

    const updateField = useCallback((field: keyof CheckoutFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const validateCPFOnServer = useCallback(async (cpfValue: string) => {
        if (cpfValue.length !== 14) return;
        
        if (!validateCPF(cpfValue)) {
            setErrors(prev => ({ ...prev, cpf: true }));
            return;
        }
        
        if (isAuthenticated) return;
        
        setLoadings(prev => ({ ...prev, personalData: true }));
        
        try {
            const response = await validateCpf(cpfValue);
            setErrors(prev => ({ ...prev, cpf: response?.status === 409 }));
        } catch {
            setErrors(prev => ({ ...prev, cpf: true }));
        } finally {
            setLoadings(prev => ({ ...prev, personalData: false }));
        }
    }, [isAuthenticated]);

    const validateEmailOnServer = useCallback(async () => {
        if (!formData.email || isAuthenticated) return;
        
        try {
            const response = await validateEmail(formData.email);
            setErrors(prev => ({ ...prev, email: response?.status === 409 }));
        } catch {
            setErrors(prev => ({ ...prev, email: true }));
        }
    }, [formData.email, isAuthenticated]);

    const validatePhoneField = useCallback((phoneValue: string) => {
        const result = validatePhone(phoneValue);
        setErrors(prev => ({ ...prev, phone: !result.isValid, phoneMessage: result.errorMessage }));
        return result.isValid;
    }, []);

    const validatePasswordFields = useCallback(() => {
        const result = validatePasswords(formData.password, formData.confirmPassword);
        setErrors(prev => ({ ...prev, passwords: !result.isValid, passwordsMessage: result.errorMessage }));
        return result.isValid;
    }, [formData.password, formData.confirmPassword]);

    const fetchAddress = useCallback(async () => {
        if (formData.postalCode.length !== 9) return;
        
        setLoadings(prev => ({ ...prev, cep: true }));
        
        try {
            const address = await fetchAddressByCEP(formData.postalCode);
            if (address) {
                setFormData(prev => ({
                    ...prev,
                    street: address.street || '',
                    neighborhood: address.neighborhood || '',
                    city: address.city || '',
                    state: address.state || ''
                }));
            }
        } catch {
            showToast('Erro ao buscar o endereço', 'error');
        } finally {
            setLoadings(prev => ({ ...prev, cep: false }));
        }
    }, [formData.postalCode, showToast]);

    const goToStep = useCallback((step: number) => {
        if (step === 1 || step === 2) {
            setCurrentStep(step);
            return;
        }
        
        if (step === 3) {
            const isPF = formData.profileType === PROFILE_TYPE.PF;
            
            if (isPF) {
                if (!formData.name || !formData.email || !formData.cpf || (!formData.phone && !isAuthenticated) || errors.cpf || errors.email) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setCurrentStep(1);
                    return;
                }
            } else {
                if (!formData.name || !formData.email || !formData.cnpj || (!formData.phone && !isAuthenticated) || !formData.tradingName || !formData.stateRegistration) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setCurrentStep(1);
                    return;
                }
            }
            
            if (formData.phone && !validatePhoneField(formData.phone)) {
                showToast('Por favor, verifique o número de telefone', 'error');
                setCurrentStep(1);
                return;
            }
            
            if (!isAuthenticated && (!formData.password || !formData.confirmPassword)) {
                showToast('Por favor, preencha os campos de senha', 'error');
                setCurrentStep(1);
                return;
            }

            if (!formData.postalCode || !formData.number || !formData.street || !formData.state || !formData.city || !formData.neighborhood) {
                showToast('Por favor, preencha todos os campos de endereço', 'error');
                setCurrentStep(2);
                return;
            }
            
            setCurrentStep(step);
        }
    }, [formData, errors, isAuthenticated, showToast, validatePhoneField]);

    const registerUser = useCallback(async () => {
        if (!validatePasswordFields()) {
            showToast('Por favor, verifique as senhas informadas', 'error');
            return null;
        }

        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const userData = {
            profileType: ProfileType.PF,
            firstName,
            lastName,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf.replace(/\D/g, '')
        };

        try {
            const response = await register(userData);
            
            if (!response?.id) {
                showToast('Erro ao criar usuário', 'error');
                return null;
            }
            
            const token = getToken();
            if (token) {
                setCookie('jwt', token, { maxAge: 60 * 60 * 24 * 7 });
            }
            await refreshProfile();
            setIsAuthenticated(true);
            
            return response;
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            showToast('Erro ao criar usuário', 'error');
            return null;
        }
    }, [formData, validatePasswordFields, showToast, setCookie, refreshProfile]);

    const updateUserProfile = useCallback(async (profileId?: number) => {
        try {
            const profileUpdateData: any = {
                profile_type: formData.profileType === PROFILE_TYPE.PF ? 'PF' : 'PJ'
            };
            
            if (formData.profileType === PROFILE_TYPE.PF) {
                const nameParts = formData.name.trim().split(' ');
                profileUpdateData.cpf = formData.cpf.replace(/\D/g, '');
                profileUpdateData.firstName = nameParts[0] || '';
                profileUpdateData.lastName = nameParts.slice(1).join(' ') || '';
            } else {
                profileUpdateData.cnpj = formData.cnpj.replace(/\D/g, '');
                profileUpdateData.trading_name = formData.tradingName;
                profileUpdateData.state_registration = formData.stateRegistration;
            }
            
            if (profileId) profileUpdateData.profile_id = profileId;
            
            await updateProfile(profileUpdateData);
            return true;
        } catch (error) {
            console.error('Erro ao cadastrar dados de perfil:', error);
            showToast('Erro ao cadastrar dados de perfil', 'error');
            return false;
        }
    }, [formData, showToast]);

    const addUserPhone = useCallback(async (profileId: number) => {
        if (!formData.phone) return true;
        
        try {
            if (!validatePhoneField(formData.phone)) {
                throw new Error('Formato de telefone inválido');
            }
            
            await addPhone(formData.phone.replace(/\D/g, ''));
            return true;
        } catch (error: any) {
            console.error('Erro ao adicionar telefone:', error);
            showToast(`Erro ao adicionar telefone: ${error.message || 'Verifique o formato'}`, 'error');
            return false;
        }
    }, [formData.phone, validatePhoneField, showToast]);

    const addUserAddress = useCallback(async (profileId: number) => {
        try {
            await addAddress({
                street: formData.street,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                is_default: true,
                profile_id: profileId
            });
            return true;
        } catch (error) {
            console.error('Erro ao cadastrar endereço:', error);
            showToast('Erro ao cadastrar endereço', 'error');
            return false;
        }
    }, [formData, showToast]);

    const addUserCard = useCallback(async (profileId: number) => {
        if (maskedCard.isMasked) return true;
        if (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate) return false;
        
        try {
            await addCard({
                card_number: formData.cardNumber.replace(/\s/g, ''),
                holder_name: formData.name,
                expiration_date: formData.cardExpirationDate,
                cvv: formData.cardCVV,
                is_default: true,
                profile_id: profileId
            });
            
            setMaskedCard({
                isMasked: true,
                finalDigits: formData.cardNumber.slice(-4),
                cardHolder: formData.name,
                expiration: formData.cardExpirationDate
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao cadastrar cartão:', error);
            showToast('Erro ao cadastrar cartão', 'error');
            return false;
        }
    }, [formData, maskedCard.isMasked, showToast]);

    return {
        formData,
        updateField,
        errors,
        loadings,
        disabledFields,
        currentStep,
        goToStep,
        isAuthenticated,
        maskedCard,
        validateCPFOnServer,
        validateEmailOnServer,
        validatePhoneField,
        validatePasswordFields,
        fetchAddress,
        registerUser,
        updateUserProfile,
        addUserPhone,
        addUserAddress,
        addUserCard,
    };
};
