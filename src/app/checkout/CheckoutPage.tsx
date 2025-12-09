"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

import LogoColetek from '../assets/img/logo_coletek.png';
import HeadphoneImg from '../assets/img/headphone.png';
import '../assets/css/checkout.css';

import CartComponent from '../components/Cart';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import Footer from '../footer';

import { useCheckoutForm, PAYMENT_METHOD } from './hooks/useCheckoutForm';
import { useCheckoutPricing } from './hooks/useCheckoutPricing';
import { useCart } from '../context/CartProvider';
import { useToastSide } from '../context/ToastSideProvider';
import { detectCardBrand } from './utils/validation';

import { processCreditCardPayment, processPixPayment } from '../api/checkout';
import { getUserPersonalData } from '../api/user/profile/services/profile';

const CheckoutPage = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { cart, clearItems } = useCart();
    
    const [openedCart, setOpenedCart] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cartItems = useMemo(() => cart?.items || [], [cart]);
    
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
        fetchAddress,
        registerUser,
        updateUserProfile,
        addUserPhone,
        addUserAddress,
        addUserCard
    } = useCheckoutForm();
    
    const {
        shippingName,
        shippingPrice,
        deliveryTime,
        pixDiscount,
        calculateSubtotal,
        calculateRawTotal,
        getPixDiscountedPrice,
        calculateShipping
    } = useCheckoutPricing(cartItems);

    const cardFlag = useMemo(() => {
        const brand = detectCardBrand(formData.cardNumber);
        const brandMap: Record<string, JSX.Element> = {
            'Visa': <PaymentIcon type="Visa" format="flatRounded" width={40} />,
            'Mastercard': <PaymentIcon type="Mastercard" format="logo" width={40} />,
            'American Express': <PaymentIcon type="Amex" format="flatRounded" width={40} />,
            'Elo': <PaymentIcon type="Elo" format="flatRounded" width={40} />,
            'Hipercard': <PaymentIcon type="Hipercard" format="flatRounded" width={50} />
        };
        return brandMap[brand] || <></>;
    }, [formData.cardNumber]);
    
    const hasRedirected = useRef(false);
    
    useEffect(() => {
        if (cartItems.length === 0 && !hasRedirected.current) {
            hasRedirected.current = true;
            showToast('Seu carrinho está vazio', 'error');
            router.push('/');
        }
    }, [cartItems.length, router, showToast]);
    
    const handleChangeCardNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateField('cardNumber', event.target.value);
    };
    
    const handleAddressFetch = async () => {
        await fetchAddress();
        
        if (formData.postalCode?.length === 9) {
            try {
                await calculateShipping(formData.postalCode, isAuthenticated);
            } catch {
                showToast('Erro ao calcular frete', 'error');
            }
        }
    };
    
    const handlePaymentSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            let profileId = 0;
            
            if (!isAuthenticated) {
                const registerResponse = await registerUser();
                if (!registerResponse) {
                    setIsSubmitting(false);
                    return;
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                try {
                    const profileResponse = await getUserPersonalData();
                    if (!profileResponse?.id) throw new Error('Não foi possível obter o profile_id');
                    profileId = profileResponse.id;
                } catch {
                    showToast('Erro ao obter dados pessoais', 'error');
                    setIsSubmitting(false);
                    return;
                }
                
                if (!await updateUserProfile(profileId) || !await addUserPhone(profileId) || !await addUserAddress(profileId)) {
                    setIsSubmitting(false);
                    return;
                }
            } else {
                try {
                    const profileResponse = await getUserPersonalData();
                    if (profileResponse?.id) profileId = profileResponse.id;
                } catch {
                    showToast('Erro ao obter dados do perfil', 'error');
                    setIsSubmitting(false);
                    return;
                }
            }
            
            const formattedAddress = `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.postalCode}`;
            
            if (formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD) {
                if (!maskedCard.isMasked && formData.saveCard) {
                    if (!await addUserCard(profileId)) {
                        setIsSubmitting(false);
                        return;
                    }
                }
                
                if (!maskedCard.isMasked && (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate)) {
                    showToast('Por favor, preencha os dados do cartão de crédito', 'error');
                    setIsSubmitting(false);
                    return;
                }
                
                const cardNumber = maskedCard.isMasked 
                    ? maskedCard.finalDigits.padStart(16, '0') 
                    : formData.cardNumber.replace(/\s/g, '');
                
                const paymentData = {
                    cardNumber,
                    holder: formData.name,
                    expirationDate: maskedCard.isMasked ? maskedCard.expiration : formData.cardExpirationDate,
                    securityCode: maskedCard.isMasked ? '123' : formData.cardCVV,
                    brand: detectCardBrand(cardNumber),
                    description: "Compra online",
                    installments: 1,
                    address: formattedAddress,
                    customerData: { name: formData.name, email: formData.email }
                };
                
                try {
                    const paymentResponse = await processCreditCardPayment(paymentData);
                    
                    if (paymentResponse?.success) {
                        showToast('Pagamento processado com sucesso!', 'success');
                        await clearItems();
                        router.push(`/pagamento-sucesso?pedido=${paymentResponse.order?.orderId || paymentResponse.transactionId}`);
                    } else {
                        showToast(`Erro no pagamento: ${paymentResponse?.message || 'Erro no processamento'}`, 'error');
                        setIsSubmitting(false);
                    }
                } catch (error: any) {
                    showToast(`Erro no pagamento: ${error?.message || 'Verifique os dados do cartão'}`, 'error');
                    setIsSubmitting(false);
                }
            } else {
                try {
                    const subtotal = parseFloat(calculateSubtotal());
                    const pixAmount = subtotal * (1 - (pixDiscount / 100));
                    
                    const pixPaymentData = {
                        amount: pixAmount,
                        description: "Pagamento via PIX",
                        address: formattedAddress,
                        customerData: { name: formData.name, email: formData.email }
                    };
                    
                    const pixResponse = await processPixPayment(pixPaymentData);
                    
                    if (pixResponse?.success) {
                        showToast('PIX gerado com sucesso!', 'success');
                        router.push(`/pix-checkout?pedido=${pixResponse.order?.orderId || pixResponse.transactionId}&qrcode=${encodeURIComponent(pixResponse.qrCode || '')}&key=${encodeURIComponent(pixResponse.pixKey || '')}`);
                    } else {
                        showToast(`Erro: ${pixResponse?.message || 'Erro ao gerar PIX'}`, 'error');
                        setIsSubmitting(false);
                    }
                } catch (error: any) {
                    showToast(`Erro ao gerar PIX: ${error?.message || 'Tente novamente mais tarde'}`, 'error');
                    setIsSubmitting(false);
                }
            }
        } catch {
            showToast('Ocorreu um erro no processamento do pagamento', 'error');
            setIsSubmitting(false);
        }
    };

    const getProductImage = (item: any) => {
        const sku = item.sku;
        if (!sku) return HeadphoneImg;
        
        const product = sku.product;
        if (product?.images?.length > 0) {
            const mainImage = product.images.find((img: any) => img.main) || product.images[0];
            return mainImage?.standardUrl || mainImage?.originalImage || mainImage?.url || HeadphoneImg;
        }
        return HeadphoneImg;
    };

    const getProductTitle = (item: any) => 
        item.sku?.product?.title || item.sku?.product?.name || "Produto";

    const getProductSku = (item: any) => 
        item.sku?.partnerId || item.sku?.id || 'Sem referência';

    const getProductCategory = (item: any) => 
        item.sku?.product?.category?.name || null;

    const stepTitleStyle = (isActive: boolean) => ({
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#0d6efd' : 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 0',
        borderBottom: isActive ? '2px solid #0d6efd' : 'none',
        transition: 'all 0.3s ease'
    });

    return (
        <>
            <CartComponent cartOpened={openedCart} onCartToggle={setOpenedCart} />
            <header>
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <Image src={LogoColetek} alt="Logo Coletek" />
                        <div className="secure-buy d-flex align-items-center">
                            <LockOutlinedIcon style={{ color: 'black', fontSize: '35px' }} />
                            <span style={{ fontWeight: 'bold', lineHeight: '19px' }}>
                                Compra<br />100% Segura
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="container">
                {!maskedCard.isMasked && formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD && !formData.cardNumber && !formData.cardCVV && !formData.cardExpirationDate && (
                    <div className="alert-message" style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '20px', color: '#0d6efd', textAlign: 'center' }}>
                        <span>Você precisa cadastrar um cartão para continuar</span>
                    </div>
                )}
                
                <div className="w-100 mb-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Link>
                        <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                            Checkout
                        </Typography>
                    </Breadcrumbs>
                </div>
                
                <div className="prod-total">
                    <div className="d-flex justify-content-between">
                        <div className="prods">
                            {cartItems.length > 0 ? cartItems.map((item, index) => {
                                const category = getProductCategory(item);
                                
                                return (
                                    <div className="prod" key={`${item.skuId}-${index}`}>
                                        <Image
                                            src={getProductImage(item)}
                                            alt={getProductTitle(item)}
                                            layout="responsive"
                                            width={200}
                                            height={200}
                                            unoptimized
                                        />
                                        <div className="info-prod">
                                            <span className='title-prod'>{getProductTitle(item)}</span>
                                            <div className="more-info">
                                                <span className='sku'>SKU: {getProductSku(item)}</span>
                                                <span className='quantity'>Qtd: {item.quantity}</span>
                                                {category && (
                                                    <div style={{ display: 'flex' }}>
                                                        <span style={{ marginRight: '8px' }}>Categoria: </span>
                                                        <span>{category}</span>
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
                                {cartItems.length !== 0 ? (
                                    <>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>R$</td>
                                            <td>{calculateRawTotal()}</td>
                                        </tr>
                                        <tr>
                                            <th>Total à vista ({pixDiscount}% off)</th>
                                            <td>R$</td>
                                            <td>{getPixDiscountedPrice()}</td>
                                        </tr>
                                        <tr>
                                            <td>Entrega</td>
                                            <td>R$</td>
                                            <td>{shippingPrice ? shippingPrice.toFixed(2).replace('.', ',') : '0,00'}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>R$</td>
                                            <td>{calculateSubtotal().replace('.', ',')}</td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan={3}>Carrinho vazio</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="ship-pay d-flex justify-content-between flex-wrap">
                    <div className="data-person content-ship-pay">
                        <span className='title-section' style={stepTitleStyle(currentStep === 1)} onClick={() => goToStep(1)}>
                            Dados Pessoais {currentStep !== 1 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(1)} style={{ display: currentStep === 1 ? 'none' : 'block' }}>
                            <LocalShippingIcon />
                        </button>
                        
                        <Box className={'d-flex justify-content-between flex-wrap ' + (currentStep === 1 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 1 && (
                                <PersonalInfoForm 
                                    formData={formData}
                                    errors={errors}
                                    disabledFields={{ user: disabledFields.user, personalPF: disabledFields.personalPF, personalPJ: disabledFields.personalPJ }}
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
                        <span className='title-section' style={stepTitleStyle(currentStep === 2)} onClick={() => goToStep(2)}>
                            Entrega {currentStep !== 2 && <span style={{ fontSize: '12px', marginLeft: '4px' }}>(clique para editar)</span>}
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(2)} style={{ display: currentStep === 2 ? 'none' : 'block' }}>
                            <LocalShippingIcon />
                        </button>
                        
                        <div className={'d-flex justify-content-center flex-wrap ' + (currentStep === 2 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 2 && (
                                <AddressForm 
                                    formData={formData}
                                    disabledFields={{ address: disabledFields.address }}
                                    loadingAddress={loadings.cep}
                                    shippingName={shippingName}
                                    shippingPrice={shippingPrice}
                                    deliveryTime={deliveryTime}
                                    onUpdateField={updateField}
                                    onFetchAddress={handleAddressFetch}
                                    onContinue={() => goToStep(3)}
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="payment content-ship-pay px-5">
                        <span className='title-section' style={stepTitleStyle(currentStep === 3)} onClick={() => goToStep(3)}>
                            Pagamento
                        </span>
                        
                        <button type='button' className='button-change-checkout' onClick={() => goToStep(3)} style={{ display: currentStep === 3 ? 'none' : 'block' }}>
                            <LocalAtmIcon />
                        </button>
                        
                        <div className={'d-flex justify-content-center flex-wrap ' + (currentStep === 3 ? 'active-column-checkout' : 'nonactive-column-checkout')}>
                            {currentStep === 3 && (
                                <PaymentForm 
                                    formData={formData}
                                    isSubmitting={isSubmitting}
                                    maskedCard={maskedCard}
                                    cardFlag={cardFlag}
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
