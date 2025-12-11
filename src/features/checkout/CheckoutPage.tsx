"use client"
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

import LogoColetek from '@/assets/img/logo_coletek.png';
import HeadphoneImg from '@/assets/img/headphone.png';
import '@/assets/css/checkout.css';

import CartComponent from '@/components/Cart';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import Footer from '@/app/footer';

import { useCheckoutCustomer, PAYMENT_METHOD } from './hooks/useCheckoutCustomer';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutPricing } from './hooks/useCheckoutPricing';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { createGuestAccount } from './services/customer-registration';
import { completeCheckoutWithCreditCard, completeCheckoutWithPix } from './services/complete-checkout';

type CartLoadingState = 'loading' | 'ready' | 'empty';
import { useToastSide } from '@/context/ToastSideProvider';
import { detectCardBrand } from './utils/validation';
import { getCartItemImage, getCartItemTitle, getProductSkuCode, getProductCategory } from '@/utils/product';

const CheckoutPage = () => {
    const router = useRouter();
    const { showToast } = useToastSide();
    const { refreshProfile } = useAuth();
    const { cart, loading: cartLoading, clearItems } = useCart();
    
    const [openedCart, setOpenedCart] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cartItems = useMemo(() => cart?.items || [], [cart]);
    
    const cartState: CartLoadingState = useMemo(() => {
        if (cartLoading || cart === null) return 'loading';
        return cartItems.length > 0 ? 'ready' : 'empty';
    }, [cartLoading, cart, cartItems.length]);
    
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
    
    // Callback para calcular frete quando endereço for carregado automaticamente
    const handleAddressLoaded = useCallback(async (postalCode: string) => {
        if (postalCode?.length >= 8) {
            try {
                await calculateShipping(postalCode, true);
            } catch {
                // Erro silencioso - frete será calculado manualmente se necessário
            }
        }
    }, [calculateShipping]);
    
    const {
        formData,
        updateField,
        isAuthenticated,
        maskedCard,
        disabledFields,
        loadingAddress,
        autoFillAddressByPostalCode
    } = useCheckoutCustomer(handleAddressLoaded);
    
    const {
        currentStep,
        goToStep,
        errors,
        validatingCPF,
        checkCPFAvailability,
        checkEmailAvailability,
        validatePhoneField,
        validatePasswordFields
    } = useCheckoutSteps(formData, isAuthenticated);

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
        if (cartState === 'empty' && !hasRedirected.current) {
            hasRedirected.current = true;
            showToast('Seu carrinho está vazio', 'error');
            router.push('/');
        }
    }, [cartState, router, showToast]);

    // Enquanto carrega o carrinho, mostra loading
    if (cartState === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-3">Carregando carrinho...</p>
                </div>
            </div>
        );
    }
    
    const handleChangeCardNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateField('cardNumber', event.target.value);
    };
    
    const handleAddressFetch = async () => {
        await autoFillAddressByPostalCode();
        
        if (formData.postalCode?.length === 9) {
            try {
                await calculateShipping(formData.postalCode, isAuthenticated);
            } catch {
                showToast('Erro ao calcular frete', 'error');
            }
        }
    };
    
    const handlePaymentSubmit = async () => {
        // Validação de cartão de crédito
        if (formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD) {
            if (!maskedCard.isMasked && (!formData.cardNumber || !formData.cardExpirationDate || !formData.cardHolderName)) {
                showToast('Preencha todos os dados do cartão de crédito', 'error');
                return;
            }
            // CVV é sempre obrigatório, mesmo com cartão salvo
            if (!formData.cardCVV) {
                showToast('Informe o CVV do cartão', 'error');
                return;
            }
        }
        
        // Validação de autorização PJ
        if (formData.profileType === '2' && !formData.companyPurchaseAuthorization) {
            showToast('Você precisa confirmar que está autorizado a comprar em nome da empresa', 'error');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const registerCustomer = async (customerData: any) => {
                const response = await createGuestAccount({
                    ...customerData,
                    birthDate: formData.birthDate
                });
                await refreshProfile();
                return response;
            };
            
            const result = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD
                ? await completeCheckoutWithCreditCard(formData, maskedCard, isAuthenticated, registerCustomer)
                : await completeCheckoutWithPix(
                    formData, 
                    parseFloat(calculateSubtotal()) * (1 - (pixDiscount / 100)),
                    isAuthenticated,
                    registerCustomer
                );
            
            if (result.success) {
                showToast(formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD ? 'Pagamento processado com sucesso!' : 'PIX gerado com sucesso!', 'success');
                await clearItems();
                router.push(result.redirectUrl!);
            } else {
                showToast(result.message || 'Erro no processamento', 'error');
            }
        } catch (error: any) {
            showToast(error?.message || 'Erro no processamento do pagamento', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                {!maskedCard.isMasked && formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD && !formData.cardNumber && !formData.cardHolderName && (
                    <div className="alert-message" style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '20px', color: '#0d6efd', textAlign: 'center' }}>
                        <span>Preencha os dados do cartão para continuar</span>
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
                                            src={getCartItemImage(item)}
                                            alt={getCartItemTitle(item)}
                                            layout="responsive"
                                            width={200}
                                            height={200}
                                            unoptimized
                                        />
                                        <div className="info-prod">
                                            <span className='title-prod'>{getCartItemTitle(item)}</span>
                                            <div className="more-info">
                                                <span className='sku'>SKU: {getProductSkuCode(item)}</span>
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
                                    loadingPersonalData={validatingCPF}
                                    onChangeProfileType={(value) => updateField('profileType', value)}
                                    onUpdateField={updateField}
                                    onValidateCPF={checkCPFAvailability}
                                    onValidateEmail={checkEmailAvailability}
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
                                    loadingAddress={loadingAddress}
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

