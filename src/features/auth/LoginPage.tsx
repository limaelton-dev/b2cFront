"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@/context/AuthProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import { AuthLayout } from './components/AuthLayout';
import { AuthButton } from './components/AuthButton';
import { AuthFormField } from './components/AuthFormField';
import { ErrorMessage } from './components/ErrorMessage';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { login, loading } = useAuth();

    const {
        formData,
        errorMessage,
        handleChange,
        setErrorMessage,
        clearError
    } = useAuthForm({
        email: '',
        password: ''
    });

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setErrorMessage('Login com Google ainda não implementado na nova arquitetura');
        // TODO: Implementar loginWithGoogle na nova arquitetura
    };

    const handleGoogleError = () => {
        setErrorMessage('Erro ao fazer login com Google');
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        clearError();
        
        try {
            await login({ email: formData.email, password: formData.password });
            
            if (redirect === 'checkout') {
                router.push('/checkout');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.error('Erro durante o login:', err);
            setErrorMessage(err?.message || 'Email ou senha incorretos');
        }
    };

    return (
        <AuthLayout>
            <form id="form-login" style={{width: '100%'}} method="POST">
                <div className="form-group d-flex">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        type="standard"
                        theme="outline"
                        text="signin_with"
                        locale="pt"
                    />
                </div>
                
                <div className="separator-social d-flex">
                    <div className="separator"></div>
                    <span>ou</span>
                    <div className="separator"></div>
                </div>
                
                <ErrorMessage message={errorMessage} />
                
                <AuthFormField
                    icon={<AlternateEmailIcon />}
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                
                <AuthFormField
                    icon={<LockIcon />}
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                />
                
                <AuthButton loading={loading} onClick={handleSubmit}>
                    Entrar
                </AuthButton>
                
                <a href="/register" id="change-login">
                    Não tem uma conta? Cadastre-se aqui
                </a>
            </form>
        </AuthLayout>
    );
}
