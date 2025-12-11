"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '@/context/AuthProvider';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useToastSide } from '@/context/ToastSideProvider';
import { AuthLayout } from './components/AuthLayout';
import { AuthButton } from './components/AuthButton';
import { AuthFormField } from './components/AuthFormField';
import { ErrorMessage } from './components/ErrorMessage';

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
        clearError
    } = useAuthForm({
        email: '',
        password: ''
    });

    const handleGoogleSuccess = async (credentialResponse: any) => {
        const msg = 'Login com Google ainda não implementado na nova arquitetura';
        setErrorMessage(msg);
        showToast(msg, 'warning');
    };

    const handleGoogleError = () => {
        const msg = 'Erro ao fazer login com Google';
        setErrorMessage(msg);
        showToast(msg, 'error');
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
            
            const redirectPath = redirect || '/';
            router.push(redirectPath);
        } catch (err: any) {
            console.error('Erro durante o login:', err);
            
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