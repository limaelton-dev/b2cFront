'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@/context/AuthProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useToastSide } from '@/context/ToastSideProvider';

import { AuthLayout } from './components/AuthLayout';
import AuthTextField from './components/AuthTextField';
import SocialLoginDivider from './components/SocialLoginDivider';

const THEME_COLOR = '#252d5f';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { login, loading } = useAuth();
    const { showToast } = useToastSide();

    const {
        formData,
        errorMessage,
        handleChange,
        setErrorMessage,
        clearError,
    } = useAuthForm({
        email: '',
        password: '',
    });

    const handleGoogleSuccess = async () => {
        const msg = 'Login com Google ainda não implementado na nova arquitetura';
        setErrorMessage(msg);
        showToast(msg, 'warning');
    };

    const handleGoogleError = () => {
        const msg = 'Erro ao fazer login com Google';
        setErrorMessage(msg);
        showToast(msg, 'error');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearError();

        if (!formData.email || !formData.password) {
            const msg = 'Por favor, preencha email e senha';
            setErrorMessage(msg);
            showToast(msg, 'warning');
            return;
        }

        try {
            await login({ email: formData.email, password: formData.password });
            showToast('Login realizado com sucesso!', 'success');
            router.push(redirect || '/');
        } catch (err: any) {
            let errorMsg = 'Não foi possível fazer login';

            if (err?.message?.includes('Network') || err?.code === 'ECONNREFUSED') {
                errorMsg = 'Serviço temporariamente indisponível. Tente novamente.';
            } else if (err?.response?.status === 401) {
                errorMsg = 'Email ou senha incorretos';
            } else if (err?.response?.status === 500) {
                errorMsg = 'Erro no servidor. Tente novamente mais tarde.';
            } else if (err?.message) {
                errorMsg = err.message;
            }

            setErrorMessage(errorMsg);
            showToast(errorMsg, 'error');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        if (errorMessage) clearError();
    };

    return (
        <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        type="standard"
                        theme="outline"
                        text="signin_with"
                        locale="pt"
                        width="100%"
                    />
                </Box>

                <SocialLoginDivider />

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <AuthTextField
                    icon={<AlternateEmailIcon />}
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    autoFocus
                />

                <AuthTextField
                    icon={<LockIcon />}
                    type="password"
                    name="password"
                    label="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
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
                    Entrar
                </LoadingButton>

                <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', color: '#666' }}
                >
                    Não tem uma conta?{' '}
                    <Link
                        href="/register"
                        style={{
                            color: THEME_COLOR,
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Cadastre-se aqui
                    </Link>
                </Typography>
            </Box>
        </AuthLayout>
    );
}
