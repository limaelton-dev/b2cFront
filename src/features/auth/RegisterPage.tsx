"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';

import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RegisterRequest } from '@/api/auth';

import { AuthLayout } from './components/AuthLayout';
import { AuthButton } from './components/AuthButton';
import { AuthFormField } from './components/AuthFormField';
import { ErrorMessage } from './components/ErrorMessage';

export default function RegisterPage() {
    const router = useRouter();
    const { register, loading } = useAuth();
    const { showToast } = useToastSide();
    const [profileType, setProfileType] = useState<'PF' | 'PJ'>('PF');

    const {
        formData,
        errors,
        errorMessage,
        handleChange,
        validateFields,
        validatePasswordMatch,
        setErrorMessage,
        clearError
    } = useAuthForm({
        email: '',
        password: '',
        repassword: '',
        fullName: '',
        cpf: '',
        birthDate: '',
        gender: '',
        companyName: '',
        cnpj: '',
        tradingName: '',
        stateRegistration: '',
        municipalRegistration: ''
    });

    const handleProfileTypeChange = (type: 'PF' | 'PJ') => {
        setProfileType(type);
        clearError();
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clearError();

        const requiredFields = profileType === 'PF'
            ? ['email', 'password', 'repassword', 'fullName', 'cpf']
            : ['email', 'password', 'repassword', 'companyName', 'cnpj'];

        if (!validateFields(requiredFields)) {
            return;
        }

        if (!validatePasswordMatch(formData.password, formData.repassword)) {
            return;
        }

        if (profileType === 'PF' && !formData.fullName.trim().includes(' ')) {
            setErrorMessage('Por favor, informe nome e sobrenome.');
            return;
        }

        try {
            const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
            const lastName = lastNameParts.join(' ');
            
            const payload: RegisterRequest = profileType === 'PF'
                ? {
                    email: formData.email,
                    password: formData.password,
                    profileType: 'PF',
                    profile: {
                        firstName,
                        lastName,
                        cpf: formData.cpf,
                        birthDate: formData.birthDate || new Date().toISOString().split('T')[0],
                        gender: formData.gender || null
                    }
                }
                : {
                    email: formData.email,
                    password: formData.password,
                    profileType: 'PJ',
                    profile: {
                        companyName: formData.companyName,
                        cnpj: formData.cnpj,
                        tradingName: formData.tradingName || undefined,
                        stateRegistration: formData.stateRegistration || undefined,
                        municipalRegistration: formData.municipalRegistration || undefined
                    }
                };

            await register(payload);
            
            showToast('Você se cadastrou com sucesso!', 'success');
            router.push('/');
        } catch (error: any) {
            console.error('Erro durante o cadastro:', error);
            setErrorMessage(error?.message || 'Houve um erro ao criar usuário');
        }
    };

    return (
        <AuthLayout>
            <form id="form-login" style={{width: '100%'}} method="POST">
                <ErrorMessage message={errorMessage} />
                
                <div className="form-group text-center mb-4">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${profileType === 'PF' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => handleProfileTypeChange('PF')}
                        >
                            Pessoa Física
                        </button>
                        <button
                            type="button"
                            className={`btn ${profileType === 'PJ' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => handleProfileTypeChange('PJ')}
                        >
                            Pessoa Jurídica
                        </button>
                    </div>
                </div>
                
                <AuthFormField
                    icon={<AlternateEmailIcon />}
                    type="text"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />
                
                <AuthFormField
                    icon={<KeyIcon />}
                    type="password"
                    name="password"
                    placeholder="Senha*"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                
                <AuthFormField
                    icon={<KeyIcon />}
                    type="password"
                    name="repassword"
                    placeholder="Repita novamente a senha*"
                    value={formData.repassword}
                    onChange={handleChange}
                    error={errors.repassword}
                    required
                />
                
                {profileType === 'PF' && (
                    <>
                        <AuthFormField
                            icon={<PersonIcon />}
                            type="text"
                            name="fullName"
                            placeholder="Nome e sobrenome*"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            required
                        />
                        
                        <AuthFormField
                            icon={<BadgeIcon />}
                            type="text"
                            name="cpf"
                            placeholder="CPF*"
                            value={formData.cpf}
                            onChange={handleChange}
                            error={errors.cpf}
                            required
                        />
                        
                        <AuthFormField
                            icon={<CalendarTodayIcon />}
                            type="date"
                            name="birthDate"
                            placeholder="Data de Nascimento"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                        
                        <div className="form-group icons-inputs">
                            <div style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }}>
                                <WcIcon />
                            </div>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-control"
                                style={{ paddingLeft: '45px' }}
                            >
                                <option value="">Selecione o gênero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                                <option value="Prefiro não informar">Prefiro não informar</option>
                            </select>
                        </div>
                    </>
                )}
                
                {profileType === 'PJ' && (
                    <>
                        <AuthFormField
                            icon={<BusinessIcon />}
                            type="text"
                            name="companyName"
                            placeholder="Razão Social*"
                            value={formData.companyName}
                            onChange={handleChange}
                            error={errors.companyName}
                            required
                        />
                        
                        <AuthFormField
                            icon={<BadgeIcon />}
                            type="text"
                            name="cnpj"
                            placeholder="CNPJ*"
                            value={formData.cnpj}
                            onChange={handleChange}
                            error={errors.cnpj}
                            required
                        />
                        
                        <AuthFormField
                            icon={<BusinessIcon />}
                            type="text"
                            name="tradingName"
                            placeholder="Nome Fantasia"
                            value={formData.tradingName}
                            onChange={handleChange}
                        />
                        
                        <AuthFormField
                            icon={<BadgeIcon />}
                            type="text"
                            name="stateRegistration"
                            placeholder="Inscrição Estadual"
                            value={formData.stateRegistration}
                            onChange={handleChange}
                        />
                        
                        <AuthFormField
                            icon={<BadgeIcon />}
                            type="text"
                            name="municipalRegistration"
                            placeholder="Inscrição Municipal"
                            value={formData.municipalRegistration}
                            onChange={handleChange}
                        />
                    </>
                )}
                
                <AuthButton loading={loading} onClick={handleSubmit}>
                    Cadastrar
                </AuthButton>
                
                <a href="/login" id="change-login">
                    Já tem uma conta? Logue aqui
                </a>
            </form>
        </AuthLayout>
    );
}
