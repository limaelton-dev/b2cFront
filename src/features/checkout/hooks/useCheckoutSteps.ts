import { useState, useCallback } from 'react';
import { useToastSide } from '@/context/ToastSideProvider';
import { validateCPF, validatePhone, validatePasswords } from '../utils/validation';
import { checkEmailAvailability, checkCpfAvailability } from '@/api/user';
import { PROFILE_TYPE, CheckoutFormData } from './useCheckoutCustomer';

export type { CheckoutFormData } from './useCheckoutCustomer';

interface FormErrors {
    cpf: boolean;
    email: boolean;
    phone: boolean;
    phoneMessage: string;
    passwords: boolean;
    passwordsMessage: string;
}

const initialErrors: FormErrors = {
    cpf: false,
    email: false,
    phone: false,
    phoneMessage: '',
    passwords: false,
    passwordsMessage: ''
};

export function useCheckoutSteps(formData: CheckoutFormData, isAuthenticated: boolean) {
    const { showToast } = useToastSide();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [validatingCPF, setValidatingCPF] = useState(false);
    
    const checkCPFAvailabilityFn = useCallback(async (cpfValue: string) => {
        if (cpfValue.length !== 14 || !validateCPF(cpfValue)) {
            setErrors(prev => ({ ...prev, cpf: true }));
            return;
        }
        
        if (isAuthenticated) return;
        
        setValidatingCPF(true);
        try {
            const result = await checkCpfAvailability(cpfValue);
            setErrors(prev => ({ ...prev, cpf: !result.available }));
        } catch {
            setErrors(prev => ({ ...prev, cpf: false }));
        }
        setValidatingCPF(false);
    }, [isAuthenticated]);
    
    const checkEmailAvailabilityFn = useCallback(async () => {
        if (!formData.email || isAuthenticated) return;
        
        try {
            const result = await checkEmailAvailability(formData.email);
            setErrors(prev => ({ ...prev, email: !result.available }));
        } catch {
            setErrors(prev => ({ ...prev, email: false }));
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
    
    const canAdvanceToPayment = useCallback(() => {
        const isPF = formData.profileType === PROFILE_TYPE.PF;
        
        if (isPF) {
            if (!formData.name || !formData.email || !formData.cpf || (!formData.phone && !isAuthenticated) || errors.cpf || errors.email) {
                showToast('Preencha todos os campos de dados pessoais corretamente', 'error');
                setCurrentStep(1);
                return false;
            }
        } else {
            if (!formData.name || !formData.email || !formData.cnpj || (!formData.phone && !isAuthenticated) || !formData.tradingName || !formData.stateRegistration) {
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
        
        if (!isAuthenticated && (!formData.password || !formData.confirmPassword)) {
            showToast('Preencha os campos de senha', 'error');
            setCurrentStep(1);
            return false;
        }
        
        if (!formData.postalCode || !formData.number || !formData.street || !formData.state || !formData.city || !formData.neighborhood) {
            showToast('Preencha todos os campos de endereço', 'error');
            setCurrentStep(2);
            return false;
        }
        
        return true;
    }, [formData, errors, isAuthenticated, showToast, validatePhoneField]);
    
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
        validatePhoneField,
        validatePasswordFields
    };
}

