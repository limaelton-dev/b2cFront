"use client"
import React from 'react';
import '../assets/css/login.css';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../assets/img/logo_coletek_white.png';
import { useAuth } from '../context/AuthProvider';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import { useToastSide } from '../context/ToastSideProvider';
import { ProfileType } from '../api/auth/types/AuthUser';
import type { RegisterRequest } from '../api/auth/types/Register';

export default function RegisterPage() {
    const router = useRouter();
    const { register, loading } = useAuth();
    const [textError, setTextError] = useState('');
    const { showToast } = useToastSide();
    const [profileType, setProfileType] = useState<'PF' | 'PJ'>('PF');

    const [formData, setFormData] = useState({
        // Campos comuns
        email: '',
        password: '',
        repassword: '',
        profileType: 'PF',
        
        // Campos PF
        fullName: '',
        cpf: '',
        birthDate: '',
        gender: '',
        
        // Campos PJ
        companyName: '',
        cnpj: '',
        tradingName: '',
        stateRegistration: '',
        municipalRegistration: ''
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
        repassword: false,
        
        // Campos PF
        fullName: false,
        cpf: false,
        
        // Campos PJ
        companyName: false,
        cnpj: false
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        
        if (name === 'profileType') {
            setProfileType(value);
        }
    };

    const submit = async (e: any) => {
        e.preventDefault();
        setTextError('');
        
        let newErrors = {
            email: !formData.email.trim(),
            password: !formData.password.trim(),
            repassword: !formData.repassword.trim(),
            fullName: profileType === 'PF' && !formData.fullName.trim(),
            cpf: profileType === 'PF' && !formData.cpf.trim(),
            companyName: profileType === 'PJ' && !formData.companyName.trim(),
            cnpj: profileType === 'PJ' && !formData.cnpj.trim()
        };
        
        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            setTextError('Por favor, preencha os campos obrigatórios!');
            return;
        }
        
        if(formData.repassword !== formData.password) {
            setTextError('As senhas não condizem.\nPor favor, preencha corretamente.');
            return;
        }
        
        // Verificação adicional para garantir que o nome completo tenha pelo menos um espaço (nome e sobrenome)
        if (profileType === 'PF' && !formData.fullName.trim().includes(' ')) {
            setTextError('Por favor, informe nome e sobrenome.');
            return;
        }

        try {
            // Construir payload conforme o tipo de perfil
            const payload: RegisterRequest = profileType === 'PF' 
                ? {
                    email: formData.email,
                    password: formData.password,
                    profileType: ProfileType.PF,
                    fullName: formData.fullName,
                    cpf: formData.cpf,
                    birthDate: formData.birthDate || undefined,
                    gender: formData.gender || null
                }
                : {
                    email: formData.email,
                    password: formData.password,
                    profileType: ProfileType.PJ,
                    companyName: formData.companyName,
                    cnpj: formData.cnpj,
                    tradingName: formData.tradingName || undefined,
                    stateRegistration: formData.stateRegistration || undefined,
                    municipalRegistration: formData.municipalRegistration || undefined
                };

            await register(payload);
            
            // Se chegou aqui, cadastro foi bem-sucedido
            showToast('Você se cadastrou com sucesso!', 'success');
            router.push('/');
        }
        catch(error: any) {
            console.error('Erro durante o cadastro:', error);
            setTextError(error?.message || 'Houve um erro ao criar usuário');
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
                                        <p style={{textAlign: 'center', color: 'red'}} dangerouslySetInnerHTML={{ __html: textError.replace(/\n/g, '<br />') }} />
                                        
                                        {/* Escolha do tipo de perfil */}
                                        <div className="form-group text-center mb-4">
                                            <div className="btn-group" role="group">
                                                <button
                                                    type="button"
                                                    className={`btn ${profileType === 'PF' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => handleChange({ target: { name: 'profileType', value: 'PF' } })}
                                                >
                                                    Pessoa Física
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn ${profileType === 'PJ' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => handleChange({ target: { name: 'profileType', value: 'PJ' } })}
                                                >
                                                    Pessoa Jurídica
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Campos de email e senha (comuns) */}
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
                                        
                                        {/* Campos para Pessoa Física */}
                                        {profileType === 'PF' && (
                                            <>
                                                <div className={`form-group icons-inputs ${errors.fullName ? 'error' : ''}`}>
                                                    <PersonIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="fullName" required placeholder="Nome e sobrenome*" value={formData.fullName} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className={`form-group icons-inputs ${errors.cpf ? 'error' : ''}`}>
                                                    <BadgeIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="cpf" required placeholder="CPF*" value={formData.cpf} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className="form-group icons-inputs">
                                                    <CalendarTodayIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="date" name="birthDate" placeholder="Data de Nascimento" value={formData.birthDate} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className="form-group icons-inputs">
                                                    <WcIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <select name="gender" value={formData.gender} onChange={handleChange} className="form-control" style={{ paddingLeft: '45px' }}>
                                                        <option value="">Selecione o gênero</option>
                                                        <option value="Masculino">Masculino</option>
                                                        <option value="Feminino">Feminino</option>
                                                        <option value="Outro">Outro</option>
                                                        <option value="Prefiro não informar">Prefiro não informar</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Campos para Pessoa Jurídica */}
                                        {profileType === 'PJ' && (
                                            <>
                                                <div className={`form-group icons-inputs ${errors.companyName ? 'error' : ''}`}>
                                                    <BusinessIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="companyName" required placeholder="Razão Social*" value={formData.companyName} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className={`form-group icons-inputs ${errors.cnpj ? 'error' : ''}`}>
                                                    <BadgeIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="cnpj" required placeholder="CNPJ*" value={formData.cnpj} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className="form-group icons-inputs">
                                                    <BusinessIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="tradingName" placeholder="Nome Fantasia" value={formData.tradingName} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className="form-group icons-inputs">
                                                    <BadgeIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="stateRegistration" placeholder="Inscrição Estadual" value={formData.stateRegistration} onChange={handleChange} className="form-control"/>
                                                </div>
                                                <div className="form-group icons-inputs">
                                                    <BadgeIcon style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)'}}/>
                                                    <input type="text" name="municipalRegistration" placeholder="Inscrição Municipal" value={formData.municipalRegistration} onChange={handleChange} className="form-control"/>
                                                </div>
                                            </>
                                        )}
                                        
                                        <button type="submit" style={{backgroundColor: loading ? '#8cad8b' : '#349131', pointerEvents: loading ? 'none': 'all'}} onClick={submit} className="btn btn-primary btn-auth d-flex">
                                            {loading ? 
                                                <div className="spinner-border text-light" style={{fontSize: '8px',width: '24px',height: '24px'}} role="status"><span className="visually-hidden"></span></div>
                                                :
                                                <p style={{marginBottom: '0px', padding: '0px 0px'}}>Cadastrar</p>
                                            }
                                        </button>
                                        <a href="/login" id="change-login">Já tem uma conta? Logue aqui</a>
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