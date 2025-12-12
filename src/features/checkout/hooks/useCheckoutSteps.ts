import { useState, useCallback } from 'react';
import { useToastSide } from '@/context/ToastSideProvider';
import { 
    validateCPF, validateCNPJ, validatePhone, validatePasswords, validateEmail, validateBirthDate,
    validateCardNumber, validateCardExpiration, validateCVV, validateCardHolderName, validateCardHolderDocument,
    CardBrand
} from '../utils/validation';
import { checkEmailAvailability, checkCpfAvailability } from '@/api/user';
import { PROFILE_TYPE, PAYMENT_METHOD, CheckoutFormData } from './useCheckoutCustomer';

export type { CheckoutFormData } from './useCheckoutCustomer';

interface FormErrors {
    cpf: boolean;
    cpfMessage: string;
    cnpj: boolean;
    cnpjMessage: string;
    email: boolean;
    emailMessage: string;
    phone: boolean;
    phoneMessage: string;
    passwords: boolean;
    passwordsMessage: string;
    birthDate: boolean;
    birthDateMessage: string;
    address: {
        postalCode: boolean;
        street: boolean;
        number: boolean;
        neighborhood: boolean;
        city: boolean;
        state: boolean;
    };
    card: {
        number: boolean;
        numberMessage: string;
        expiration: boolean;
        expirationMessage: string;
        cvv: boolean;
        cvvMessage: string;
        holderName: boolean;
        holderNameMessage: string;
        holderDocument: boolean;
        holderDocumentMessage: string;
        brand: CardBrand;
    };
}

const initialErrors: FormErrors = {
    cpf: false,
    cpfMessage: '',
    cnpj: false,
    cnpjMessage: '',
    email: false,
    emailMessage: '',
    phone: false,
    phoneMessage: '',
    passwords: false,
    passwordsMessage: '',
    birthDate: false,
    birthDateMessage: '',
    address: {
        postalCode: false,
        street: false,
        number: false,
        neighborhood: false,
        city: false,
        state: false
    },
    card: {
        number: false,
        numberMessage: '',
        expiration: false,
        expirationMessage: '',
        cvv: false,
        cvvMessage: '',
        holderName: false,
        holderNameMessage: '',
        holderDocument: false,
        holderDocumentMessage: '',
        brand: 'unknown'
    }
};

