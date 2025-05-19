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
import { getProfileUser, getUserPersonalData } from '../services/profile';
import { processCreditCardPayment, validatePayment, formatCreditCardData, detectCardBrand, processPixPayment } from '../services/payment';
import { cpfValidation, emailVerify, addPhone, valorFrete, valorFreteDeslogado } from '../services/checkout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { login, register } from '../services/auth';
import { addAddress, addCard, updateProfile } from '../minhaconta/services/userAccount';
import { saveToken } from '../utils/auth';
import { useCookies } from 'react-cookie';
import HomeIcon from '@mui/icons-material/Home';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import Drawer from '@mui/material/Drawer';
import ClientOnly from '../components/ClientOnly';

async function buscaTipoPessoa() {
    try {
        const resp = await getProfileUser();
        
        if (resp) {
            return {
                id: resp.id || 0,
                profileType: resp.profileType || '',
                birth_date: resp.birth_date || '',
                profile: {
                    tradingName: resp.tradingName || '',
                    cpf: resp.cpf || '',
                    cnpj: resp.cnpj || '',
                    stateRegistration: resp.stateRegistration || '',
                },
                address: Array.isArray(resp.address) && resp.address.length > 0 ? resp.address : [],
                card: Array.isArray(resp.card) && resp.cards.length > 0 ? resp.card : []
            };
        }

        return { 
            id: 0, 
            profileType: '', 
            birth_date: '', 
            cpf: '', 
            tradingName: '', 
            cnpj: '', 
            stateRegistration: '', 
            address: [], 
            card: []
        };

    } catch (error) {
        console.error('Erro: ', error);
        return { 
            id: 0, 
            profileType: '', 
            birth_date: '', 
            cpf: '', 
            tradingName: '', 
            cnpj: '', 
            stateRegistration: '', 
            address: [], 
            card: []
        };
    }
}

