import React from 'react';
import Image from 'next/image';
import Logo from '@/assets/img/logo_coletek_white.png';
import '@/assets/css/login.css';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
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
                            <span>©️ Coletek 2024.</span>
                        </div>
                        
                        <div id="content-login" className="content-forms active-content d-flex align-items">
                            <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                                {children}
                            </div>
                        </div>
                        
                        <div className="copyright-login">
                            <ul>
                                <li>
                                    <a href="">Termos e serviços</a>
                                </li>
                                <li>
                                    <a href="">Política de Privacidade</a>
                                </li>
                                <li>
                                    <a href="">Política de Entrega</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

