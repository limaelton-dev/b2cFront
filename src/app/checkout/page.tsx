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
import { TextDecoderStream } from 'stream/web';
import { useCart } from '../context/cart';
import { useCoupon } from '../context/coupon';
import { useAuth } from '../context/auth';
import ReactInputMask from 'react-input-mask';
import axios from 'axios';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
import { useToastSide } from '../context/toastSide';
import { getProfileUser } from '../services/profile';
import { processPayment, validatePayment } from '../services/payment';

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
                cnpj: resp.cpnj || '',
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

// const mp = window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN);

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
    const [openedCart, setOpenedCart] = useState(false);
    const [dateBirth, setDateBirth] = useState("dd/mm/aaaa");
    const [cpf, setCpf] = useState('');
    const { cartItems, cartData } = useCart();
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
    const [isMaskedCC, setIsMaskedCC] = useState(true);
    const [numberCCFinal, setNumberCCFinal] = useState('');
    const [CVVFinal, setCVVFinal] = useState('');
    const [expireCCFinal, setExpireCCFinal] = useState('');
    const [shippingCost, setShippingCost] = useState(25.90);
    

    // Verificar se o usuário está logado
    useEffect(() => {
        if (!user || !user.id) {
            showToast('Você precisa estar logado para finalizar a compra', 'error');
            router.push('/login?redirect=checkout');
        }
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
        return cartData.reduce((total, item) => {
            const product = cartItems.find(p => p && (p.pro_codigo == item.id || p.pro_codigo == item.produto_id));
            if (product) {
                return total + getProductPrice(product, item);
            }
            return total;
        }, 0);
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
                        setDateBirth(resultPessoa.bith_date);
                        setDisabledUserPF(true);
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
                    setIsMaskedCC(true);
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

    const handlePayButton = () => {
        // setLoadBtn(true);
        // async function realizaCompra() {
        //     const script = document.createElement('script');
        //     script.src = "https://sdk.mercadopago.com/js/v2";
        //     setTimeout(async () =>{
        //         // Inicializar o MercadoPago quando o script for carregado
        //         const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_TOKEN); // Substitua com sua chave pública do Mercado Pago
    
        //         // Associar os campos do cartão
        //         mp.fields({
        //             cardNumber: "5031433215406351",
        //             cardExpirationMonth: "11",
        //             cardExpirationYear: "30",
        //             securityCode: "123",
        //             cardholderName: "APRO",
        //             identificationType: "CPF",
        //             identificationNumber: "12345678909"
        //         });
        //         const validate = await validatePayment(
        //             {
        //                 "address_id": 1,
        //                 "payment_method": "card",
        //                 "card_id": 1
        //             }
        //         );
        //         try {
                    
        //             const cardToken = await mp.createCardToken({
        //                 cardNumber: "5031433215406351",
        //                 cardholderName: "APRO",
        //                 cardExpirationMonth: "11",
        //                 cardExpirationYear: "30",
        //                 securityCode: "123",
        //                 identificationType: "CPF",
        //                 identificationNumber: "12345678909"
        //             });
            
        //             console.log("Token do cartão:", cardToken);
        //         } catch (error) {
        //             console.error("Erro ao gerar token do cartão:", error);
        //         }
        //         if(validate.status == 200) {
        //             processPayment({
        //                 "transaction_amount": 100,
        //                 "description": "Compra de produtos",
        //                 "payment_method_id": "master",
        //                 "token": "f379f4eecb7f20118e882fa3a6a5baf0",
        //                 "installments": 1,
        //                 "external_reference": "123",
        //                 "payer": {
        //                     "email": "test_user_123@testuser.com",
        //                     "identification": {
        //                     "type": "CPF",
        //                     "number": "12345678909"
        //                     },
        //                     "first_name": "APRO",
        //                     "last_name": "User"
        //                 }
        //             })
        //         }
        //     },2000)
        // }
        // realizaCompra();
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
                        setEstado(data.estado || '');
                    }
                    setLoadingCep(false);
                },800)
            } catch (error) {
                alert('Erro ao buscar o endereço.');
            }
        }
    };

    const handleChangeCep = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cepValue = event.target.value;
        setCepNumber(cepValue);
        
        if (cepValue.length === 9) 
            buscarEndereco(cepValue);
    };

    const handleChangeCPF = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(event.target.value);
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

    const changeDateBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateBirth(event.target.value);
    };
      

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
                                            .toFixed(2))) + (shippingCost)).toString().replace('.',',')
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
                        {!user && 
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <span>Logue <Link underline="hover" color="blue" href="/login">aqui</Link> ou cadastre-se abaixo</span>
                            </div>
                        }
                        <form action="" className='d-flex justify-content-between flex-wrap'>
                            {!user &&
                                <>
                                    <TextField sx={{width: '100%', marginBottom: '12px'}} label="Email*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} label="Senha*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} label="Confirmar senha*" variant="standard" />
                                </>
                            }
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
                            <TextField sx={{width: '100%',  marginBottom: '12px'}} value={nameUser} disabled={disabledUser} label="Nome Completo*" variant="standard" />
                            <TextField sx={{width: '100%',  marginBottom: '12px'}} value={emailUser} disabled={disabledUser} label="Email*" variant="standard" />
                            {tipoPessoa == '2' && 
                                <>
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} value={cnpj} onChange={changeCnpj} disabled={disabledUserPJ} label="CNPJ*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} value={inscEstadual} onChange={changeInscricaoEstadual} disabled={disabledUserPJ} label="Inscrição Estadual*" variant="standard" />
                                    <TextField sx={{width: '100%',  marginBottom: '12px'}} value={razaoSocial} onChange={changeRazaoSocial} disabled={disabledUserPJ} label="Razão Social*" variant="standard" />
                                </>
                            }
                            {tipoPessoa == '1' && 
                                <>
                                    <TextField
                                        label="Data de Nascimento"
                                        type="date"
                                        variant="standard"
                                        value={dateBirth}
                                        onChange={changeDateBirth}
                                        disabled={disabledUserPF}
                                        fullWidth
                                    />
                                    <ReactInputMask
                                        mask="999.999.999-99"
                                        value={cpf}
                                        onChange={handleChangeCPF}
                                        disabled={disabledUserPF}
                                        maskChar=""
                                    >
                                        {(inputProps) => (
                                            <TextField
                                            {...inputProps}
                                            label="CPF*"
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
                            
                        </form>
                    </div>
                    <div className="shipping content-ship-pay px-3">
                        <span className='title-section'>
                            Entrega
                        </span>
                        <form action="" className='d-flex justify-content-center flex-wrap'>
                            <div className='d-flex justify-content-center align-items-center' style={{marginTop: '20px',  marginBottom: '8px'}}>
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
                                        alignItems: 'center' 
                                    }}>
                                        <CircularProgress />
                                    </Box>
                                ) : ''}
                                <Box className='d-flex justify-content-between flex-wrap' sx={{filter: loadingCep ? 'blur(2px)' : 'blur:(0px)'}}>
                                    <TextField sx={{width: '100%',  marginBottom: '8px', marginTop: '0px'}} disabled={disabledAddress} value={endereco} label="Endereço de Entrega*" variant="standard" />
                                    <TextField sx={{width: '19%',  marginBottom: '8px'}} value={numero} label="Número*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '8px'}} value={complemento} label="Complemento" variant="standard" />
                                    <TextField sx={{width: '31%',  marginBottom: '8px'}} disabled={disabledAddress} value={estado} label="Estado*" variant="standard" />
                                    <TextField sx={{width: '42%',  marginBottom: '8px'}} disabled={disabledAddress} value={cidade} label="Cidade*" variant="standard" />
                                    <TextField sx={{width: '42%',  marginBottom: '8px'}} disabled={disabledAddress} value={bairro} label="Bairro*" variant="standard" />
                                </Box>
                                <div style={{width: '100%', marginTop: '20px'}}>
                                    <Checkbox sx={{'& .MuiCheckbox-label': {zIndex: '55'}}} label={<>Aceito a <Link sx={{color: 'blue'}} underline="hover" color="inherit" href="/">Política de Privacidade</Link></>} defaultChecked/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="payment content-ship-pay px-5">
                        <span className='title-section'>
                            Pagamento
                        </span>
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
                                    <Checkbox label="Guardar para compras futuras" defaultChecked/>
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
                                    <Checkbox label="Estou autorizado a comprar em nome da empresa" defaultChecked/>
                                </div>
                            </div>
                        }
                        <div className='d-flex justify-content-center'>
                            <button type='button'
                                onClick={handlePayButton}
                                className='btn-buy-primary mt-3'
                            >
                                {loadBtn ? 
                                    <CircularProgress color="inherit" />
                                    :
                                    'Comprar'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CheckoutPage;