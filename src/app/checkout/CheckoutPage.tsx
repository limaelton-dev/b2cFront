"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, Breadcrumbs, Typography, CircularProgress } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

// Assets
import LogoColetek from '../assets/img/logo_coletek.png';
import HeadphoneImg from '../assets/img/headphone.png';
import '../assets/css/checkout.css';

// Componentes
import Cart from '../components/Cart';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import Footer from '../footer';

// Hooks e Utils
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useCheckoutPricing } from './hooks/useCheckoutPricing';
import { useCart } from '../context/CartProvider';
import { useCoupon } from '../context/coupon';
import { useToastSide } from '../context/ToastSideProvider';
import { detectCardBrand } from './utils/validation';

// Serviços
import { processCreditCardPayment, processPixPayment } from '../services/payment';
import { getUserPersonalData } from '../services/profile';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

/**
 * Componente principal da página de checkout
 */
const CheckoutPage = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { cartItems, cartData, removeItems } = useCart();
    const { coupon } = useCoupon();
    
    // Estado local do carrinho
    const [openedCart, setOpenedCart] = useState(false);
    const [flagCard, setFlagCard] = useState<JSX.Element>(<></>);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Hooks personalizados
    const {
        formData,
        updateField,
        errors,
        loadings,
        disabledFields,
        currentStep,
        goToStep,
        isAuthenticated,
        maskedCard,
        validateCPFOnServer,
        validateEmailOnServer,
        validatePhoneField,
        validatePasswordFields,
        fetchAddress,
        registerUser,
        updateUserProfile,
        addUserPhone,
        addUserAddress,
        addUserCard
    } = useCheckoutForm();
    
    // Hook de cálculos de preço
    const {
        freteNome,
        fretePreco,
        prazo,
        discountPix,
        calculateSubtotal,
        calculateRawTotal,
        getPixDiscountedPrice,
        calculateShipping
    } = useCheckoutPricing(cartItems, cartData);
    
    /**
     * Verifica se há itens no carrinho
     */
    useEffect(() => {
        if (cartItems.length === 0 || cartData.length === 0) {
            showToast('Seu carrinho está vazio', 'error');
            router.push('/');
        }
    }, [cartItems, cartData, router, showToast]);
    
    /**
     * Atualiza a bandeira do cartão quando o número mudar
     */
    const handleChangeCardNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateField('cardNumber', event.target.value);
        setFlagCard(detectCardFlag(event.target.value));
    };
    
    /**
     * Detecta a bandeira do cartão e retorna o ícone correspondente
     */
    const detectCardFlag = (number: string): JSX.Element => {
        const cardBrand = detectCardBrand(number);
        
        switch (cardBrand) {
            case 'Visa':
                return <PaymentIcon type="Visa" format="flatRounded" width={40} />;
            case 'Mastercard':
                return <PaymentIcon type="Mastercard" format="logo" width={40} />;
            case 'American Express':
                return <PaymentIcon type="Amex" format="flatRounded" width={40} />;
            case 'Elo':
                return <PaymentIcon type="Elo" format="flatRounded" width={40} />;
            case 'Hipercard':
                return <PaymentIcon type="Hipercard" format="flatRounded" width={50} />;
            default:
                return <></>;
        }
    };
    
    /**
     * Busca endereço e calcula frete quando o CEP for preenchido
     */
    const handleAddressFetch = async () => {
        await fetchAddress();
        
        if (formData.postalCode && formData.postalCode.length === 9) {
            try {
                await calculateShipping(formData.postalCode, isAuthenticated);
            } catch (error) {
                showToast('Erro ao calcular frete', 'error');
            }
        }
    };
    
    /**
     * Processa o checkout e finaliza a compra
     */
    const handlePaymentSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            // Realizar cadastro de usuário, se necessário
            let profileId = 0;
            
            if (!isAuthenticated) {
                const registerResponse = await registerUser();
                if (!registerResponse) {
                    setIsSubmitting(false);
                    return;
                }
                
                // Aguardar um momento para garantir que o token seja aplicado
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Obter o perfil recém-criado para ter o profile_id
                try {
                    const profileResponse = await getUserPersonalData();
                    if (!profileResponse || !profileResponse.id) {
                        throw new Error('Não foi possível obter o profile_id');
                    }
                    profileId = profileResponse.id;
                } catch (personalDataError) {
                    console.error('Erro ao obter dados pessoais:', personalDataError);
                    showToast('Erro ao obter dados pessoais', 'error');
                    setIsSubmitting(false);
                    return;
                }
                
                // Cadastrar dados de perfil (PF ou PJ)
                if (!await updateUserProfile(profileId)) {
                    setIsSubmitting(false);
                    return;
                }
                
                // Cadastrar telefone
                if (!await addUserPhone(profileId)) {
                    setIsSubmitting(false);
                    return;
                }
                
                // Cadastrar endereço
                if (!await addUserAddress(profileId)) {
                    setIsSubmitting(false);
                    return;
                }
            } else {
                // Se o usuário já está autenticado, buscar o profile_id
                try {
                    const profileResponse = await getUserPersonalData();
                    if (profileResponse && profileResponse.id) {
                        profileId = profileResponse.id;
                    }
                } catch (error) {
                    console.error('Erro ao obter perfil:', error);
                    showToast('Erro ao obter dados do perfil', 'error');
                    setIsSubmitting(false);
                    return;
                }
            }
            
            // Montar o endereço completo formatado
            const formattedAddress = `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.postalCode}`;
            
            if (formData.paymentMethod === '1') {
                // Pagamento com cartão de crédito
                // Cadastrar cartão, se necessário
                if (!maskedCard.isMasked && formData.saveCard) {
                    if (!await addUserCard(profileId)) {
                        setIsSubmitting(false);
                        return;
                    }
                }
                
                // Verificar se tem cartão 
                if (!maskedCard.isMasked && (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate)) {
                    showToast('Por favor, preencha os dados do cartão de crédito', 'error');
                    setIsSubmitting(false);
                    return;
                }
                
                // Preparar os dados do pagamento
                const cardNumber = maskedCard.isMasked ? 
                    maskedCard.finalDigits.padStart(16, '0') : 
                    formData.cardNumber.replace(/\s/g, '');
                
                const paymentData = {
                    cardNumber,
                    holder: formData.name,
                    expirationDate: maskedCard.isMasked ? maskedCard.expiration : formData.cardExpirationDate,
                    securityCode: maskedCard.isMasked ? '123' : formData.cardCVV,
                    brand: detectCardBrand(cardNumber),
                    description: "Compra online",
                    Installments: 1,
                    address: formattedAddress,
                    customerData: {
                        name: formData.name,
                        email: formData.email
                    }
                };
                
                try {
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
                        setIsSubmitting(false);
                    }
                } catch (error) {
                    console.error('Erro no processamento do pagamento:', error);
                    showToast(`Erro no pagamento: ${error.message || 'Verifique os dados do cartão'}`, 'error');
                    setIsSubmitting(false);
                }
            } else {
                // Pagamento com PIX
                try {
                    // Calcular o valor com desconto PIX
                    const subtotal = parseFloat(calculateSubtotal(coupon?.percent_discount));
                    const pixAmount = subtotal * (1 - (discountPix / 100));
                    
                    // Preparar os dados do pagamento PIX
                    const pixPaymentData = {
                        amount: pixAmount,
                        description: "Pagamento via PIX",
                        address: formattedAddress,
                        customerData: {
                            name: formData.name,
                            email: formData.email
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
                        setIsSubmitting(false);
                    }
                } catch (error) {
                    console.error('Erro ao gerar PIX:', error);
                    showToast(`Erro ao gerar PIX: ${error.message || 'Tente novamente mais tarde'}`, 'error');
                    setIsSubmitting(false);
                }
            }
        } catch (error) {
            console.error('Erro geral no processamento do pagamento:', error);
            showToast('Ocorreu um erro no processamento do pagamento', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart} />
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
                {!maskedCard.isMasked && formData.paymentMethod === '1' && !formData.cardNumber && !formData.cardCVV && !formData.cardExpirationDate && (
                    <div className="alert-message" style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '20px', color: '#0d6efd', textAlign: 'center' }}>
                        <span>Você precisa cadastrar um cartão para continuar</span>
                    </div>
                )}
                
                <div className="w-100 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            href="/"
                            style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}
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
                                <div className="prod" key={`${itemId}-${index}`}>
                                    <Image
                                        src={(() => {
                                            // Nova estrutura: usar a imagem principal ou a primeira imagem
                                            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                                                const mainImage = product.images.find(img => img.main) || product.images[0];
                                                if (mainImage) {
                                                    return mainImage.standardUrl || mainImage.originalImage || mainImage.url;
                                                }
                                            }
                                            
                                            // Compatibilidade: estrutura antiga
                                            if (product.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
                                                return product.imagens[0].url;
                                            }

                                            if (product.pro_imagem) {
                                                return product.pro_imagem;
                                            }
                                            
                                            return HeadphoneImg;
                                        })()}
                                        alt={product.title || product.name || product.pro_descricao || "Produto"}
                                        layout="responsive"
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                    />
                                    <div className="info-prod">
                                        <span className='title-prod'>{product.title || product.name || product.pro_descricao || "Produto"}</span>
                                        <div className="more-info">
                                            <span className='sku'>SKU: {(() => {
                                                // Nova estrutura: usar o SKU ativo ou o primeiro
                                                if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
                                                    const activeSku = product.skus.find(sku => sku.active) || product.skus[0];
                                                    if (activeSku && activeSku.partnerId) {
                                                        return activeSku.partnerId;
                                                    }
                                                }
                                                
                                                // Compatibilidade: estrutura antiga
                                                return product.pro_referencia || 'Sem referência';
                                            })()}</span>
                                            <span className='quantity'>Qtd: {item.qty || item.quantity || 1}</span>
                                            {(() => {
                                                // Nova estrutura
                                                if (product.category && product.category.name) {
                                                    return (
                                                        <div style={{display: 'flex'}}>
                                                            <span style={{marginRight: '8px'}}>Categoria: </span>
                                                            <span>{product.category.name}</span>
                                                        </div>
                                                    );
                                                }
                                                
                                                // Compatibilidade: estrutura antiga
                                                if (product.tipo && product.tipo.tpo_descricao) {
                                                    return (
                                                        <div style={{display: 'flex'}}>
                                                            <span style={{marginRight: '8px'}}>Categoria: </span>
                                                            <span>{product.tipo.tpo_descricao}</span>
                                                        </div>
                                                    );
                                                }
                                                
                                                return null;
                                            })()}
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
                                            <td>{calculateRawTotal()}</td>
                                        </tr>
                                        <tr>
                                            <td>Descontos</td>
                                            <td>R$</td>
                                            <td>- {coupon ? coupon.percent_discount : 0}%</td>
                                        </tr>
                                        <tr>
                                            <th>Total à vista</th>
                                            <td>R$</td>
                                            <td>{getPixDiscountedPrice(coupon?.percent_discount)}</td>
                                        </tr>
                                        <tr>
                                            <td>Entrega</td>
                                            <td>R$</td>
                                            <td>{fretePreco ? fretePreco.toFixed(2).replace('.',',') : '0,00'}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>R$</td>
                                            <td>{calculateSubtotal(coupon?.percent_discount).replace('.',',')}</td>
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
                            fontWeight: currentStep === 1 ? 'bold' : 'normal',
                            color: currentStep === 1 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: currentStep === 1 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => goToStep(1)}>
                            Dados Pessoais {currentStep !== 1 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(1)} style={{display: currentStep === 1 ? 'none' : 'block'}}>
                            <LocalShippingIcon />
                        </button>
                        
                        <Box className={'d-flex justify-content-between flex-wrap ' + (currentStep === 1 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 1 && (
                                <PersonalInfoForm 
                                    formData={formData}
                                    errors={errors}
                                    disabledFields={{
                                        user: disabledFields.user,
                                        personalPF: disabledFields.personalPF,
                                        personalPJ: disabledFields.personalPJ
                                    }}
                                    isAuthenticated={isAuthenticated}
                                    loadingPersonalData={loadings.personalData}
                                    onChangeProfileType={(value) => updateField('profileType', value)}
                                    onUpdateField={updateField}
                                    onValidateCPF={validateCPFOnServer}
                                    onValidateEmail={validateEmailOnServer}
                                    onValidatePhone={validatePhoneField}
                                    onContinue={() => goToStep(2)}
                                />
                            )}
                        </Box>
                    </div>
                    
                    <div className="shipping content-ship-pay px-3">
                        <span className='title-section' style={{ 
                            cursor: 'pointer', 
                            fontWeight: currentStep === 2 ? 'bold' : 'normal',
                            color: currentStep === 2 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: currentStep === 2 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => goToStep(2)}>
                            Entrega {currentStep !== 2 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(2)} style={{display: currentStep === 2 ? 'none' : 'block'}}>
                            <LocalShippingIcon />
                        </button>
                        
                        <div className={'d-flex justify-content-center flex-wrap ' + (currentStep === 2 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 2 && (
                                <AddressForm 
                                    formData={formData}
                                    disabledFields={{
                                        address: disabledFields.address
                                    }}
                                    loadingAddress={loadings.cep}
                                    freteNome={freteNome}
                                    fretePreco={fretePreco}
                                    prazo={prazo}
                                    onUpdateField={updateField}
                                    onFetchAddress={handleAddressFetch}
                                    onContinue={() => goToStep(3)}
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="payment content-ship-pay px-5">
                        <span className='title-section' style={{ 
                            cursor: 'pointer', 
                            fontWeight: currentStep === 3 ? 'bold' : 'normal',
                            color: currentStep === 3 ? '#0d6efd' : 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 0',
                            borderBottom: currentStep === 3 ? '2px solid #0d6efd' : 'none',
                            transition: 'all 0.3s ease'
                        }} onClick={() => goToStep(3)}>
                            Pagamento
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(3)} style={{display: currentStep === 3 ? 'none' : 'block'}}>
                            <LocalAtmIcon />
                        </button>
                        
                        <div className={'d-flex justify-content-center flex-wrap ' + (currentStep === 3 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 3 && (
                                <PaymentForm 
                                    formData={formData}
                                    isSubmitting={isSubmitting}
                                    maskedCard={maskedCard}
                                    cardFlag={flagCard}
                                    onUpdateField={updateField}
                                    onCardNumberChange={handleChangeCardNumber}
                                    onPaymentSubmit={handlePaymentSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage; 