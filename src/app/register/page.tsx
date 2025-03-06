"use client"
import React from 'react';
import '../assets/css/login.css';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';
import { register } from '../services/auth';
import { CookiesProvider, useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../assets/img/logo_coletek_white.png';
import svgG from '../assets/img/svg/google.svg';
import svgF from '../assets/img/svg/facebook.svg';
import { useAuth } from '../context/auth';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useToastSide } from '../context/toastSide';

export default function LoginPage() {
    const router = useRouter();
    const { setUserFn } = useAuth();
    const [cookies, setCookie] = useCookies(['jwt','user']);
    const [isLoading, setIsLoading] = useState(false);
    const [textError, setTextError] = useState('');
    const { showToast } = useToastSide();

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        repassword: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        lastname: false,
        username: false,
        email: false,
        password: false,
        repassword: false
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const submit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const newErrors = {
            name: !formData.name.trim(),
            lastname: !formData.lastname.trim(),
            username: !formData.lastname.trim(),
            email: !formData.email.trim(),
            password: !formData.password.trim(),
            repassword: !formData.repassword.trim(),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            setIsLoading(false);
            setTextError('Por favor, preencha os campos obrigatórios!');
            return;
        }
        if(formData.repassword != formData.password) {
            setIsLoading(false);
            setTextError('As senhas não condizem.\nPor favor, preencha corretamente.');
            return;
        }

        try {
            const response = await register(formData)
            if(response.status == 200) {
                setUserFn(response.user);
                setCookie('jwt', response.token);
                router.push('/');
                showToast('Você se cadastrou com sucesso!', 'success');
            }
            else {
                setIsLoading(false);
                if(response.code == 'ERR_NETWORK')
                    setTextError('Erro de conexão com o servidor.\nPor favor, tente novamente mais tarde');
                    
                if(response.code == 'ERR_BAD_REQUEST')
                    setTextError('Email ou senha incorretos');
            }
        }
        catch(error) {
            if(error.status == 401) {
                setIsLoading(false);
                setTextError('Houve um erro ao criar usuário');
            }
            else {
                setIsLoading(false);
                setTextError('Houve um erro ao criar usuário');
            }
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
                                            <a href="#" className="login-social google">
                                                <Image
                                                    src={svgG}
                                                    alt=""
                                                    width={25}
                                                    height={25}
                                                />
                                                <span style={{marginLeft: '7px'}}>Logar com o Google</span>
                                            </a>
                                        </div>
                                        <div className="form-group d-flex">
                                            <a href="#" className="login-social facebook">
                                                <Image
                                                    src={svgF}
                                                    alt=""
                                                    width={25}
                                                    height={25}
                                                />
                                                <span>Logar com o Facebook</span>
                                            </a>
                                        </div>
                                        <div className="separator-social d-flex">
                                            <div className="separator"></div>
                                            <span>ou</span>
                                            <div className="separator"></div>
                                        </div>
                                        <p style={{textAlign: 'center', color: 'red'}} dangerouslySetInnerHTML={{ __html: textError.replace(/\n/g, '<br />') }} />
                                        <div className={`form-group icons-inputs ${errors.email ? 'error' : ''}`}>
                                            <AccountBoxIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="text" name="username" required placeholder="Nome de usuário*" value={formData.username} onChange={handleChange} className="form-control"/>
                                        </div>
                                        <div className="form-group icons-inputs d-flex">
                                            <div className={`position-relative ${errors.name ? 'error' : ''}`}>
                                                <PersonIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                <input type="text" name="name" required placeholder="Nome*" value={formData.name} onChange={handleChange} className="form-control"/>
                                            </div>
                                            <div className={`position-relative ${errors.lastname ? 'error' : ''}`}>
                                                <PersonOutlineIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                <input type="text" name="lastname" required placeholder="Sobrenome*" value={formData.lastname} onChange={handleChange} className="form-control"/>
                                            </div>
                                        </div>
                                        <div className={`form-group icons-inputs ${errors.email ? 'error' : ''}`}>
                                            <AlternateEmailIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="text" name="email" required placeholder="Email*" value={formData.email} onChange={handleChange} className="form-control"/>
                                        </div>
                                        <div className={`form-group icons-inputs ${errors.password ? 'error' : ''}`}>
                                            <KeyIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Senha*"  className="form-control"/>
                                        </div>
                                        <div className={`form-group icons-inputs ${errors.repassword ? 'error' : ''}`}>
                                            <KeyIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="password" name="repassword" required value={formData.repassword} onChange={handleChange} placeholder="Repita novamente a senha*"  className="form-control"/>
                                        </div>
                                        <button type="submit" style={{backgroundColor: isLoading ? '#8cad8b' : '#349131', pointerEvents: isLoading ? 'none': 'all'}} onClick={submit} className="btn btn-primary btn-auth d-flex">
                                            {isLoading ? 
                                                <div className="spinner-border text-light" style={{fontSize: '8px',width: '24px',height: '24px'}} role="status"><span className="visually-hidden"></span></div>
                                                :
                                                <p style={{marginBottom: '0px', padding: '0px 0px'}}>Cadastrar</p>
                                            }
                                        </button>
                                        <a href="" id="change-login">Já tem uma conta? Logue aqui</a>
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