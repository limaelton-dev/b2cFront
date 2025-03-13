"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../assets/css/checkout.css';
import Image from 'next/image';
import LogoColetek from '../assets/img/logo_coletek.png';
import HeadphoneImg from '../assets/img/headphone.png';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useEffect, useState } from 'react';
import Cart from '../components/cart';
import Footer from '../footer';
import { Box, Breadcrumbs, Button, CircularProgress, FormControlLabel, InputAdornment, Link, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import { useCart } from '../context/cart';
import { useCoupon } from '../context/coupon';
import { useAuth } from '../context/auth';
import ReactInputMask from 'react-input-mask';
import axios from 'axios';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
import { useToastSide } from '../context/toastSide';
import { getProfileUser } from '../services/profile';
import { processPayment, validatePayment } from '../services/payment';
import { cpfValidation, emailVerify } from '../services/checkout';
import { generateCardToken, prepareCardData, preparePaymentData } from '../services/mercadoPago';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

async function buscaTipoPessoa(id: number) {
    try {
        const resp = await getProfileUser(id);
        
        if (resp) {
            return {
                id: resp.id || 0,
                profile_type: resp.profile_type || '',
                bith_date: resp.birth_date || '',
                cpf: resp.cpf || '',
                trading_name: resp.trading_name || '',
                cnpj: resp.cnpj || '',
                state_registration: resp || '',
                addresses: resp.addresses || [],
                cards: resp.cards || []
            };
        }

        return { id: 0, profile_type: '', bith_date: '', cpf: '', trading_name: '', cnpj: '', state_registration: '', addresses: [], cards: []};

    } catch (error) {
        console.error('Erro: ', error);
        return { id: 0, profile_type: '', bith_date: '', cpf: '', trading_name: '', cnpj: '', state_registration: '', addresses: [], cards: []};
    }
}

const CheckoutPage = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { statusMessage, activeCoupon, coupon, setCouponFn } = useCoupon();
    const [tipoPessoa, setTipoPessoa] = useState('1');
    const [tipoCompra, setTipoCompra] = useState('1');
    const [cardNumber, setCardNumber] = useState('');
    const [cepNumber, setCepNumber] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [flagCard, setFlagCard] = useState<JSX.Element>(<></>);
    const [loadBtn, setLoadBtn] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [loadingDadosPessoais, setLoadingDadosPessoais] = useState(false);
    const [openedCart, setOpenedCart] = useState(false);
    const [telCelular, setTelCelular] = useState("");
    const [cpf, setCpf] = useState('');
    const { cartItems, cartData, removeItems } = useCart();
    const [discountPix, setDiscountPix] = useState(5);
    const { user } = useAuth();
    const [nameUser, setNameUser] = useState('');
    const [emailUser, setEmailUser] = useState('');
    const [disabledUser, setDisabledUser] = useState(false);
    const [disabledUserPF, setDisabledUserPF] = useState(false);
    const [disabledUserPJ, setDisabledUserPJ] = useState(false);
    const [disabledAddress, setDisabledAddress] = useState(false);
    const [cnpj, setCnpj] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [inscEstadual, setInscEstadual] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [CVV, setCVV] = useState('');
    const [expireCC, setExpireCC] = useState('');
    const [isMaskedCC, setIsMaskedCC] = useState(false);
    const [numberCCFinal, setNumberCCFinal] = useState('');
    const [CVVFinal, setCVVFinal] = useState('');
    const [expireCCFinal, setExpireCCFinal] = useState('');
    const [shippingCost, setShippingCost] = useState(25.90);
    const [errorCpf, setErrorCpf] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [step, setStep] = useState(1);
    

    // Verificar se o usuário está logado
    useEffect(() => {
        // if (!user || !user.id) {
        //     showToast('Você precisa estar logado para finalizar a compra', 'error');
        //     router.push('/login?redirect=checkout');
        // }
    }, [user]);


    // Verificar se há itens no carrinho
    // useEffect(() => {
    //     if (cartItems.length === 0 || cartData.length === 0) {
    //         showToast('Seu carrinho está vazio', 'error');
    //         router.push('/');
    //     }
    // }, [cartItems, cartData, router]);

    // Função para obter o preço correto do produto
    const getProductPrice = (product, item) => {
        // Verificar se o item tem um preço definido
        if (item.price && !isNaN(item.price)) {
            return item.price * (item.qty || item.quantity);
        }
        
        // Verificar se o produto tem preço de venda
        if (product.pro_precovenda && !isNaN(product.pro_precovenda)) {
            return product.pro_precovenda * (item.qty || item.quantity);
        }
        
        // Verificar se o produto tem preço de última compra
        if (product.pro_valorultimacompra && !isNaN(product.pro_valorultimacompra)) {
            return product.pro_valorultimacompra * (item.qty || item.quantity);
        }
        
        // Se nenhum preço válido for encontrado, retornar 0
        return 0;
    };

    // Função para calcular o subtotal do carrinho
    const calculateSubtotal = () => {
        return (Number((applyDiscounts(cartItems
            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
            .toFixed(2))) + (shippingCost)).toFixed(0)
    };

    // Função para caso tenha descontos diferentes
    const applyDiscounts = (val) => {
        let result = val; 
        if(coupon)
            result = val - ((coupon.percent_discount / 100) * val);

        return result;
    }

    const applyCouponDiscount = (val) => {
        if(coupon)
            return val - ((coupon.percent_discount / 100) * val);

        return val;
    }

    const applyPixDiscount = (val) => {
        if(!discountPix) return val

        if(coupon)
            return (val - ((coupon.percent_discount / 100) * val)) - ((discountPix / 100) * val);
        else
            return val - ((discountPix / 100) * val);
    }

    const changeExpireCC = (e) => {
        setExpireCC(e.target.value);
    }

    const changeCCV = (e) => {
        setCVV(e.target.value);
    }

    useEffect(() => {
        async function fetchTipoPessoa() {
            if (user.name) {
                setNameUser(user.name);
                setEmailUser(user.email);
                setDisabledUser(true);
    
                try {
                    const resultPessoa = await buscaTipoPessoa(user.id);
    
                    if (resultPessoa.profile_type === 'PF') {
                        setCpf(resultPessoa.cpf);
                        setDisabledUserPF(false);
                    } 
                    if (resultPessoa.profile_type === 'PJ') {
                        setCnpj(resultPessoa.cnpj);
                        setRazaoSocial(resultPessoa.trading_name);
                        setInscEstadual(resultPessoa.state_registration);
                        setDisabledUserPJ(true);
                    }

                    setBairro(resultPessoa.addresses[0].neighborhood);
                    setCepNumber(resultPessoa.addresses[0].postal_code);
                    setNumero(resultPessoa.addresses[0].number);
                    setComplemento(resultPessoa.addresses[0].complement);
                    setEndereco(resultPessoa.addresses[0].street);
                    setCidade(resultPessoa.addresses[0].city);
                    setDisabledAddress(true);

                    setCVVFinal(resultPessoa.cards[0].last_four_digits);
                    setNumberCCFinal(resultPessoa.cards[0].card_number);
                    setFlagCard(detectCardFlag(resultPessoa.cards[0].card_number));
                    setExpireCCFinal(resultPessoa.cards[0].expiration_date);
                    setCardNumber(`XXXX XXXX XXXX ${getLastFourDigits(resultPessoa.cards[0].card_number)}`)

                    setCVV('XXX');
                    setExpireCC('XX/XX');
                    setIsMaskedCC(false);
                } catch (error) {
                    console.error("Erro ao buscar tipo de pessoa:", error);
                }
            }
        }
    
        fetchTipoPessoa();
    }, [user])

    const getLastFourDigits = (cardNumber) => {
        if (!cardNumber) return '';
        const strCard = cardNumber.toString();
        return strCard.slice(-4);
    }
    
    const changeRadioTipoPessoa = (e) => {
        setTipoPessoa(e.target.value)
    }

    const changeRadioTipoCompra = (e) => {
        setTipoCompra(e.target.value)
    }

    const handleChangeCardNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(event.target.value);
        setFlagCard(detectCardFlag(cardNumber));
    };

    const handlePayButton = async () => {
        setLoadBtn(true);
        try {
            // Passo 1: Validar o pagamento no backend
            const validateResponse = await validatePayment({
                "address_id": 1, // Usar o endereço padrão ou selecionado
                "payment_method": "card",
                "card_id": 1 // Usar o cartão padrão ou selecionado
            });
            
            if (validateResponse.status !== 200) {
                showToast('Erro ao validar o pagamento', 'error');
                setLoadBtn(false);
                return;
            }
            
            // Passo 2: Buscar o perfil do usuário para obter os dados necessários
            const profileResponse = await getProfileUser(user.id);
            if (!profileResponse) {
                showToast('Erro ao obter dados do perfil', 'error');
                setLoadBtn(false);
                return;
            }
            
            // Passo 3: Preparar os dados do cartão
            const cardData = prepareCardData(profileResponse, CVVFinal);
            
            // Passo 4: Gerar o token do cartão no Mercado Pago
            const cardTokenResponse = await generateCardToken(cardData);
            
            console.log(cardTokenResponse)
            if (!cardTokenResponse || !cardTokenResponse.id) {
                showToast('Erro ao gerar token do cartão', 'error');
                setLoadBtn(false);
                return;
            }
            
            // Passo 5: Preparar os dados do pagamento
            const paymentData = preparePaymentData(
                profileResponse, 
                cardTokenResponse.id, 
                calculateSubtotal(), 
                1 // Número de parcelas
            );
            
            // Passo 6: Processar o pagamento no backend
            const paymentResponse = await processPayment(paymentData, cardTokenResponse.public_key);
            
            if (paymentResponse && paymentResponse.success == true) {
                showToast('Pagamento aprovado com sucesso!', 'success');
                // Redirecionar para página de sucesso ou pedidos
                router.push('/minhaconta');
                removeItems();
            } else {
                showToast(`Erro no pagamento: ${paymentResponse.status_detail || 'Verifique os dados do cartão'}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            showToast('Erro ao processar pagamento', 'error');
        } finally {
            setLoadBtn(false);
        }
    }

    const changeRazaoSocial = (e) => {
        setRazaoSocial(e.target.value);
    }

    const changeInscricaoEstadual = (e) => {
        setInscEstadual(e.target.value);
    }

    const changeCnpj = (e) => {
        setCnpj(e.target.value);
    }

    const changeNumero = (e) => {
        setNumero(e.target.value);
    }

    const changeComplemento = (e) => {
        setComplemento(e.target.value);
    }

    const changeEndereco = (e) => {
        setEndereco(e.target.value);
    }

    const changeCidade = (e) => {
        setCidade(e.target.value);
    }

    const changeBairro = (e) => {
        setBairro(e.target.value);
    }

    const changeEstado = (e) => {
        setEstado(e.target.value);
    }

    const buscarEndereco = async (cep: string) => {
        if (cep.length === 9) {
            setLoadingCep(true);
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setTimeout(async () => {
                    if (data.erro) {
                        alert('CEP não encontrado!');
                        setLoadingCep(false);
                    } else {
                        setEndereco(data.logradouro || '');
                        setBairro(data.bairro || '');
                        setCidade(data.localidade || '');
                        setEstado(data.uf || '');
                    }
                    setLoadingCep(false);
                },800)
            } catch (error) {
                alert('Erro ao buscar o endereço.');
                setLoadingCep(false);
            }
        }
    };

    const validaNumCpf = async (cpf) => {
        cpf = cpf.replace(/\D/g, '');
    
        if (cpf.length !== 11) {
            return false;
        }
    
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
    
        let soma1 = 0;
        for (let i = 0; i < 9; i++) {
            soma1 += parseInt(cpf[i]) * (10 - i);
        }
        let digito1 = (soma1 * 10) % 11;
        if (digito1 === 10 || digito1 === 11) {
            digito1 = 0;
        }
    
        let soma2 = 0;
        for (let i = 0; i < 10; i++) {
            soma2 += parseInt(cpf[i]) * (11 - i);
        }
        let digito2 = (soma2 * 10) % 11;
        if (digito2 === 10 || digito2 === 11) {
            digito2 = 0;
        }
    
        return cpf[9] == digito1 && cpf[10] == digito2;
    }

    const handleChangeCpf = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await setCpf(event.target.value);
    };

    useEffect(() => {
        if (cpf.length === 14) 
            validaCpf(cpf);
    }, [cpf])

    const validaCpf = async (cpf: string) => {
        if(cpf.length === 14) {
            const isValidNums = await validaNumCpf(cpf);
            if(isValidNums) {
                setLoadingDadosPessoais(true);
                try {
                    const response = await cpfValidation(cpf);
                    if(response.status === 409) {
                        setErrorCpf(true)
                    }
                    else {
                        setErrorCpf(false)
                    }
                    setTimeout(() => {
                        setLoadingDadosPessoais(false);
                    },500)
                } catch (error) {
                    setErrorCpf(true)
                    setLoadingDadosPessoais(false);
                }
            }
            else {
                setErrorCpf(true);
            }
        }
    };

    const verificaEmail = async () => {
        const res = await emailVerify(emailUser);
        if(res.status === 409) {
            setErrorEmail(true);
        }
        else {
            setErrorEmail(false);
        }
    }

    const handleChangeCep = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cepValue = event.target.value;
        setCepNumber(cepValue);
        
        if (cepValue.length === 9) 
            buscarEndereco(cepValue);
    };


    const detectCardFlag = (number: string) => {
        const firstDigit = number.charAt(0);
        const first6Digits = number.slice(0, 6);

        if (firstDigit === '4') {
            return <PaymentIcon type="Visa" format="flatRounded" width={40} />;
        } else if (/^5[1-5]/.test(first6Digits)) {
            return <PaymentIcon type="Mastercard" format="logo" width={40} />;
        } else if (/^3[47]/.test(first6Digits)) {
            return <PaymentIcon type="Amex" format="flatRounded" width={40} />;
        } else if (/^(636368|438935|504175|451416|509044)/.test(firstDigit)) {
            return <PaymentIcon type="Elo" format="flatRounded" width={40} />;
        } else if (/^(606282|3841)/.test(first6Digits)) {
            return <PaymentIcon type="Hipercard" format="flatRounded" width={50} />;
        } else {
            return <></>;
        }
    };

    const changeCelular = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelCelular(event.target.value);
    };

    const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameUser(event.target.value);
    };

    const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailUser(event.target.value);
    };

    const changeStep = (newStep) => {
        if(step == 1) {
            if(tipoPessoa == '1') {
                if(!nameUser || !emailUser || !cpf || !telCelular && (!errorCpf || !errorEmail)) {
                    alert('Por favor, preencha os campos necessários primeiro')
                    return;
                }
            }
            else {
                if(!nameUser || !emailUser || !cnpj || !telCelular || !razaoSocial || !inscEstadual) {
                    alert('Por favor, preencha os campos necessários primeiro')
                    return;
                }
            }
        }
        if(step == 2 && newStep != 1) {
            if(!cepNumber || !numero || !endereco || !estado || !cidade || !bairro) {
                alert('Por favor, preencha os campos necessários primeiro')
                return;
            }
        }
        setStep(newStep);
    }

    return (
        <>
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
            <header>
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <Image
                            src={LogoColetek}
                            alt="Logo Coletek"
                        />
                        <div className="secure-buy d-flex align-items-center">
                            <LockOutlinedIcon style={{color: 'black', fontSize: '35px'}}/>
                            <span style={{fontWeight: 'bold', lineHeight: '19px'}}>
                                Compra<br/>100% Segura
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">
                        1. Meu Carrinho
                    </Link>
                    <Typography sx={{ color: 'text.primary' }}>2. Identificação e pagamento</Typography>
                </Breadcrumbs>
                <Link underline="hover" className='d-flex align-items-center' color="inherit" href="/">
                    <ArrowBackIosIcon style={{fontSize: '13px'}}/> Voltar
                </Link>
                <div className="prod-total">
                    <div className="d-flex justify-content-between">
                        <div className="prods">
                            {cartData.map((item, index) => {
                                const itemId = item.id || item.produto_id;
                                // Encontra o produto correspondente ao item do carrinho
                                const product = cartItems.find(r => r && (r.id == itemId || r.pro_codigo == itemId));
                                return (
                                <div className="prod" key={item.id || item.produto_id}>
                                    <Image
                                        src={product.imagens[0] ? product.imagens[0].url : HeadphoneImg}
                                        alt={product.pro_descricao || "Produto"}
                                        layout="responsive"
                                        width={200}
                                        height={200}
                                    />
                                    <div className="info-prod">
                                        <span className='title-prod'>{product.pro_descricao}</span>
                                        <div className="more-info">
                                            <span className='sku'>{product.pro_referencia || 'Sem referência'}</span>
                                            {product.tipo && (
                                            <div style={{display: 'flex'}}>
                                                <span style={{marginRight: '8px'}}>Categoria: </span>
                                                <span>{product.tipo.tpo_descricao}</span>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                        <div className="total">
                            <table>
                                <tbody>
                                {
                                    cartItems.length != 0 ?
                                    <>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>R$</td>
                                            <td>{cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0)
                                            .toFixed(2).replace('.',',')
                                        }</td>
                                        </tr>
                                        <tr>
                                            <td>Descontos</td>
                                            <td>R$</td>
                                            <td>- {((cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0)
                                            .toFixed(2)) - (applyCouponDiscount(cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                            .toFixed(2))).toString().replace('.',',')
                                        }</td>
                                        </tr>
                                        <tr>
                                            <th>Total à vista</th>
                                            <td>R$</td>
                                            <td>{applyPixDiscount(cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                            .toFixed(2).replace('.',',')
                                        }</td>
                                        </tr>
                                        <tr>
                                            <td>Entrega</td>
                                            <td>R$</td>
                                            <td>{shippingCost.toFixed(2).toString().replace('.',',')}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>R$</td>
                                            <td>{(Number((applyDiscounts(cartItems
                                            .reduce((total, item) => total + (item.pro_precovenda * cartData[cartItems.findIndex(i => i.pro_codigo == item.pro_codigo)].qty), 0))
                                            .toFixed(2))) + (shippingCost)).toFixed(2).toString().replace('.',',')
                                        }</td>
                                        </tr>
                                    </>
                                    : <></>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="ship-pay d-flex justify-content-between flex-wrap">
                    <div className="data-person content-ship-pay">
                        <span className='title-section'>
                            Dados Pessoais
                        </span>
                        <form action="" className='d-flex justify-content-between flex-wrap' style={{position: 'relative'}}>
                            {loadingDadosPessoais ? (
                                <Box sx={{ 
                                    position: 'absolute', 
                                    top: '40%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    zIndex: '99999'
                                }}>
                                    <CircularProgress />
                                </Box>
                            ) : ''}
                            <button type='button' className='button-change-checkout' onClick={() => changeStep(1)} style={{display: step == 1 ? 'none' : 'block'}}>
                                <LocalShippingIcon></LocalShippingIcon>
                            </button>
                            <Box className={'d-flex justify-content-between flex-wrap '+(step == 1 ? 'active-column-checkout' : 'nonactive-column-checkout')} sx={{filter: loadingDadosPessoais ? 'blur(2px)' : 'blur:(0px)'}}>
                                <RadioGroup
                                    row
                                    value={tipoPessoa}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    sx={{justifyContent: 'space-between', width: '100%'}}
                                >
                                    <FormControlLabel value="1" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoPessoa} label="Pessoa Física" />
                                    <FormControlLabel value="2" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoPessoa} label="Pessoa Jurídica" />
                                </RadioGroup>
                                <TextField sx={{width: '100%',  marginBottom: '12px'}} onChange={changeName} value={nameUser} disabled={disabledUser && false} label="Nome Completo*" variant="standard" />
                                <TextField sx={{width: '100%',  marginBottom: '12px'}} onChange={changeEmail} error={errorEmail} value={emailUser} disabled={disabledUser && false} onBlur={verificaEmail} helperText={errorEmail ? "Email já cadastrado" : ''} label="Email*" variant="standard" />
                                <ReactInputMask
                                    mask="(99) 99999-9999"
                                    value={telCelular}
                                    onChange={changeCelular}
                                    maskChar=""
                                >
                                    {(inputProps) => (
                                        <TextField
                                        {...inputProps}
                                        label="Telefone fixo ou Celular*"
                                        variant="standard"
                                        sx={{
                                            '& .MuiInputBase-input::placeholder': {
                                                fontSize: '23px', 
                                                fontWeight: 'bold',
                                            },width: '100%',  marginBottom: '8px'
                                        }}
                                        />
                                    )}
                                </ReactInputMask>
                                {tipoPessoa == '2' && 
                                    <>
                                        <TextField sx={{width: '45%',  marginBottom: '12px'}} value={cnpj} onChange={changeCnpj} disabled={disabledUserPJ} label="CNPJ*" variant="standard" />
                                        <TextField sx={{width: '45%',  marginBottom: '12px'}} value={inscEstadual} onChange={changeInscricaoEstadual} disabled={disabledUserPJ} label="Inscrição Estadual*" variant="standard" />
                                        <TextField sx={{width: '100%',  marginBottom: '12px'}} value={razaoSocial} onChange={changeRazaoSocial} disabled={disabledUserPJ} label="Razão Social*" variant="standard" />
                                    </>
                                }
                                {tipoPessoa == '1' && 
                                    <>
                                        <ReactInputMask
                                            mask="999.999.999-99"
                                            value={cpf}
                                            onChange={handleChangeCpf}
                                            disabled={disabledUserPF}
                                            maskChar=""
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                {...inputProps}
                                                label="CPF*"
                                                error={errorCpf}
                                                helperText={errorCpf ? "Cpf inválido ou já cadastrado" : ''}
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInputBase-input::placeholder': {
                                                        fontSize: '23px', 
                                                        fontWeight: 'bold',
                                                    },width: '100%',  marginBottom: '8px'
                                                }}
                                                />
                                            )}
                                        </ReactInputMask>
                                    </>
                                }
                                <div className='mb-3 mt-3'>
                                    <Checkbox sx={{'& .MuiCheckbox-label': {zIndex: '55'}}} label={<>Quero receber ofertas futuras</>}/>
                                    <Checkbox sx={{'& .MuiCheckbox-label': {zIndex: '55'}}} label={<>Aceito a <Link sx={{color: 'blue'}} underline="hover" color="inherit" href="/">Política de Privacidade</Link></>}/>
                                </div>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    className='mb-3'
                                    fullWidth 
                                    onClick={() => changeStep(2)}
                                    disabled={loadBtn}
                                >
                                    Continuar
                                </Button>
                            </Box>
                        </form>
                    </div>
                    <div className="shipping content-ship-pay px-3">
                        <span className='title-section'>
                            Entrega
                        </span>
                        <form action="" className='d-flex justify-content-center flex-wrap position-relative'>
                            <button type='button' className='button-change-checkout' onClick={() => changeStep(2)} style={{display: step == 2 ? 'none' : 'block'}}>
                                <LocalShippingIcon></LocalShippingIcon>
                            </button>
                            <div className={'d-flex justify-content-center flex-wrap '+(step == 2 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                                <div className={'d-flex justify-content-center align-items-center'} style={{marginTop: '20px',  marginBottom: '8px'}}>
                                    <ReactInputMask
                                        mask="99999-999"
                                        value={cepNumber}
                                        onChange={handleChangeCep}
                                        maskChar=""
                                    >
                                        {(inputProps) => (
                                            <TextField
                                            {...inputProps}
                                            label="Cep*"
                                            variant="standard"
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '23px', 
                                                    fontWeight: 'bold',
                                                },width: '60%',  marginBottom: '8px'
                                            }}
                                            />
                                        )}
                                    </ReactInputMask>
                                </div>
                                <div className='d-flex justify-content-between flex-wrap' style={{ position: 'relative' }}>
                                    {loadingCep ? (
                                        <Box sx={{ 
                                            position: 'absolute', 
                                            top: '40%', 
                                            left: '50%', 
                                            transform: 'translate(-50%, -50%)', 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            zIndex: '99999'
                                        }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : ''}
                                    <Box className='d-flex justify-content-between flex-wrap' sx={{filter: loadingCep ? 'blur(2px)' : 'blur:(0px)'}}>
                                        <TextField sx={{width: '100%',  marginBottom: '8px', marginTop: '0px'}} value={endereco} onChange={changeEndereco} label="Endereço de Entrega*" variant="standard" />
                                        <TextField sx={{width: '19%',  marginBottom: '8px'}} value={numero} onChange={changeNumero} label="Número*" variant="standard" />
                                        <TextField sx={{width: '45%',  marginBottom: '8px'}} value={complemento} onChange={changeComplemento} label="Complemento" variant="standard" />
                                        <TextField sx={{width: '31%',  marginBottom: '8px'}} value={estado} onChange={changeEstado} label="Estado*" variant="standard" />
                                        <TextField sx={{width: '42%',  marginBottom: '8px'}} value={cidade} onChange={changeCidade} label="Cidade*" variant="standard" />
                                        <TextField sx={{width: '42%',  marginBottom: '8px'}} value={bairro} onChange={changeBairro} label="Bairro*" variant="standard" />
                                    </Box>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        className='mb-3'
                                        fullWidth 
                                        onClick={() => changeStep(3)}
                                        disabled={loadBtn}
                                    >
                                        Continuar
                                    </Button>
                                </div> 
                            </div>
                        </form>
                    </div>
                    <div className="payment content-ship-pay px-5">
                        <span className='title-section'>
                            Pagamento
                        </span>
                        <div className="position-relative d-flex flex-wrap" style={{ width: '100%', height: '100%' }}>
                            <button type='button' className='button-change-checkout' onClick={() => changeStep(3)} style={{display: step == 3 ? 'none' : 'block'}}>
                                <LocalAtmIcon></LocalAtmIcon>
                            </button>
                            <div className={'d-flex justify-content-center flex-wrap '+(step == 3 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                                <RadioGroup
                                    row
                                    value={tipoCompra}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    sx={{justifyContent: 'space-between', width: '100%', marginTop: '15px'}}
                                >
                                    <FormControlLabel value="1" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoCompra} label="Cartão de Crédito" />
                                    <FormControlLabel value="2" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoCompra} label="Pix" />
                                </RadioGroup>
                                {tipoCompra == '1' &&    
                                    <div className='d-flex justify-content-between flex-wrap' style={{height: '158px'}}>
                                        <ReactInputMask
                                            mask="9999 9999 9999 9999"
                                            value={cardNumber}
                                            onChange={handleChangeCardNumber}
                                            disabled={isMaskedCC}
                                            maskChar="X"
                                            >
                                            {(inputProps) => (
                                                <TextField
                                                {...inputProps}
                                                label="Número do Cartão"
                                                variant="standard"
                                                placeholder='•••• •••• •••• ••••'
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                {flagCard}
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-input::placeholder': {
                                                        fontSize: '23px', 
                                                        fontWeight: 'bold',
                                                    },width: '100%',  marginBottom: '4px', marginTop: '0px'
                                                }}
                                                />
                                            )}
                                        </ReactInputMask>
                                        <TextField sx={{width: '25%',  marginBottom: '7px'}} disabled={isMaskedCC} onChange={changeCCV} value={CVV} label="CVV*" variant="standard" />
                                        <TextField sx={{width: '45%',  marginBottom: '7px'}} disabled={isMaskedCC} onChange={changeExpireCC} value={expireCC} label="Validade*" placeholder='mm/aa' variant="standard" />
                                        <div style={{width: '100%', marginTop: '25px'}}>
                                            <Checkbox label="Guardar para compras futuras"/>
                                        </div>
                                    </div>
                                }
                                {tipoCompra == '2' &&    
                                    <div className='d-flex justify-content-center align-items-center' style={{height: '158px'}}>
                                        <span>A chave pix será liberada após a confirmação</span>
                                    </div>
                                }
                                {tipoPessoa == '2' && 
                                    <div className='d-flex justify-content-between flex-wrap'>
                                        <div style={{width: '100%', marginTop: '3px'}}>
                                            <Checkbox label="Estou autorizado a comprar em nome da empresa"/>
                                        </div>
                                    </div>
                                }
                                <div className="btn-pay mt-3">
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth 
                                        onClick={handlePayButton}
                                        disabled={loadBtn}
                                    >
                                        {loadBtn ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Finalizar Compra'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CheckoutPage;