export function useCheckoutSteps(formData: CheckoutFormData, isAuthenticated: boolean) {
    const { showToast } = useToastSide();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [validatingCPF, setValidatingCPF] = useState(false);
    
    const checkCPFAvailabilityFn = useCallback(async (cpfValue: string) => {
        if (cpfValue.length !== 14) {
            setErrors(prev => ({ ...prev, cpf: true, cpfMessage: 'CPF incompleto' }));
            return;
        }
        
        if (!validateCPF(cpfValue)) {
            setErrors(prev => ({ ...prev, cpf: true, cpfMessage: 'CPF inválido' }));
            return;
        }
        
        if (isAuthenticated) {
            setErrors(prev => ({ ...prev, cpf: false, cpfMessage: '' }));
            return;
        }
        
        setValidatingCPF(true);
        try {
            const result = await checkCpfAvailability(cpfValue);
            setErrors(prev => ({ 
                ...prev, 
                cpf: !result.available, 
                cpfMessage: result.available ? '' : 'CPF já cadastrado' 
            }));
        } catch {
            setErrors(prev => ({ ...prev, cpf: false, cpfMessage: '' }));
        }
        setValidatingCPF(false);
    }, [isAuthenticated]);
    
    const validateCNPJField = useCallback((cnpjValue: string) => {
        if (cnpjValue.length !== 18) {
            setErrors(prev => ({ ...prev, cnpj: true, cnpjMessage: 'CNPJ incompleto' }));
            return false;
        }
        
        if (!validateCNPJ(cnpjValue)) {
            setErrors(prev => ({ ...prev, cnpj: true, cnpjMessage: 'CNPJ inválido' }));
            return false;
        }
        
        setErrors(prev => ({ ...prev, cnpj: false, cnpjMessage: '' }));
        return true;
    }, []);
    
    const validateEmailField = useCallback((email: string) => {
        const result = validateEmail(email);
        setErrors(prev => ({ ...prev, email: !result.isValid, emailMessage: result.errorMessage }));
        return result.isValid;
    }, []);
    
    const checkEmailAvailabilityFn = useCallback(async () => {
        if (!formData.email) return;
        
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            setErrors(prev => ({ ...prev, email: true, emailMessage: emailValidation.errorMessage }));
            return;
        }
        
        if (isAuthenticated) {
            setErrors(prev => ({ ...prev, email: false, emailMessage: '' }));
            return;
        }
        
        try {
            const result = await checkEmailAvailability(formData.email);
            setErrors(prev => ({ 
                ...prev, 
                email: !result.available, 
                emailMessage: result.available ? '' : 'Email já cadastrado' 
            }));
        } catch {
            setErrors(prev => ({ ...prev, email: false, emailMessage: '' }));
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
    
    const validateBirthDateField = useCallback((birthDateValue: string) => {
        const result = validateBirthDate(birthDateValue);
        setErrors(prev => ({ ...prev, birthDate: !result.isValid, birthDateMessage: result.errorMessage }));
        return result.isValid;
    }, []);
    
    const validateAddressFields = useCallback(() => {
        const addressErrors = {
            postalCode: !formData.postalCode || formData.postalCode.replace(/\D/g, '').length !== 8,
            street: !formData.street,
            number: !formData.number,
            neighborhood: !formData.neighborhood,
            city: !formData.city,
            state: !formData.state
        };
        
        setErrors(prev => ({ ...prev, address: addressErrors }));
        
        return !Object.values(addressErrors).some(Boolean);
    }, [formData.postalCode, formData.street, formData.number, formData.neighborhood, formData.city, formData.state]);
    
    const validateCardNumberField = useCallback((cardNumber: string) => {
        const result = validateCardNumber(cardNumber);
        setErrors(prev => ({ 
            ...prev, 
            card: { 
                ...prev.card, 
                number: !result.isValid, 
                numberMessage: result.errorMessage,
                brand: result.brand
            } 
        }));
        return result.isValid;
    }, []);
    
    const validateCardExpirationField = useCallback((expiration: string) => {
        const result = validateCardExpiration(expiration);
        setErrors(prev => ({ 
            ...prev, 
            card: { ...prev.card, expiration: !result.isValid, expirationMessage: result.errorMessage } 
        }));
        return result.isValid;
    }, []);
    
    const validateCardCVVField = useCallback((cvv: string, cardNumber: string) => {
        const result = validateCVV(cvv, cardNumber);
        setErrors(prev => ({ 
            ...prev, 
            card: { ...prev.card, cvv: !result.isValid, cvvMessage: result.errorMessage } 
        }));
        return result.isValid;
    }, []);
    
    const validateCardHolderNameField = useCallback((name: string) => {
        const result = validateCardHolderName(name);
        setErrors(prev => ({ 
            ...prev, 
            card: { ...prev.card, holderName: !result.isValid, holderNameMessage: result.errorMessage } 
        }));
        return result.isValid;
    }, []);
    
    const validateCardHolderDocumentField = useCallback((document: string) => {
        const result = validateCardHolderDocument(document);
        setErrors(prev => ({ 
            ...prev, 
            card: { ...prev.card, holderDocument: !result.isValid, holderDocumentMessage: result.errorMessage } 
        }));
        return result.isValid;
    }, []);
    
    const validateAllCardFields = useCallback((isMaskedCard: boolean) => {
        if (formData.paymentMethod !== PAYMENT_METHOD.CREDIT_CARD) return true;
        
        if (isMaskedCard) {
            const cvvResult = validateCVV(formData.cardCVV, formData.cardNumber);
            setErrors(prev => ({ 
                ...prev, 
                card: { ...prev.card, cvv: !cvvResult.isValid, cvvMessage: cvvResult.errorMessage } 
            }));
            return cvvResult.isValid;
        }
        
        const numberResult = validateCardNumber(formData.cardNumber);
        const expirationResult = validateCardExpiration(formData.cardExpirationDate);
        const cvvResult = validateCVV(formData.cardCVV, formData.cardNumber);
        const holderNameResult = validateCardHolderName(formData.cardHolderName);
        const holderDocResult = validateCardHolderDocument(formData.cardHolderDocument);
        
        setErrors(prev => ({
            ...prev,
            card: {
                number: !numberResult.isValid,
                numberMessage: numberResult.errorMessage,
                expiration: !expirationResult.isValid,
                expirationMessage: expirationResult.errorMessage,
                cvv: !cvvResult.isValid,
                cvvMessage: cvvResult.errorMessage,
                holderName: !holderNameResult.isValid,
                holderNameMessage: holderNameResult.errorMessage,
                holderDocument: !holderDocResult.isValid,
                holderDocumentMessage: holderDocResult.errorMessage,
                brand: numberResult.brand
            }
        }));
        
        return numberResult.isValid && expirationResult.isValid && cvvResult.isValid && holderNameResult.isValid && holderDocResult.isValid;
    }, [formData.paymentMethod, formData.cardNumber, formData.cardExpirationDate, formData.cardCVV, formData.cardHolderName, formData.cardHolderDocument]);
    
    const canAdvanceToPayment = useCallback(() => {
        const isPF = formData.profileType === PROFILE_TYPE.PF;
        
        if (isPF) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.cpf || (!formData.phone && !isAuthenticated) || errors.cpf || errors.email) {
                showToast('Preencha todos os campos de dados pessoais corretamente', 'error');
                setCurrentStep(1);
                return false;
            }
        } else {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.cnpj || (!formData.phone && !isAuthenticated) || !formData.tradingName || !formData.stateRegistration || errors.cnpj) {
                showToast('Preencha todos os campos de dados pessoais corretamente', 'error');
                setCurrentStep(1);
                return false;
            }
        }
        
        if (formData.phone && !validatePhoneField(formData.phone)) {
            showToast('Verifique o número de telefone', 'error');
            setCurrentStep(1);
            return false;
        }
        
        if (!isAuthenticated) {
            if (!formData.password || !formData.confirmPassword) {
                showToast('Preencha os campos de senha', 'error');
                setCurrentStep(1);
                return false;
            }
            
            const passwordValidation = validatePasswords(formData.password, formData.confirmPassword);
            if (!passwordValidation.isValid) {
                showToast(passwordValidation.errorMessage, 'error');
                setErrors(prev => ({ ...prev, passwords: true, passwordsMessage: passwordValidation.errorMessage }));
                setCurrentStep(1);
                return false;
            }
            
            if (isPF) {
                const birthDateValidation = validateBirthDate(formData.birthDate);
                if (!birthDateValidation.isValid) {
                    showToast(birthDateValidation.errorMessage, 'error');
                    setErrors(prev => ({ ...prev, birthDate: true, birthDateMessage: birthDateValidation.errorMessage }));
                    setCurrentStep(1);
                    return false;
                }
            }
        }
        
        if (!formData.acceptPrivacyPolicy) {
            showToast('Você precisa aceitar a Política de Privacidade para continuar', 'error');
            setCurrentStep(1);
            return false;
        }
        
        if (!validateAddressFields()) {
            showToast('Preencha todos os campos de endereço', 'error');
            setCurrentStep(2);
            return false;
        }
        
        return true;
    }, [formData, errors, isAuthenticated, showToast, validatePhoneField, validateAddressFields]);
    
    const goToStep = useCallback((step: number) => {
        if (step === 1 || step === 2) {
            setCurrentStep(step);
            return;
        }
        
        if (step === 3 && canAdvanceToPayment()) {
            setCurrentStep(step);
        }
    }, [canAdvanceToPayment]);
    
    return {
        currentStep,
        goToStep,
        errors,
        validatingCPF,
        checkCPFAvailability: checkCPFAvailabilityFn,
        checkEmailAvailability: checkEmailAvailabilityFn,
        validateEmailField,
        validatePhoneField,
        validatePasswordFields,
        validateBirthDateField,
        validateCNPJField,
        validateAddressFields,
        validateCardNumberField,
        validateCardExpirationField,
        validateCardCVVField,
        validateCardHolderNameField,
        validateCardHolderDocumentField,
        validateAllCardFields
    };
}

