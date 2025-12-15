'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, Alert, Collapse } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import BusinessIcon from '@mui/icons-material/Business';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RegisterRequest } from '@/api/auth';

import { AuthLayout } from './components/AuthLayout';
import AuthTextField from './components/AuthTextField';
import AuthSelect from './components/AuthSelect';
import ProfileTypeSelector from './components/ProfileTypeSelector';

const THEME_COLOR = '#252d5f';

const GENDER_OPTIONS = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
    { value: 'Prefiro não informar', label: 'Prefiro não informar' },
];

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
        clearError,
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
        municipalRegistration: '',
    });

    const handleProfileTypeChange = (type: 'PF' | 'PJ') => {
        setProfileType(type);
        clearError();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                        gender: formData.gender || null,
                    },
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
                        municipalRegistration: formData.municipalRegistration || undefined,
                    },
                };

            await register(payload);
            showToast('Você se cadastrou com sucesso!', 'success');
            router.push('/');
        } catch (error: any) {
            setErrorMessage(error?.message || 'Houve um erro ao criar usuário');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        if (errorMessage) clearError();
    };

    return (
        <AuthLayout title="Criar conta" subtitle="Preencha os dados para se cadastrar">
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <ProfileTypeSelector value={profileType} onChange={handleProfileTypeChange} />

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <AuthTextField
                    icon={<AlternateEmailIcon />}
                    type="email"
                    name="email"
                    label="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    autoComplete="email"
                />

                <AuthTextField
                    icon={<LockIcon />}
                    type="password"
                    name="password"
                    label="Senha *"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    autoComplete="new-password"
                />

                <AuthTextField
                    icon={<LockIcon />}
                    type="password"
                    name="repassword"
                    label="Confirmar senha *"
                    value={formData.repassword}
                    onChange={handleInputChange}
                    error={errors.repassword}
                    autoComplete="new-password"
                />

                <Collapse in={profileType === 'PF'}>
                    <Box>
                        <AuthTextField
                            icon={<PersonIcon />}
                            type="text"
                            name="fullName"
                            label="Nome completo *"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            error={errors.fullName}
                            autoComplete="name"
                        />

                        <AuthTextField
                            icon={<BadgeIcon />}
                            type="text"
                            name="cpf"
                            label="CPF *"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            error={errors.cpf}
                        />

                        <AuthTextField
                            icon={<CalendarTodayIcon />}
                            type="date"
                            name="birthDate"
                            label="Data de Nascimento"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                        />

                        <AuthSelect
                            icon={<WcIcon />}
                            name="gender"
                            label="Gênero"
                            value={formData.gender}
                            onChange={(e) => handleChange(e as any)}
                            options={GENDER_OPTIONS}
                        />
                    </Box>
                </Collapse>

                <Collapse in={profileType === 'PJ'}>
                    <Box>
                        <AuthTextField
                            icon={<BusinessIcon />}
                            type="text"
                            name="companyName"
                            label="Razão Social *"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            error={errors.companyName}
                        />

                        <AuthTextField
                            icon={<BadgeIcon />}
                            type="text"
                            name="cnpj"
                            label="CNPJ *"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            error={errors.cnpj}
                        />

                        <AuthTextField
                            icon={<BusinessIcon />}
                            type="text"
                            name="tradingName"
                            label="Nome Fantasia"
                            value={formData.tradingName}
                            onChange={handleInputChange}
                        />

                        <AuthTextField
                            icon={<BadgeIcon />}
                            type="text"
                            name="stateRegistration"
                            label="Inscrição Estadual"
                            value={formData.stateRegistration}
                            onChange={handleInputChange}
                        />

                        <AuthTextField
                            icon={<BadgeIcon />}
                            type="text"
                            name="municipalRegistration"
                            label="Inscrição Municipal"
                            value={formData.municipalRegistration}
                            onChange={handleInputChange}
                        />
                    </Box>
                </Collapse>

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<HowToRegIcon />}
                    sx={{
                        mt: 1,
                        mb: 3,
                        py: 1.5,
                        bgcolor: THEME_COLOR,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(37, 45, 95, 0.3)',
                        '&:hover': {
                            bgcolor: '#1a2147',
                            boxShadow: '0 6px 16px rgba(37, 45, 95, 0.4)',
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'rgba(37, 45, 95, 0.5)',
                        },
                    }}
                >
                    Cadastrar
                </LoadingButton>

                <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', color: '#666' }}
                >
                    Já tem uma conta?{' '}
                    <Link
                        href="/login"
                        style={{
                            color: THEME_COLOR,
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Entre aqui
                    </Link>
                </Typography>
            </Box>
        </AuthLayout>
    );
}
