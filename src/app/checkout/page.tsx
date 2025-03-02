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
    const { cartItems, cartData } = useCart();
    const [discountPix, setDiscountPix] = useState(5);
    const { user } = useAuth();

    // Verificar se o usuário está logado
    useEffect(() => {
        if (!user || !user.id) {
            showToast('Você precisa estar logado para finalizar a compra', 'error');
            router.push('/login?redirect=checkout');
        }
    }, [user, router]);

    // Verificar se há itens no carrinho
    useEffect(() => {
        if (cartItems.length === 0 || cartData.length === 0) {
            showToast('Seu carrinho está vazio', 'error');
            router.push('/');
        }
    }, [cartItems, cartData, router]);

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
        setLoadBtn(true);
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
                    <p>Produto</p>
                    <div className="d-flex justify-content-between">
                        <div className="prods">
                            {cartData.map((item, index) => {
                                const product = cartItems.find(p => p && (p.pro_codigo == item.id || p.pro_codigo == item.produto_id));
                                if (!product) return null;
                                
                                return (
                                <div className="prod" key={item.id || item.produto_id}>
                                    <Image
                                        src={product.pro_imagem ? product.pro_imagem : HeadphoneImg}
                                        alt={product.pro_descricao || "Produto"}
                                        layout="responsive"
                                    />
                                    <div className="info-prod">
                                        <span className='title-prod'>{product.pro_descricao}</span>
                                        <div className="more-info">
                                            <span className='sku'>{product.pro_referencia || 'Sem referência'}</span>
                                            {product.tipo && (
                                            <div style={{display: 'flex'}}>
                                                <span style={{marginRight: '8px'}}>Tipo: </span>
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
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'center', color: '#2a3b7b', fontSize: '20px'}}>Quantidade</th>
                                        <th colSpan={2} style={{textAlign: 'center', color: '#2a3b7b', fontSize: '20px'}}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{textAlign: 'center'}}>{cartData.length}</td>
                                        <th>R$</th>
                                        <th style={{textAlign: 'end'}}>{calculateSubtotal().toFixed(2).replace('.',',')}</th>
                                    </tr>
                                    <tr>
                                        <td>Subtotal</td>
                                        <td>R$</td>
                                        <td>{calculateSubtotal().toFixed(2).replace('.',',')}</td>
                                    </tr>
                                    <tr>
                                        <td>Descontos</td>
                                        <td>R$</td>
                                        <td>-{applyCouponDiscount(calculateSubtotal()).toFixed(2).replace('.',',')}</td>
                                    </tr>
                                    <tr>
                                        <th>Total à vista</th>
                                        <td>R$</td>
                                        <td>{applyDiscounts(calculateSubtotal()).toFixed(2).replace('.',',')}</td>
                                    </tr>
                                    <tr>
                                        <td>Entrega</td>
                                        <td>R$</td>
                                        <td>15,90</td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td>R$</td>
                                        <td>{(applyDiscounts(calculateSubtotal()) + 15.90).toFixed(2).replace('.',',')}</td>
                                    </tr>
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
                            {tipoPessoa == '2' && 
                                <>
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} label="CNPJ*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '12px'}} label="Inscrição Estadual*" variant="standard" />
                                    <TextField sx={{width: '100%',  marginBottom: '12px'}} label="Razão Social*" variant="standard" />
                                </>
                            }
                            <TextField sx={{width: '100%',  marginBottom: '12px'}} label="Nome Completo*" variant="standard" />
                            <TextField sx={{width: '45%',  marginBottom: '12px'}} label="Telefone*" variant="standard" />
                            <TextField sx={{width: '45%',  marginBottom: '12px'}} label="Celular*" variant="standard" />
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
                                    <TextField sx={{width: '100%',  marginBottom: '8px', marginTop: '0px'}} value={endereco} label="Endereço de Entrega*" variant="standard" />
                                    <TextField sx={{width: '19%',  marginBottom: '8px'}} label="Número*" variant="standard" />
                                    <TextField sx={{width: '45%',  marginBottom: '8px'}} label="Complemento" variant="standard" />
                                    <TextField sx={{width: '31%',  marginBottom: '8px'}} value={estado} label="Estado*" variant="standard" />
                                    <TextField sx={{width: '42%',  marginBottom: '8px'}} value={cidade} label="Cidade*" variant="standard" />
                                    <TextField sx={{width: '42%',  marginBottom: '8px'}} value={bairro} label="Bairro*" variant="standard" />
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
                            <FormControlLabel value="1" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoCompra} label="Pix" />
                            <FormControlLabel value="2" sx={{margin: '0px'}} control={<Radio />} onClick={changeRadioTipoCompra} label="Cartão de Crédito" />
                        </RadioGroup>
                        {tipoCompra == '1' &&    
                            <div className='d-flex justify-content-center align-items-center' style={{height: '158px'}}>
                                <span>A chave pix será liberada após a confirmação</span>
                            </div>
                        }
                        {tipoCompra == '2' &&    
                            <div className='d-flex justify-content-between flex-wrap' style={{height: '158px'}}>
                                <ReactInputMask
                                    mask="9999 9999 9999 9999"
                                    value={cardNumber}
                                    onChange={handleChangeCardNumber}
                                    maskChar=""
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
                                <TextField sx={{width: '25%',  marginBottom: '7px'}} label="CVV*" variant="standard" />
                                <TextField sx={{width: '45%',  marginBottom: '7px'}} label="Validade*" placeholder='mm/aa' variant="standard" />
                                <div style={{width: '100%', marginTop: '25px'}}>
                                    <Checkbox label="Guardar para compras futuras" defaultChecked/>
                                </div>
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