"use client"
import React from 'react';
import '../assets/css/login.css';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from 'react';
import { login, getUserProfile } from '../services/auth';
import { loginWithGoogle } from '../services/googleAuth';
import { CookiesProvider, useCookies } from 'react-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Logo from '../assets/img/logo_coletek_white.png';
import svgG from '../assets/img/svg/google.svg';
import svgF from '../assets/img/svg/facebook.svg';
import { useAuth } from '../context/auth';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { setUserFn } = useAuth();
    const [cookies, setCookie] = useCookies(['jwt','user']);
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

    // Função para carregar o perfil completo após login
    const loadCompleteProfile = async () => {
        try {
            // Criar Promise com timeout para o carregamento do perfil
            const profilePromise = getUserProfile();
            
            // Adicionar timeout para garantir que não ficaremos travados aqui
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout ao carregar perfil')), 5000);
            });
            
            // Usar Promise.race para limitar o tempo de carregamento
            const profileData = await Promise.race([profilePromise, timeoutPromise]);
            
            if (profileData) {
                // Montando o objeto de usuário com os dados do perfil
                const userData = {
                    id: profileData.id,
                    email: profileData.email,
                    profileId: profileData.profileId,
                    profileType: profileData.profileType,
                    name: profileData.profileType === 'PF' 
                        ? (profileData.profile?.firstName && profileData.profile?.lastName 
                           ? profileData.profile.firstName + ' ' + profileData.profile.lastName
                           : profileData.profile?.fullName) 
                        : profileData.profile?.companyName,
                    profile: profileData.profile,
                    address: profileData.address,
                    phone: profileData.phone,
                    card: profileData.card
                };
                
                setUserFn(userData);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao carregar perfil completo:", error);
            return false;
        }
    };

    const navigateAfterLogin = (redirectTarget) => {
        // Sempre redirecionar, mesmo que o carregamento do perfil falhe
        if (redirectTarget === 'checkout') {
            router.push('/checkout');
        } else {
            router.push('/');
        }
    };
    
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const response = await loginWithGoogle(credentialResponse.credential);
            
            // Verificar se a resposta contém o token de acesso
            if (response && response.access_token) {
                // O usuário já é definido no serviço de loginWithGoogle
                // O token já é salvo no serviço de loginWithGoogle
                setCookie('jwt', response.access_token);
                
                // Tentar carregar o perfil, mas garantir redirecionamento mesmo se falhar
                try {
                    // Definir um timeout para garantir o redirecionamento
                    const redirectTimeout = setTimeout(() => {
                        console.log('Timeout: redirecionando após login com Google');
                        navigateAfterLogin(redirect);
                    }, 3000);
                    
                    // Carregar o perfil com limite de tempo
                    await loadCompleteProfile();
                    
                    // Limpar o timeout se o carregamento foi rápido o suficiente
                    clearTimeout(redirectTimeout);
                    
                    // Redirecionar depois de carregar o perfil
                    navigateAfterLogin(redirect);
                } catch (profileError) {
                    console.error('Erro ao carregar perfil após login com Google:', profileError);
                    navigateAfterLogin(redirect);
                }
            } else {
                setIsLoading(false);
                setTextError('Erro ao fazer login com Google');
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.code === 'ERR_NETWORK') {
                setTextError('Erro de conexão com o servidor.\nPor favor, tente novamente mais tarde');
            } else {
                setTextError('Erro ao fazer login com Google');
            }
        }
    };

    const handleGoogleError = () => {
        setTextError('Erro ao fazer login com Google');
    };

    const submit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Adicionar timeout para a operação de login
            const loginPromise = login(formData.email, formData.password);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout ao fazer login')), 5000);
            });
            
            // Usar Promise.race para garantir que o login não trave
            const response = await Promise.race([loginPromise, timeoutPromise]);
            
            if(response) {
                setUserFn(response.user);
                setCookie('jwt', response.access_token);
                // Verificar se a resposta contém o token de acesso
                if (response && response.access_token) {
                    // Configurar o usuário no contexto de autenticação
                    setUserFn({
                        id: response.user.id,
                        email: response.user.email,
                        profileId: response.user.profileId,
                        profileType: response.user.profileType,
                        name: response.user.profileType === 'PF' 
                            ? response.user.profile?.firstName + ' ' + response.user.profile?.lastName 
                            : response.user.profile?.companyName,
                        profile: response.user.profile
                    });
                    
                    // O token já é salvo no serviço de login
                    setCookie('jwt', response.access_token);
                    
                    // Tentar carregar o perfil, mas garantir redirecionamento mesmo se falhar
                    try {
                        // Definir um timeout para garantir o redirecionamento
                        const redirectTimeout = setTimeout(() => {
                            console.log('Timeout: redirecionando após login normal');
                            navigateAfterLogin(redirect);
                        }, 3000);
                        
                        // Carregar o perfil com limite de tempo
                        await loadCompleteProfile();
                        
                        // Limpar o timeout se o carregamento foi rápido o suficiente
                        clearTimeout(redirectTimeout);
                        
                        // Redirecionar depois de carregar o perfil
                        navigateAfterLogin(redirect);
                    } catch (profileError) {
                        console.error('Erro ao carregar perfil após login normal:', profileError);
                        navigateAfterLogin(redirect);
                    }
                } else {
                    setIsLoading(false);
                    setTextError('Email ou senha incorretos');
                }
            } else {
                setIsLoading(false);
                setTextError('Email ou senha incorretos');
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            setIsLoading(false);
            setTextError('Erro ao fazer login. Por favor, tente novamente.');
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
                                        <button type="submit" style={{backgroundColor: isLoading ? '#8cad8b' : '#349131', pointerEvents: isLoading ? 'none': 'all'}} onClick={submit} className="btn btn-primary btn-auth d-flex">
                                            {isLoading ? 
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