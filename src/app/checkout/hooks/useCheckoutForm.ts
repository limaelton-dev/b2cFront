"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useToastSide } from '../../context/toastSide';
import { useRouter } from 'next/navigation';
import { validateCPF, validatePhone, validatePasswords } from '../utils/validation';
import { fetchAddressByCEP } from '../utils/address';
import { getProfileUser, getUserPersonalData } from '../../services/profile';
import { 
    addAddress, 
    addPhone, 
    addCard, 
    updateProfile 
} from '../../minhaconta/services/userAccount';
import { cpfValidation, emailVerify } from '../../services/checkout';
import { register } from '../../services/auth';
import { useCookies } from 'react-cookie';
import { saveToken } from '../../utils/auth';

/**
 * Interface para os dados do formulário
 */
export interface CheckoutFormData {
    // Dados pessoais
    profileType: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
    confirmPassword: string;
    
    // Dados de Pessoa Jurídica
    cnpj: string;
    tradingName: string;
    stateRegistration: string;
    
    // Endereço
    postalCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    
    // Pagamento
    paymentMethod: string;
    cardNumber: string;
    cardExpirationDate: string;
    cardCVV: string;
    saveCard: boolean;
    companyPurchaseAuthorization: boolean;
    
    // Controles
    receiveOffers: boolean;
    acceptPrivacyPolicy: boolean;
}

/**
 * Interface para as flags de erro
 */
export interface FormErrors {
    cpf: boolean;
    email: boolean;
    phone: boolean;
    phoneMessage: string;
    passwords: boolean;
    passwordsMessage: string;
}

/**
 * Interface para os estados de desabilitação dos campos
 */
export interface DisabledFields {
    user: boolean;
    personalPF: boolean;
    personalPJ: boolean;
    address: boolean;
}

/**
 * Hook para gerenciar o formulário de checkout
 */
