"use client"
import React from 'react';
import '../assets/css/login.css';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Logo from '../assets/img/logo_coletek_white.png';
import { useAuth } from '../context/AuthProvider';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { login, loading, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [textError, setTextError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setTextError('Login com Google ainda não implementado na nova arquitetura');
        setIsLoading(false);
        // TODO: Implementar loginWithGoogle na nova arquitetura
    };

    const handleGoogleError = () => {
        setTextError('Erro ao fazer login com Google');
    };

    const submit = async (e: any) => {
        e.preventDefault();
        setTextError('');
        
        try {
            await login({ email: formData.email, password: formData.password });
            
            // Se chegou aqui, login foi bem-sucedido
            if (redirect === 'checkout') {
                router.push('/checkout');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.error('Erro durante o login:', err);
            setTextError(err?.message || 'Email ou senha incorretos');
        }
    }

    return (
        <>  
            <main>
                <section id="login2" className="login-register">
                    <div className="gradient-bg">
                        <div className="gradients-container">
                            <div className="login-logo">
                                <Image
                                    src={Logo}
                                    alt="Logo Coletek Branca White"
                                    width={390}
                                    height={200}
                                    style={{marginTop: '-55px'}}
                                />
                                <span>
                                    ©️ Coletek 2024.
                                </span>
                            </div>
                            <div id="content-login" className="content-forms active-content d-flex align-items">
                                <div style={{width: '100%',display: 'flex', alignItems: 'center'}}>
                                    <form id="form-login" action="" style={{width: '100%'}} method="POST">
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
                                        <p style={{textAlign: 'center', color: 'red'}} dangerouslySetInnerHTML={{ __html: textError.replace(/\n/g, '<br />') }} />
                                        <div className="form-group icons-inputs">
                                            <AlternateEmailIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control"/>
                                        </div>
                                        <div className="form-group icons-inputs">
                                            <LockIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha"  className="form-control"/>
                                        </div>
                                        <button type="submit" style={{backgroundColor: loading ? '#8cad8b' : '#349131', pointerEvents: loading ? 'none': 'all'}} onClick={submit} className="btn btn-primary btn-auth d-flex">
                                            {loading ? 
                                                <div className="spinner-border text-light" style={{fontSize: '8px',width: '24px',height: '24px'}} role="status"><span className="visually-hidden"></span></div>
                                                :
                                                <p style={{marginBottom: '0px', padding: '0px 0px'}}>Entrar</p>
                                            }
                                        </button>
                                        <a href="/register" id="change-login">Não tem uma conta? Cadastre-se aqui</a>
                                    </form>
                                </div>
                            </div>
                            <div className="copyright-login">
                                <ul>
                                    <li>
                                        <a href="">
                                            Termos e serviços
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            Política de Privacidade
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            Política de Entrega
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
};