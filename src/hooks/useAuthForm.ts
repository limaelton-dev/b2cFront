import { useState, useCallback } from 'react';

export interface AuthFormData {
    [key: string]: string;
}

export interface AuthFormErrors {
    [key: string]: boolean;
}

export function useAuthForm<T extends AuthFormData>(initialData: T) {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<AuthFormErrors>({});
    const [errorMessage, setErrorMessage] = useState('');

    const updateField = useCallback((name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    }, [errors]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateField(name, value);
    }, [updateField]);

    const validateFields = useCallback((requiredFields: string[]): boolean => {
        const newErrors: AuthFormErrors = {};
        let hasError = false;

        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = true;
                hasError = true;
            }
        });

        setErrors(newErrors);
        
        if (hasError) {
            setErrorMessage('Por favor, preencha todos os campos obrigatórios!');
        }

        return !hasError;
    }, [formData]);

    const validatePasswordMatch = useCallback((password: string, confirmPassword: string): boolean => {
        if (password !== confirmPassword) {
            setErrorMessage('As senhas não condizem.\nPor favor, preencha corretamente.');
            return false;
        }
        return true;
    }, []);

    const clearError = useCallback(() => {
        setErrorMessage('');
    }, []);

    const setFieldError = useCallback((field: string, hasError: boolean) => {
        setErrors(prev => ({ ...prev, [field]: hasError }));
    }, []);

    const reset = useCallback(() => {
        setFormData(initialData);
        setErrors({});
        setErrorMessage('');
    }, [initialData]);

    return {
        formData,
        errors,
        errorMessage,
        handleChange,
        updateField,
        validateFields,
        validatePasswordMatch,
        setErrorMessage,
        clearError,
        setFieldError,
        reset
    };
}