const CheckoutPage = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { statusMessage, activeCoupon, coupon, setCouponFn } = useCoupon();
    const [cookies, setCookie] = useCookies(['jwt']);
    const [profileId, setProfileId] = useState(0);
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
    const { user, setUserFn } = useAuth();
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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorTelefone, setErrorTelefone] = useState(false);
    const [errorTelefoneMessage, setErrorTelefoneMessage] = useState('');
    const [freteNome, setFreteNome] = useState('');
    const [fretePreco, setFretePreco] = useState(0);
    const [prazo, setPrazo] = useState(0);
    

    // Verificar se o usuário está logado
    useEffect(() => {
        if (user && user.id) {
            setIsAuthenticated(true);
            setNameUser(user.name);
            setEmailUser(user.email);
            setDisabledUser(true);
            setProfileId(user.profile_id);
            // Não vamos desabilitar todos os campos automaticamente
            // Os campos serão desabilitados apenas se tiverem valores válidos
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
        if (!product || !item) return 0;
        
        // Verificar se o item tem um preço definido
        if (item.price && !isNaN(item.price)) {
            return item.price * (item.qty || item.quantity || 1);
        }
        
        // Verificar se o produto tem preço de venda
        if (product.pro_precovenda && !isNaN(product.pro_precovenda)) {
            return product.pro_precovenda * (item.qty || item.quantity || 1);
        }
        
        // Verificar se o produto tem preço de última compra
        if (product.pro_valorultimacompra && !isNaN(product.pro_valorultimacompra)) {
            return product.pro_valorultimacompra * (item.qty || item.quantity || 1);
        }
        
        // Se nenhum preço válido for encontrado, retornar 0
        return 0;
    };

    // Função para calcular o subtotal do carrinho
    const calculateSubtotal = () => {
        // Calcular o valor base dos produtos com verificações robustas
        const baseTotal = cartItems.reduce((total, item) => {
            const index = cartData.findIndex(i => i.id === item.id || i.produto_id === item.pro_codigo);
            const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
            const price = item.pro_precovenda || 0;
            return total + (price * qty);
        }, 0);

        // Aplicar descontos
        const discountedTotal = applyDiscounts(baseTotal);
        
        // Adicionar custo de entrega e formatar
        return (Number(discountedTotal.toFixed(2)) + Number(shippingCost)).toFixed(2);
    };

    // Função para caso tenha descontos diferentes
    const applyDiscounts = (val) => {
        if (!val || isNaN(val)) return 0;
        
        let result = val; 
        if (coupon && coupon.percent_discount)
            result = val - ((coupon.percent_discount / 100) * val);

        return result;
    }

    const applyCouponDiscount = (val) => {
        if (!val || isNaN(val)) return 0;
        
        if (coupon && coupon.percent_discount)
            return val - ((coupon.percent_discount / 100) * val);

        return val;
    }

    const applyPixDiscount = (val) => {
        if (!val || isNaN(val)) return 0;
        
        if (!discountPix) return val;

        if (coupon && coupon.percent_discount)
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
                    const resultPessoa = await buscaTipoPessoa();
                    
                    // Buscar dados pessoais para obter o telefone
                    const userData = await getUserPersonalData();
                    
                    // Verificar se existem telefones cadastrados
                    if (userData && userData.phones && userData.phones.length > 0) {
                        // Obter o telefone principal ou o primeiro da lista
                        const primaryPhone = userData.phones.find(phone => phone.is_primary) || userData.phones[0];
                        if (primaryPhone) {
                            // Formatar o telefone no padrão (99) 99999-9999
                            const phoneNumber = primaryPhone.number;
                            const formattedPhone = phoneNumber.length === 11 
                                ? `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`
                                : phoneNumber.length === 10 
                                    ? `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6)}`
                                    : phoneNumber;
                            
                            setTelCelular(formattedPhone);
                        }
                    }
    
                    if (resultPessoa.profileType === 'PF') {
                        setCpf(resultPessoa.profile.cpf);
                        setDisabledUserPF(resultPessoa.profile.cpf && resultPessoa.profile.cpf.length > 0); // Campo CPF só será desabilitado se existir
                        setTipoPessoa('1');
                    } 
                    if (resultPessoa.profileType === 'PJ') {
                        setCnpj(resultPessoa.profile.cnpj);
                        setRazaoSocial(resultPessoa.profile.tradingName);
                        setInscEstadual(resultPessoa.profile.stateRegistration);
                        // Desabilitar campos apenas se todos os dados de PJ estiverem preenchidos
                        const temDadosPJCompletos = resultPessoa.profile.cnpj && resultPessoa.profile.tradingName && resultPessoa.profile.stateRegistration;
                        setDisabledUserPJ(temDadosPJCompletos);
                        setTipoPessoa('2');
                    }

                    // Verificar se há endereços antes de acessar e se estão completos
                    if (resultPessoa.address && resultPessoa.address.length > 0) {
                        const endereco = resultPessoa.address[0];
                        setBairro(endereco.neighborhood || '');
                        setCepNumber(endereco.zipCode || '');
                        setNumero(endereco.number || '');
                        setComplemento(endereco.complement || '');
                        setEndereco(endereco.street || '');
                        setCidade(endereco.city || '');
                        setEstado(endereco.state || '');
                        
                        // Verificar se o endereço está completo antes de desabilitar
                        const enderecoCompleto = endereco.street && endereco.neighborhood && 
                                               endereco.city && endereco.state && 
                                               endereco.zipCode && endereco.number;
                        setDisabledAddress(enderecoCompleto);
                        const frete = await valorFrete(endereco.zipCode);
                        if(frete) {
                            setFreteNome('PAC');
                            setFretePreco(frete.data.data.totalPreco);
                            setPrazo(frete.data.data.maiorPrazo);
                        }
                    }

                    // Verificar se há cartões antes de acessar
                    if (resultPessoa.card && resultPessoa.card.length > 0) {
                        const cartao = resultPessoa.card[0];
                        setCVVFinal(cartao.last_four_digits || '');
                        setNumberCCFinal(cartao.card_number || '');
                        setFlagCard(detectCardFlag(cartao.card_number || ''));
                        setExpireCCFinal(cartao.expiration_date || '');
                        setCardNumber(`XXXX XXXX XXXX ${getLastFourDigits(cartao.card_number || '')}`);
                        setCVV('XXX');
                        setExpireCC('XX/XX');
                        setIsMaskedCC(true);
                    }
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
        // Não permitir alteração do tipo de pessoa quando o usuário está logado
        if (!isAuthenticated) {
            setTipoPessoa(e.target.value)
        }
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
            // Primeiro obter os dados pessoais do usuário
            let profileResponse;
            
            // Verificar se o usuário está autenticado
            if (!isAuthenticated) {
                // Validar senhas
                if (!validatePasswords(password, confirmPassword)) {
                    showToast('Por favor, verifique as senhas informadas', 'error');
                    setLoadBtn(false);
                    return;
                }

                // Registrar o usuário
                const arrName = nameUser.split(" ");
                const userData = {
                    name: arrName[0],
                    lastname: arrName.length > 1 ? arrName[arrName.length - 1] : '',
                    username: arrName[0].toLowerCase() + (Math.floor(Math.random() * 1000) + 1),
                    email: emailUser,
                    password: password,
                    repassword: confirmPassword
                }

                let registerResponse;
                try {
                    registerResponse = await register(userData);
                    
                    if (!registerResponse || !registerResponse.token) {
                        showToast('Erro ao criar usuário', 'error');
                        setLoadBtn(false);
                        return;
                    }
                } catch (registerError) {
                    console.error('Erro ao registrar usuário:', registerError);
                    showToast('Erro ao criar usuário', 'error');
                    setLoadBtn(false);
                    return;
                }

                // Salvar o token JWT nos cookies
                saveToken(registerResponse.token);
                setCookie('jwt', registerResponse.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 dias

                // Atualizar o contexto de autenticação
                setUserFn({
                    id: registerResponse.user.id,
                    name: registerResponse.user.name,
                    email: registerResponse.user.email
                });
                
                // Salvar dados do usuário no localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify({
                        id: registerResponse.user.id,
                        name: registerResponse.user.name,
                        email: registerResponse.user.email
                    }));
                }
                
                setIsAuthenticated(true);
                
                // Aguardar um momento para garantir que o token seja aplicado
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Cadastrar dados de perfil (PF ou PJ)
                try {
                    // Criar objeto para dados do perfil
                    let profileUpdateData: any = {
                        profileType: tipoPessoa === '1' ? 'PF' : 'PJ'
                    };
                    
                    // Adicionar dados específicos com base no tipo de pessoa
                    if (tipoPessoa === '1') {
                        // Pessoa Física
                        profileUpdateData.cpf = cpf.replace(/\D/g, '');
                        profileUpdateData.full_name = nameUser;
                    } else {
                        // Pessoa Jurídica
                        profileUpdateData.cnpj = cnpj.replace(/\D/g, '');
                        profileUpdateData.trading_name = razaoSocial;
                        profileUpdateData.state_registration = inscEstadual;
                    }
                    
                    // Atualizar perfil
                    await updateProfile(profileUpdateData);
                    showToast('Perfil cadastrado com sucesso', 'success');
                } catch (profileError) {
                    console.error('Erro ao cadastrar dados de perfil:', profileError);
                    showToast('Erro ao cadastrar dados de perfil', 'error');
                    setLoadBtn(false);
                    return; // Interromper o fluxo em caso de erro
                }
                
                // Primeiro obter os dados pessoais para ter o profile_id
                try {
                    profileResponse = await getUserPersonalData();
                    if (!profileResponse || !profileResponse.profile.id) {
                        throw new Error('Não foi possível obter o profile_id');
                    }
                } catch (personalDataError) {
                    console.error('Erro ao obter dados pessoais:', personalDataError);
                    showToast('Erro ao obter dados pessoais', 'error');
                    setLoadBtn(false);
                    return;
                }
                
                // Cadastrar telefone apenas se o usuário não estiver autenticado previamente
                if (telCelular && !isAuthenticated) {
                    try {
                        // Validar telefone novamente antes de cadastrar
                        if (!validaTelefone(telCelular)) {
                            throw new Error('Formato de telefone inválido');
                        }
                        
                        const phoneNumber = telCelular.replace(/\D/g, '');
                        // Criar objeto com os dados necessários para o telefone
                        const phoneData = {
                            phone: phoneNumber,
                            profile_id: profileResponse.profile.id,
                            type: "celular",
                            is_primary: true
                        };
                        await addPhone(phoneData);
                        showToast('Telefone cadastrado com sucesso', 'success');
                    } catch (phoneError) {
                        console.error('Erro ao adicionar telefone:', phoneError);
                        showToast('Erro ao adicionar telefone: ' + (phoneError.message || 'Verifique o formato'), 'error');
                        setLoadBtn(false);
                        return; // Interromper o fluxo em caso de erro
                    }
                }
                
                // Cadastrar endereço
                try {
                    const addressData = {
                        street: endereco,
                        number: numero,
                        complement: complemento,
                        neighborhood: bairro,
                        city: cidade,
                        state: estado,
                        zipCode: cepNumber,
                        isDefault: true,
                    };
                    
                    await addAddress(addressData);
                    showToast('Endereço cadastrado com sucesso', 'success');
                } catch (addressError) {
                    console.error('Erro ao cadastrar endereço:', addressError);
                    showToast('Erro ao cadastrar endereço', 'error');
                    setLoadBtn(false);
                    return; // Interromper o fluxo em caso de erro
                }
            }
            else {
                // Se o usuário já está autenticado, buscar os dados do perfil
                try {
                    profileResponse = await getUserPersonalData();
                    if (!profileResponse) {
                        showToast('Erro ao obter dados do perfil', 'error');
                        setLoadBtn(false);
                        return;
                    }
                } catch (profileError) {
                    console.error('Erro ao obter perfil:', profileError);
                    showToast('Erro ao obter dados do perfil', 'error');
                    setLoadBtn(false);
                    return;
                }
            }

            // Aguardar um momento para garantir que o token seja aplicado
            await new Promise(resolve => setTimeout(resolve, 500));

            // Passo 1: Validar o pagamento no backend
            let validateResponse;
            try {
                validateResponse = await validatePayment({
                    "address_id": 1, // Usar o endereço padrão ou selecionado
                    "payment_method": tipoCompra === '1' ? "card" : "pix",
                    "card_id": 1 // Usar o cartão padrão ou selecionado
                });
                
                if (validateResponse.status !== 200) {
                    showToast('Erro ao validar o pagamento', 'error');
                    setLoadBtn(false);
                    return;
                }
            } catch (validateError) {
                console.error('Erro ao validar pagamento:', validateError);
                showToast('Erro ao validar o pagamento', 'error');
                setLoadBtn(false);
                return;
            }
            
            if (tipoCompra === '1') {
                // Pagamento com cartão
                try {
                    // Verificar se o usuário já tem um cartão cadastrado ou se preencheu os dados do cartão agora
                    const hasCard = isMaskedCC && numberCCFinal;
                    const hasFilledCardData = cardNumber && CVV && expireCC;
                    
                    // Se não houver cartão cadastrado, mas os dados foram informados no checkout
                    if (!hasCard && hasFilledCardData) {
                        // Cadastrar o cartão com os dados informados
                        try {
                            // Preparar dados do cartão incluindo o profile_id
                            const cardData = {
                                card_number: cardNumber.replace(/\s/g, ''),
                                holder_name: nameUser,
                                expiration_date: expireCC,
                                cvv: CVV,
                                is_default: true,
                                profile_id: profileResponse.id
                            };
                            
                            // Cadastrar o cartão
                            const cardResponse = await addCard(cardData);
                            showToast('Cartão cadastrado com sucesso', 'success');
                            
                            // Usar o cartão recém-cadastrado e atualizar o estado da UI
                            setCVVFinal(CVV);
                            setNumberCCFinal(cardNumber.replace(/\s/g, ''));
                            setExpireCCFinal(expireCC);
                            setIsMaskedCC(true); // Marca como cartão já cadastrado para futuras interações
                            
                        } catch (cardError) {
                            console.error('Erro ao cadastrar cartão:', cardError);
                            showToast('Erro ao cadastrar cartão', 'error');
                            setLoadBtn(false);
                            return;
                        }
                    } else if (!hasCard && !hasFilledCardData) {
                        // Se não tem cartão e não preencheu os dados
                        showToast('Por favor, preencha os dados do cartão de crédito', 'error');
                        setLoadBtn(false);
                        return;
                    }
                    
                    // Montar o endereço completo formatado
                    const formattedAddress = `${endereco}, ${numero}${complemento ? ', ' + complemento : ''}, ${bairro}, ${cidade} - ${estado}, ${cepNumber}`;
                    
                    // Preparar os dados do pagamento
                    const paymentData = {
                        cardNumber: hasCard ? numberCCFinal : cardNumber.replace(/\s/g, ''),
                        holder: nameUser,
                        expirationDate: hasCard ? expireCCFinal : expireCC,
                        securityCode: hasCard ? CVVFinal : CVV,
                        brand: detectCardBrand(hasCard ? numberCCFinal : cardNumber),
                        description: "Compra online",
                        Installments: 1, // Alterar se implementar parcelamento
                        address: formattedAddress,
                        customerData: {
                            name: nameUser,
                            email: emailUser
                        }
                    };
                    
                    // Processar o pagamento
                    const paymentResponse = await processCreditCardPayment(paymentData);
                    
                    if (paymentResponse && paymentResponse.success) {
                        // Pagamento bem-sucedido
                        showToast('Pagamento processado com sucesso!', 'success');
                        
                        // Limpar o carrinho
                        await removeItems();
                        
                        // Redirecionar para a página de confirmação
                        router.push(`/pagamento-sucesso?pedido=${paymentResponse.order?.orderId || paymentResponse.transactionId}`);
                    } else {
                        // Erro no pagamento
                        const errorMessage = paymentResponse?.message || 'Erro no processamento do pagamento';
                        showToast(`Erro no pagamento: ${errorMessage}`, 'error');
                        setLoadBtn(false);
                    }
                } catch (error) {
                    console.error('Erro no processamento do pagamento:', error);
                    showToast(`Erro no pagamento: ${error.message || 'Verifique os dados do cartão'}`, 'error');
                    setLoadBtn(false);
                }
            } else {
                // Pagamento com PIX
                try {
                    // Montar o endereço completo formatado
                    const formattedAddress = `${endereco}, ${numero}${complemento ? ', ' + complemento : ''}, ${bairro}, ${cidade} - ${estado}, ${cepNumber}`;
                    
                    // Calcular o valor com desconto PIX
                    const subtotal = calculateSubtotal();
                    const pixAmount = applyPixDiscount(parseFloat(subtotal));
                    
                    // Preparar os dados do pagamento PIX
                    const pixPaymentData = {
                        amount: pixAmount,
                        description: "Pagamento via PIX",
                        address: formattedAddress,
                        customerData: {
                            name: nameUser,
                            email: emailUser
                        }
                    };
                    
                    // Processar o pagamento PIX
                    const pixResponse = await processPixPayment(pixPaymentData);
                    
                    if (pixResponse && pixResponse.success) {
                        // Pagamento PIX gerado com sucesso
                        showToast('PIX gerado com sucesso!', 'success');
                        
                        // Redirecionar para a página de confirmação com dados do PIX
                        router.push(`/pix-checkout?pedido=${pixResponse.order?.orderId || pixResponse.transactionId}&qrcode=${encodeURIComponent(pixResponse.qrCode || '')}&key=${encodeURIComponent(pixResponse.pixKey || '')}`);
                    } else {
                        // Erro ao gerar PIX
                        const errorMessage = pixResponse?.message || 'Erro ao gerar PIX';
                        showToast(`Erro: ${errorMessage}`, 'error');
                        setLoadBtn(false);
                    }
                } catch (error) {
                    console.error('Erro ao gerar PIX:', error);
                    showToast(`Erro ao gerar PIX: ${error.message || 'Tente novamente mais tarde'}`, 'error');
                    setLoadBtn(false);
                }
            }
        } catch (error) {
            console.error('Erro geral no processamento do pagamento:', error);
            showToast('Ocorreu um erro no processamento do pagamento', 'error');
            setLoadBtn(false);
        }
    };

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
                        try {
                            // Preparar dados para API de frete
                            const cleanZipCode = cep.replace(/-/g, '');
                            const products = cartData.map(item => ({
                                productId: Number(item.id),
                                quantity: Number(item.qty || item.quantity || 1)
                            }));
                            
                            // Configurar headers com autorização para usuários autenticados
                            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                            if (user.name) {
                                const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
                                if (token) {
                                    headers['Authorization'] = `Bearer ${token}`;
                                }
                            }
                            
                            // Chamar a API de frete usando a URL base correta
                            const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
                            const freteResponse = await axios.get(
                                `${API_URL}/cart/shipping?zipCode=${cleanZipCode}`,
                                {
                                    headers,
                                    data: {
                                        originZipCode: "01001000",
                                        destinationZipCode: cleanZipCode,
                                        products
                                    }
                                }
                            );
                            
                            // Processar resposta da API
                            if (freteResponse.data && freteResponse.data.success) {
                                const { data: freteData } = freteResponse.data;
                                
                                // Verificar se existem serviços disponíveis
                                if (freteData.availableServices && freteData.availableServices.length > 0) {
                                    const firstService = freteData.availableServices[0];
                                    setFreteNome(firstService.serviceName);
                                    setFretePreco(firstService.price);
                                    setPrazo(firstService.deliveryTime);
                                } else {
                                    // Valores padrão para caso não haja serviços
                                    setFreteNome('');
                                    setFretePreco(0);
                                    setPrazo(0);
                                }
                            }
                        } catch (freteError) {
                            console.error('Erro ao calcular frete:', freteError);
                            // Valores padrão em caso de erro
                            setFreteNome('');
                            setFretePreco(0);
                            setPrazo(0);
                        }
                        
                        // Preencher o endereço com os dados do ViaCEP
                        setEndereco(data.logradouro || '');
                        setBairro(data.bairro || '');
                        setCidade(data.localidade || '');
                        setEstado(data.uf || '');
                    }
                    setLoadingCep(false);
                }, 800);
            } catch (error) {
                alert('Erro ao buscar o endereço.');
                setLoadingCep(false);
            }
        }
    };

    const validaNumCpf = (cpf) => {
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

    const handleChangeCpf = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(event.target.value);
    };

    useEffect(() => {
        if (cpf.length === 14 && !isAuthenticated) 
            validaCpf(cpf);
    }, [cpf])

    const validaCpf = async (cpf: string) => {
        if(cpf.length === 14) {
            const isValidNums = validaNumCpf(cpf);
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

    const validaTelefone = (telefone: string) => {
        // Se o telefone estiver vazio ou com menos de 3 caracteres, não validar ainda
        if (!telefone || telefone.length < 3) {
            setErrorTelefone(false);
            setErrorTelefoneMessage('');
            return true;
        }
        
        const phoneDigits = telefone.replace(/\D/g, '');
        
        // Validação básica - telefone precisa ter ao menos 8 dígitos (fixo) ou 10/11 dígitos (celular)
        if (phoneDigits.length < 8) {
            setErrorTelefone(true);
            setErrorTelefoneMessage('O telefone deve ter ao menos 8 dígitos');
            return false;
        } else if (phoneDigits.length > 11) {
            setErrorTelefone(true);
            setErrorTelefoneMessage('O telefone não pode ter mais que 11 dígitos');
            return false;
        } else {
            setErrorTelefone(false);
            setErrorTelefoneMessage('');
            return true;
        }
    };

    const changeCelular = (event: React.ChangeEvent<HTMLInputElement>) => {
        const phoneValue = event.target.value;
        console.log("entrous: ", phoneValue)
        setTelCelular(phoneValue);
        
        // Remover validação durante digitação, deixar apenas no onBlur
        setErrorTelefone(false);
        setErrorTelefoneMessage('');
    };

    const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameUser(event.target.value);
    };

    const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailUser(event.target.value);
    };

    const changeStep = (newStep) => {
        // Permite navegação livre entre etapas 1 e 2
        if (newStep === 1 || newStep === 2) {
            setStep(newStep);
            return;
        }
        
        // Se estiver tentando acessar o pagamento (etapa 3), validar todos os campos necessários
        if (newStep === 3) {
            // Validar Dados Pessoais (etapa 1)
            if(tipoPessoa == '1') {
                // Verificando se há campos vazios ou se há erros nos dados
                if(!nameUser || !emailUser || !cpf || (!telCelular && !isAuthenticated) || errorCpf || errorEmail) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setStep(1); // Redireciona para etapa 1 para corrigir
                    return;
                }
                
                // Validar o telefone apenas se foi preenchido ou se o usuário não está autenticado
                if(telCelular && !validaTelefone(telCelular)) {
                    showToast('Por favor, verifique o número de telefone', 'error');
                    setStep(1);
                    return;
                }
                
                if(!isAuthenticated && (!password || !confirmPassword)) {
                    showToast('Por favor, preencha os campos de senha', 'error');
                    setStep(1);
                    return;
                }
            }
            else {
                if(!nameUser || !emailUser || !cnpj || (!telCelular && !isAuthenticated) || !razaoSocial || !inscEstadual) {
                    showToast('Por favor, preencha todos os campos de dados pessoais corretamente', 'error');
                    setStep(1);
                    return;
                }
                
                // Validar o telefone apenas se foi preenchido ou se o usuário não está autenticado
                if(telCelular && !validaTelefone(telCelular)) {
                    showToast('Por favor, verifique o número de telefone', 'error');
                    setStep(1);
                    return;
                }
                
                if(!isAuthenticated && (!password || !confirmPassword)) {
                    showToast('Por favor, preencha os campos de senha', 'error');
                    setStep(1);
                    return;
                }
            }

            // Validar Endereço (etapa 2)
            if(!cepNumber || !numero || !endereco || !estado || !cidade || !bairro) {
                showToast('Por favor, preencha todos os campos de endereço', 'error');
                setStep(2); // Redireciona para etapa 2 para corrigir
                return;
            }
            
            // Se passou por todas as validações, avançar para pagamento
            setStep(newStep);
        }
    }

    const changePassword = (e) => {
        setPassword(e.target.value);
        validatePasswords(e.target.value, confirmPassword);
    }

    const changeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        validatePasswords(password, e.target.value);
    }

    const validatePasswords = (pass, confirmPass) => {
        if (pass !== confirmPass) {
            setPasswordError(true);
            setPasswordErrorMessage('As senhas não coincidem');
            return false;
        } else if (pass.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('A senha deve ter pelo menos 6 caracteres');
            return false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
            return true;
        }
    }

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
            </ClientOnly>
            <header>
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <Image
                            src={LogoColetek}
                            alt="Logo Coletek"
                            unoptimized={true}
                            width={150}
                            height={50}
                            style={{
                                maxWidth: '100%',
                                height: 'auto'
                            }}
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
                {!isMaskedCC && tipoCompra === '1' && !cardNumber && !CVV && !expireCC && (
                    <div className="alert-message" style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '20px', color: '#0d6efd', textAlign: 'center' }}>
                        <span>Você precisa cadastrar um cartão para continuar</span>
                    </div>
                )}
                <div className="w-100 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="inherit"
                            href="/"
                        >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Link>
                        <Typography
                            sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        >
                            Checkout
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="prod-total">
                    <div className="d-flex justify-content-between">
                        <div className="prods">
                            {Array.isArray(cartData) && cartData.length > 0 && Array.isArray(cartItems) && cartItems.length > 0 ? cartData.map((item, index) => {
                                const itemId = item.id || item.produto_id;
                                // Encontra o produto correspondente ao item do carrinho
                                const product = cartItems.find(r => r && (r.id === itemId || r.pro_codigo === itemId));
                                if (!product) return null;
                                return (
                                <div className="prod" key={itemId || index}>
                                    <Image
                                        src={product.imagens && product.imagens[0] ? product.imagens[0].url : HeadphoneImg}
                                        alt={product.pro_descricao || "Produto"}
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                            }) : <div>Nenhum produto no carrinho</div>}
                        </div>
                        <div className="total">
                            <table>
                                <tbody>
                                {
                                    cartItems.length !== 0 ? (
                                    <>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>R$</td>
                                            <td>{cartItems
                                            .reduce((total, item) => {
                                                const index = cartData.findIndex(i => i.id === item.id || i.productId === item.id);
                                                const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
                                                const price = item.price || 0;
                                                return total + (price * qty);
                                            }, 0)
                                            .toFixed(2).replace('.',',')
                                        }</td>
                                        </tr>
                                        <tr>
                                            <td>Descontos</td>
                                            <td>R$</td>
                                            <td>- {coupon ? coupon.percent_discount : 0}%</td>
                                        </tr>
                                        <tr>
                                            <th>Total à vista</th>
                                            <td>R$</td>
                                            <td>{applyPixDiscount(cartItems
                                            .reduce((total, item) => {
                                                const index = cartData.findIndex(i => i.id === item.id || i.productId === item.id);
                                                const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
                                                const price = item.price || 0;
                                                return total + (price * qty);
                                            }, 0))
                                            .toFixed(2).replace('.',',')
                                        }</td>
                                        </tr>
                                        <tr>
                                            <td>Entrega</td>
                                            <td>R$</td>
                                            <td>{fretePreco ? fretePreco.toFixed(2).replace('.',',') : '0,00'}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>R$</td>
                                            <td>{(Number((applyDiscounts(cartItems
                                            .reduce((total, item) => {
                                                const index = cartData.findIndex(i => i.id === item.id || i.productId === item.id);
                                                const qty = index >= 0 ? (cartData[index].qty || cartData[index].quantity || 1) : 1;
                                                const price = item.price || 0;
                                                return total + (price * qty);
                                            }, 0) + fretePreco)
                                            .toFixed(2))) + (shippingCost)).toFixed(2).toString().replace('.',',')
                                        }</td>
                                        </tr>
                                    </>
                                    ) : (
                                        <tr>
                                            <td colSpan={3}>Carrinho vazio</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="ship-pay d-flex justify-content-between flex-wrap">
                    <div className="data-person content-ship-pay">
                        <span className='title-section' style={{ 
                            cursor: 'pointer', 
                            fontWeight: step === 1 ? 'bold' : 'normal',
                            color: step === 1 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: step === 1 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => changeStep(1)}>
                            Dados Pessoais {step !== 1 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
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
                                    <FormControlLabel value="1" sx={{margin: '0px'}} control={<Radio disabled={isAuthenticated} />} onClick={changeRadioTipoPessoa} label="Pessoa Física" />
                                    <FormControlLabel value="2" sx={{margin: '0px'}} control={<Radio disabled={isAuthenticated} />} onClick={changeRadioTipoPessoa} label="Pessoa Jurídica" />
                                </RadioGroup>
                                <TextField sx={{width: '100%',  marginBottom: '12px'}} onChange={changeName} value={nameUser} disabled={disabledUser} label="Nome Completo*" variant="standard" />
                                <TextField sx={{width: '100%',  marginBottom: '12px'}} onChange={changeEmail} error={errorEmail} value={emailUser} disabled={disabledUser} onBlur={verificaEmail} helperText={errorEmail ? "Email já cadastrado" : ''} label="Email*" variant="standard" />
                                {!isAuthenticated && (
                                    <>
                                        <TextField 
                                            sx={{width: '100%', marginBottom: '12px'}} 
                                            onChange={changePassword} 
                                            value={password} 
                                            type="password"
                                            label="Senha*" 
                                            variant="standard" 
                                            error={passwordError}
                                            helperText={passwordErrorMessage}
                                        />
                                        <TextField 
                                            sx={{width: '100%', marginBottom: '12px'}} 
                                            onChange={changeConfirmPassword} 
                                            value={confirmPassword} 
                                            type="password"
                                            label="Confirmar Senha*" 
                                            variant="standard" 
                                            error={passwordError}
                                            helperText={passwordError ? passwordErrorMessage : ''}
                                        />
                                    </>
                                )}
                                <ReactInputMask
                                    mask="(99) 99999-9999"
                                    value={telCelular}
                                    onChange={changeCelular}
                                    onBlur={() => validaTelefone(telCelular)}
                                    maskChar=""
                                >
                                    {(inputProps) => (
                                        <TextField
                                        {...inputProps}
                                        label="Telefone fixo ou Celular*"
                                        variant="standard"
                                        error={errorTelefone}
                                        helperText={errorTelefone ? errorTelefoneMessage : ''}
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
                                        <ReactInputMask
                                            mask="99.999.999/9999-99"
                                            value={cnpj}
                                            onChange={changeCnpj}
                                            disabled={disabledUserPJ}
                                            maskChar=""
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    label="CNPJ*"
                                                    variant="standard"
                                                    sx={{
                                                        '& .MuiInputBase-input::placeholder': {
                                                            fontSize: '23px', 
                                                            fontWeight: 'bold',
                                                        },width: '45%',  marginBottom: '8px'
                                                    }}
                                                />
                                            )}
                                        </ReactInputMask>
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
                                    onClick={() => {changeStep(2);}}
                                    disabled={loadBtn}
                                >
                                    Continuar
                                </Button>
                            </Box>
                        </form>
                    </div>
                    <div className="shipping content-ship-pay px-3">
                        <span className='title-section' style={{ 
                            cursor: 'pointer', 
                            fontWeight: step === 2 ? 'bold' : 'normal',
                            color: step === 2 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: step === 2 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => changeStep(2)}>
                            Entrega {step !== 2 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
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
                                    <div className="fretes">
                                        {freteNome && 
                                            <>
                                                <h6 style={{marginTop: '10px'}}>Escolha o frete:</h6>
                                                <div className="frete-box">
                                                    <div className="frete">
                                                        <Checkbox sx={{'& .MuiSvgIcon-root': {background: 'gray', borderRadius: '4px'}, '& .MuiCheckbox-label': {zIndex: '55'}}} label={
                                                            <div className='text-frete'>
                                                                <span>{freteNome} {prazo ? `(até ${prazo} dias úteis)` : ''} </span>
                                                                <span className="price">
                                                                    R$ {fretePreco !== undefined ? fretePreco.toFixed(2).replace('.',',') : '0,00'}
                                                                </span>
                                                            </div>
                                                        } />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
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
                        <span className='title-section' style={{ 
                            cursor: 'pointer', 
                            fontWeight: step === 3 ? 'bold' : 'normal',
                            color: step === 3 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: step === 3 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => changeStep(3)}>
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
                                            <Checkbox disabled={isMaskedCC} label="Guardar para compras futuras"/>
                                        </div>
                                        {isMaskedCC && (
                                            <div style={{width: '100%', marginTop: '10px', textAlign: 'center', color: '#0d6efd', fontSize: '14px'}}>
                                                <p>Você já possui um cartão cadastrado que será utilizado para esta compra.</p>
                                            </div>
                                        )}
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
                                    {!isMaskedCC && tipoCompra === '1' && (!cardNumber || !CVV || !expireCC) && (
                                        <div style={{ 
                                            padding: '10px', 
                                            marginBottom: '10px', 
                                            borderRadius: '4px', 
                                            backgroundColor: '#fee', 
                                            color: '#d33', 
                                            textAlign: 'center' 
                                        }}>
                                            <span>Você precisa informar um cartão para continuar com a compra</span>
                                        </div>
                                    )}
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