export const useCheckoutForm = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { user, setUserFn } = useAuth();
    const [cookies, setCookie] = useCookies(['jwt']);
    
    // Dados do formulário
    const [formData, setFormData] = useState<CheckoutFormData>({
        profileType: '1',
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
        paymentMethod: '1',
        cardNumber: '',
        cardExpirationDate: '',
        cardCVV: '',
        saveCard: false,
        companyPurchaseAuthorization: false,
        receiveOffers: false,
        acceptPrivacyPolicy: false
    });
    
    // Estados de erro
    const [errors, setErrors] = useState<FormErrors>({
        cpf: false,
        email: false,
        phone: false,
        phoneMessage: '',
        passwords: false,
        passwordsMessage: ''
    });
    
    // Estados de loading
    const [loadings, setLoadings] = useState({
        form: false,
        personalData: false,
        cep: false,
        submit: false
    });
    
    // Estados de campos desabilitados
    const [disabledFields, setDisabledFields] = useState<DisabledFields>({
        user: false,
        personalPF: false,
        personalPJ: false,
        address: false
    });
    
    // Estado de autenticação
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Estado de etapa atual
    const [currentStep, setCurrentStep] = useState(1);
    
    // Estado de cartão mascarado (já cadastrado)
    const [maskedCard, setMaskedCard] = useState({
        isMasked: false,
        finalDigits: '',
        cardHolder: '',
        expiration: ''
    });

    // Efeito para carregar dados do usuário quando logado
    useEffect(() => {
        if (user && user.id) {
            setIsAuthenticated(true);
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
            setDisabledFields(prev => ({
                ...prev,
                user: true
            }));
            
            loadUserProfile();
        }
    }, [user]);

    /**
     * Carrega o perfil completo do usuário logado
     */
    const loadUserProfile = async () => {
        if (!user || !user.id) return;
        
        setLoadings(prev => ({ ...prev, form: true }));
        
        try {
            const profileData = await getProfileUser();
            const userData = await getUserPersonalData();
            
            if (profileData) {
                // Configurar tipo de perfil
                if (profileData.profile_type === 'PF') {
                    setFormData(prev => ({
                        ...prev,
                        profileType: '1',
                        cpf: profileData.cpf || ''
                    }));
                    
                    setDisabledFields(prev => ({
                        ...prev,
                        personalPF: !!profileData.cpf
                    }));
                } else if (profileData.profile_type === 'PJ') {
                    setFormData(prev => ({
                        ...prev,
                        profileType: '2',
                        cnpj: profileData.cnpj || '',
                        tradingName: profileData.trading_name || '',
                        stateRegistration: profileData.state_registration || ''
                    }));
                    
                    const hasPJData = profileData.cnpj && 
                                     profileData.trading_name && 
                                     profileData.state_registration;
                    
                    setDisabledFields(prev => ({
                        ...prev,
                        personalPJ: !!hasPJData
                    }));
                }
                
                // Configurar telefone se disponível
                if (userData && userData.phones && userData.phones.length > 0) {
                    const primaryPhone = userData.phones.find(phone => phone.is_primary) || userData.phones[0];
                    if (primaryPhone) {
                        const phoneNumber = primaryPhone.number;
                        const formattedPhone = phoneNumber.length === 11 
                            ? `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`
                            : phoneNumber.length === 10 
                                ? `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6)}`
                                : phoneNumber;
                        
                        setFormData(prev => ({
                            ...prev,
                            phone: formattedPhone
                        }));
                    }
                }
                
                // Configurar endereço se disponível
                if (profileData.addresses && profileData.addresses.length > 0) {
                    const address = profileData.addresses[0];
                    
                    setFormData(prev => ({
                        ...prev,
                        postalCode: address.postal_code || '',
                        street: address.street || '',
                        number: address.number || '',
                        complement: address.complement || '',
                        neighborhood: address.neighborhood || '',
                        city: address.city || '',
                        state: address.state || ''
                    }));
                    
                    const isAddressComplete = address.street && 
                                            address.neighborhood && 
                                            address.city && 
                                            address.state && 
                                            address.postal_code && 
                                            address.number;
                    
                    setDisabledFields(prev => ({
                        ...prev,
                        address: !!isAddressComplete
                    }));
                }
                
                // Configurar cartão se disponível
                if (profileData.cards && profileData.cards.length > 0) {
                    const card = profileData.cards[0];
                    const lastFourDigits = card.card_number.slice(-4);
                    
                    setMaskedCard({
                        isMasked: true,
                        finalDigits: lastFourDigits,
                        cardHolder: card.holder_name,
                        expiration: card.expiration_date
                    });
                    
                    setFormData(prev => ({
                        ...prev,
                        cardNumber: `XXXX XXXX XXXX ${lastFourDigits}`,
                        cardExpirationDate: 'XX/XX',
                        cardCVV: 'XXX'
                    }));
                }
            }
        } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
        } finally {
            setLoadings(prev => ({ ...prev, form: false }));
        }
    };

    /**
     * Atualiza um campo do formulário
     */
    const updateField = (field: keyof CheckoutFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Valida o CPF no servidor
     */
    const validateCPFOnServer = async (cpfValue: string) => {
        if (cpfValue.length !== 14) return;
        
        const isValidFormat = validateCPF(cpfValue);
        if (!isValidFormat) {
            setErrors(prev => ({ ...prev, cpf: true }));
            return;
        }
        
        // Não validar no servidor se já está autenticado
        if (isAuthenticated) return;
        
        setLoadings(prev => ({ ...prev, personalData: true }));
        
        try {
            const response = await cpfValidation(cpfValue);
            setErrors(prev => ({ ...prev, cpf: response.status === 409 }));
        } catch (error) {
            setErrors(prev => ({ ...prev, cpf: true }));
        } finally {
            setLoadings(prev => ({ ...prev, personalData: false }));
        }
    };

    /**
     * Valida o email no servidor
     */
    const validateEmailOnServer = async () => {
        if (!formData.email || isAuthenticated) return;
        
        try {
            const response = await emailVerify(formData.email);
            setErrors(prev => ({ ...prev, email: response.status === 409 }));
        } catch (error) {
            setErrors(prev => ({ ...prev, email: true }));
        }
    };

    /**
     * Valida o telefone
     */
    const validatePhoneField = (phoneValue: string) => {
        const result = validatePhone(phoneValue);
        setErrors(prev => ({
            ...prev,
            phone: !result.isValid,
            phoneMessage: result.errorMessage
        }));
        return result.isValid;
    };

    /**
     * Valida as senhas
     */
    const validatePasswordFields = () => {
        const result = validatePasswords(formData.password, formData.confirmPassword);
        setErrors(prev => ({
            ...prev,
            passwords: !result.isValid,
            passwordsMessage: result.errorMessage
        }));
        return result.isValid;
    };

    /**
     * Busca endereço pelo CEP
     */
    const fetchAddress = async () => {
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
        } catch (error) {
            showToast('Erro ao buscar o endereço', 'error');
        } finally {
            setLoadings(prev => ({ ...prev, cep: false }));
        }
    };

    /**
     * Navega entre etapas do checkout
     */
    const goToStep = (step: number) => {
        // Permite navegação livre entre etapas 1 e 2
        if (step === 1 || step === 2) {
            setCurrentStep(step);
            return;
        }
        
        // Se estiver tentando acessar o pagamento (etapa 3), validar todos os campos necessários
        if (step === 3) {
            // Validar Dados Pessoais (etapa 1)
            if (formData.profileType === '1') {
                // Verificando se há campos vazios ou se há erros nos dados
                if(!formData.name || !formData.email || !formData.cpf || (!formData.phone && !isAuthenticated) || errors.cpf || errors.email) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setCurrentStep(1); // Redireciona para etapa 1 para corrigir
                    return;
                }
                
                // Validar o telefone apenas se foi preenchido ou se o usuário não está autenticado
                if(formData.phone && !validatePhoneField(formData.phone)) {
                    showToast('Por favor, verifique o número de telefone', 'error');
                    setCurrentStep(1);
                    return;
                }
                
                if(!isAuthenticated && (!formData.password || !formData.confirmPassword)) {
                    showToast('Por favor, preencha os campos de senha', 'error');
                    setCurrentStep(1);
                    return;
                }
            } else {
                if(!formData.name || !formData.email || !formData.cnpj || (!formData.phone && !isAuthenticated) || !formData.tradingName || !formData.stateRegistration) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setCurrentStep(1);
                    return;
                }
                
                // Validar o telefone apenas se foi preenchido ou se o usuário não está autenticado
                if(formData.phone && !validatePhoneField(formData.phone)) {
                    showToast('Por favor, verifique o número de telefone', 'error');
                    setCurrentStep(1);
                    return;
                }
                
                if(!isAuthenticated && (!formData.password || !formData.confirmPassword)) {
                    showToast('Por favor, preencha os campos de senha', 'error');
                    setCurrentStep(1);
                    return;
                }
            }

            // Validar Endereço (etapa 2)
            if(!formData.postalCode || !formData.number || !formData.street || !formData.state || !formData.city || !formData.neighborhood) {
                showToast('Por favor, preencha todos os campos de endereço', 'error');
                setCurrentStep(2); // Redireciona para etapa 2 para corrigir
                return;
            }
            
            // Se passou por todas as validações, avançar para pagamento
            setCurrentStep(step);
        }
    };

    /**
     * Registra um novo usuário
     */
    const registerUser = async () => {
        if (!validatePasswordFields()) {
            showToast('Por favor, verifique as senhas informadas', 'error');
            return null;
        }

        const arrName = formData.name.split(" ");
        const userData = {
            name: arrName[0],
            lastname: arrName.length > 1 ? arrName[arrName.length - 1] : '',
            username: arrName[0].toLowerCase() + (Math.floor(Math.random() * 1000) + 1),
            email: formData.email,
            password: formData.password,
            repassword: formData.confirmPassword
        };

        try {
            const registerResponse = await register(userData);
            
            if (!registerResponse || !registerResponse.token) {
                showToast('Erro ao criar usuário', 'error');
                return null;
            }
            
            // Salvar o token JWT nos cookies
            saveToken(registerResponse.token);
            setCookie('jwt', registerResponse.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 dias

            // Atualizar o contexto de autenticação
            setUserFn({
                id: registerResponse.user.id,
                name: registerResponse.user.name,
                email: registerResponse.user.email
            });
            
            // Salvar dados do usuário no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify({
                    id: registerResponse.user.id,
                    name: registerResponse.user.name,
                    email: registerResponse.user.email
                }));
            }
            
            setIsAuthenticated(true);
            
            return registerResponse;
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            showToast('Erro ao criar usuário', 'error');
            return null;
        }
    };

    /**
     * Cadastra dados de perfil do usuário (PF ou PJ)
     */
    const updateUserProfile = async (profileId?: number) => {
        try {
            let profileUpdateData: any = {
                profile_type: formData.profileType === '1' ? 'PF' : 'PJ'
            };
            
            // Adicionar dados específicos com base no tipo de pessoa
            if (formData.profileType === '1') {
                // Pessoa Física
                profileUpdateData.cpf = formData.cpf.replace(/\D/g, '');
                profileUpdateData.full_name = formData.name;
            } else {
                // Pessoa Jurídica
                profileUpdateData.cnpj = formData.cnpj.replace(/\D/g, '');
                profileUpdateData.trading_name = formData.tradingName;
                profileUpdateData.state_registration = formData.stateRegistration;
            }
            
            // Se fornecido, adicionar o ID do perfil
            if (profileId) {
                profileUpdateData.profile_id = profileId;
            }
            
            // Atualizar perfil
            await updateProfile(profileUpdateData);
            return true;
        } catch (error) {
            console.error('Erro ao cadastrar dados de perfil:', error);
            showToast('Erro ao cadastrar dados de perfil', 'error');
            return false;
        }
    };

    /**
     * Cadastra telefone do usuário
     */
    const addUserPhone = async (profileId: number) => {
        if (!formData.phone) return true;
        
        try {
            // Validar telefone novamente antes de cadastrar
            if (!validatePhoneField(formData.phone)) {
                throw new Error('Formato de telefone inválido');
            }
            
            const phoneNumber = formData.phone.replace(/\D/g, '');
            
            // Usar a assinatura correta da função addPhone
            await addPhone(phoneNumber);
            return true;
        } catch (error) {
            console.error('Erro ao adicionar telefone:', error);
            showToast('Erro ao adicionar telefone: ' + (error.message || 'Verifique o formato'), 'error');
            return false;
        }
    };

    /**
     * Cadastra endereço do usuário
     */
    const addUserAddress = async (profileId: number) => {
        try {
            const addressData = {
                street: formData.street,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postalCode,
                is_default: true,
                profile_id: profileId
            };
            
            await addAddress(addressData);
            return true;
        } catch (error) {
            console.error('Erro ao cadastrar endereço:', error);
            showToast('Erro ao cadastrar endereço', 'error');
            return false;
        }
    };

    /**
     * Cadastra cartão do usuário
     */
    const addUserCard = async (profileId: number) => {
        // Se já tiver cartão mascarado, não precisa cadastrar novamente
        if (maskedCard.isMasked) return true;
        
        // Verificar se preencheu os dados do cartão
        if (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate) {
            return false;
        }
        
        try {
            const cardData = {
                card_number: formData.cardNumber.replace(/\s/g, ''),
                holder_name: formData.name,
                expiration_date: formData.cardExpirationDate,
                cvv: formData.cardCVV,
                is_default: true,
                profile_id: profileId
            };
            
            await addCard(cardData);
            
            // Atualizar estado do cartão mascarado
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
    };

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