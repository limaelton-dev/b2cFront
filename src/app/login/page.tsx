"use client"
import '../assets/css/login.css';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from 'react';
import { login } from '../services/auth';
import { CookiesProvider, useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../assets/img/logo_coletek_white.png';
import svgG from '../assets/img/svg/google.svg';
import svgF from '../assets/img/svg/facebook.svg';

export default function LoginPage() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['jwt']);
    const [isLoading, setIsLoading] = useState(false);

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

    const submit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await login(formData.email, formData.password)
        if(response.status == 200) {
            setCookie('jwt', response.token);
            router.push('/');
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
                                        <div className="form-group icons-inputs">
                                            <AlternateEmailIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control"/>
                                        </div>
                                        <div className="form-group icons-inputs">
                                            <LockIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha"  className="form-control"/>
                                        </div>
                                        <button type="submit" onClick={submit} className="btn btn-primary btn-auth d-flex">
                                            {isLoading ? 
                                                <div className="spinner-border text-light" style={{fontSize: '8px',width: '24px',height: '24px'}} role="status"><span className="visually-hidden"></span></div>
                                                :
                                                <p style={{marginBottom: '0px', padding: '0px 0px'}}>Entrar</p>
                                            }
                                        </button>
                                        <a href="" id="change-login">Não tem uma conta? Cadastre-se</a>
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