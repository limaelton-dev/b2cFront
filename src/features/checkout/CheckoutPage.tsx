"use client"
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumbs, Typography, Paper, List, ListItem, Divider, Box } from '@mui/material';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { PaymentIcon as CardPaymentIcon } from 'react-svg-credit-card-payment-icons';

import LogoColetek from '@/assets/img/logo_coletek.png';
import '@/assets/css/checkout.css';
import styles from './CheckoutPage.module.css';

import CartComponent from '@/components/Cart';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import CheckoutStepSection from './components/CheckoutStepSection';
import Footer from '@/app/footer';

import { useCheckoutCustomer, PAYMENT_METHOD } from './hooks/useCheckoutCustomer';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutPricing } from './hooks/useCheckoutPricing';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { completeCheckoutWithCreditCard, completeCheckoutWithDebitCard, completeCheckoutWithPix } from './services/complete-checkout';

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
        loadingShipping,
        pixDiscount,
        calculateSubtotal,
        calculateRawTotal,
        getPixDiscountedPrice,
        calculateShipping,
        clearShippingData
    } = useCheckoutPricing(cartItems);
    
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
        savedIds,
        disabledFields,
        loadingAddress,
        autoFillAddressByPostalCode,
        clearAddressFields
    } = useCheckoutCustomer(handleAddressLoaded);
    
    const {
        currentStep,
        goToStep,
        errors,
        validatingCPF,
        checkCPFAvailability,
        checkEmailAvailability,
        validatePhoneField,
        validatePasswordFields,
        validateBirthDateField,
        validateCNPJField,
        validateAddressFields,
        validateCardNumberField,
        validateCardExpirationField,
        validateCardCVVField,
        validateCardHolderNameField,
        validateCardHolderDocumentField,
        validateAllCardFields
    } = useCheckoutSteps(formData, isAuthenticated);

    const cardFlag = useMemo(() => {
        const brand = detectCardBrand(formData.cardNumber);
        const brandMap: Record<string, JSX.Element> = {
            'Visa': <CardPaymentIcon type="Visa" format="flatRounded" width={40} />,
            'Mastercard': <CardPaymentIcon type="Mastercard" format="logo" width={40} />,
            'American Express': <CardPaymentIcon type="Amex" format="flatRounded" width={40} />,
            'Elo': <CardPaymentIcon type="Elo" format="flatRounded" width={40} />,
            'Hipercard': <CardPaymentIcon type="Hipercard" format="flatRounded" width={50} />
        };
        return brandMap[brand] || <></>;
    }, [formData.cardNumber]);
    
    const hasRedirected = useRef(false);
    const hasCalculatedInitialShipping = useRef(false);
    
    useEffect(() => {
        if (cartState === 'empty' && !hasRedirected.current) {
            hasRedirected.current = true;
            showToast('Seu carrinho está vazio', 'error');
            router.push('/');
        }
    }, [cartState, router, showToast]);

    useEffect(() => {
        if (
            cartState === 'ready' &&
            formData.postalCode &&
            !shippingName &&
            !loadingShipping &&
            !hasCalculatedInitialShipping.current
        ) {
            const cleanCep = formData.postalCode.replace(/\D/g, '');
            if (cleanCep.length === 8) {
                hasCalculatedInitialShipping.current = true;
                calculateShipping(cleanCep, isAuthenticated).catch(() => {
                    // Erro silencioso
                });
            }
        }
    }, [cartState, formData.postalCode, shippingName, loadingShipping, calculateShipping, isAuthenticated]);

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
    
    const handleAddressFetch = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        
        if (cleanCep.length !== 8) {
            clearShippingData();
            return;
        }
        
        await autoFillAddressByPostalCode(cep);

        try {
            await calculateShipping(cleanCep, isAuthenticated);
        } catch {
            showToast('Erro ao calcular frete', 'error');
        }
    };
    
    const handlePaymentSubmit = async () => {
        const isCardPayment = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD || 
                              formData.paymentMethod === PAYMENT_METHOD.DEBIT_CARD;
        
        if (isCardPayment) {
            if (!validateAllCardFields(maskedCard.isMasked)) {
                showToast('Verifique os dados do cartão', 'error');
                return;
            }
        }
        
        if (formData.profileType === '2' && !formData.companyPurchaseAuthorization) {
            showToast('Você precisa confirmar que está autorizado a comprar em nome da empresa', 'error');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            let result;
            
            if (formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD) {
                result = await completeCheckoutWithCreditCard(formData, maskedCard, isAuthenticated, savedIds);
            } else if (formData.paymentMethod === PAYMENT_METHOD.DEBIT_CARD) {
                result = await completeCheckoutWithDebitCard(formData, maskedCard, isAuthenticated, savedIds);
            } else {
                result = await completeCheckoutWithPix(
                    formData, 
                    parseFloat(calculateSubtotal()) * (1 - (pixDiscount / 100)),
                    isAuthenticated,
                    savedIds
                );
            }
            
            if (result.success) {
                await refreshProfile();
                const successMessage = isCardPayment ? 'Pagamento processado com sucesso!' : 'PIX gerado com sucesso!';
                showToast(successMessage, 'success');
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
                    <div className={styles.alertMessage}>
                        <span>Preencha os dados do cartão para continuar</span>
                    </div>
                )}
                
                <div className={styles.breadcrumbWrapper}>
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
                
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 2.5, 
                        mb: 3, 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        <div className={styles.productsList}>
                            {cartItems.length > 0 ? cartItems.map((item, index) => {
                                const category = getProductCategory(item);
                                
                                return (
                                    <Box 
                                        key={`${item.skuId}-${index}`}
                                        sx={{ 
                                            display: 'flex', 
                                            gap: 2, 
                                            mb: 2,
                                            pb: 2,
                                            borderBottom: index < cartItems.length - 1 ? '1px solid' : 'none',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Image
                                            src={getCartItemImage(item)}
                                            alt={getCartItemTitle(item)}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'contain', borderRadius: 8 }}
                                            unoptimized
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                                {getCartItemTitle(item)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                SKU: {getProductSkuCode(item)} • Qtd: {item.quantity}
                                                {category && ` • ${category}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            }) : (
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum produto no carrinho
                                </Typography>
                            )}
                        </div>
                        
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                bgcolor: '#f8f9fa', 
                                p: 2, 
                                borderRadius: 2,
                                minWidth: 280
                            }}
                        >
                            {cartItems.length !== 0 ? (
                                <List dense disablePadding>
                                    <ListItem sx={{ justifyContent: 'space-between', py: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography variant="body2">R$ {calculateRawTotal()}</Typography>
                                    </ListItem>
                                    <ListItem sx={{ justifyContent: 'space-between', py: 1 }}>
                                        <Typography variant="body2" color="success.main" fontWeight={500}>
                                            Total à vista ({pixDiscount}% off)
                                        </Typography>
                                        <Typography variant="body2" color="success.main" fontWeight={500}>
                                            R$ {getPixDiscountedPrice()}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ justifyContent: 'space-between', py: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Entrega</Typography>
                                        <Typography variant="body2">
                                            R$ {shippingPrice ? shippingPrice.toFixed(2).replace('.', ',') : '0,00'}
                                        </Typography>
                                    </ListItem>
                                    <Divider sx={{ my: 1 }} />
                                    <ListItem sx={{ justifyContent: 'space-between', py: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                            R$ {calculateSubtotal().replace('.', ',')}
                                        </Typography>
                                    </ListItem>
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Carrinho vazio
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Paper>
                
                <div className={styles.stepsContainer}>
                    <CheckoutStepSection
                        title="Dados Pessoais"
                        stepNumber={1}
                        currentStep={currentStep}
                        icon={<PersonOutlineIcon />}
                        onStepClick={goToStep}
                    >
                        <PersonalInfoForm 
                            formData={formData}
                            errors={errors}
                            isAuthenticated={isAuthenticated}
                            loadingPersonalData={validatingCPF}
                            onChangeProfileType={(value) => updateField('profileType', value)}
                            onUpdateField={updateField}
                            onValidateCPF={checkCPFAvailability}
                            onValidateCNPJ={validateCNPJField}
                            onValidateEmail={checkEmailAvailability}
                            onValidatePhone={validatePhoneField}
                            onValidatePasswords={validatePasswordFields}
                            onValidateBirthDate={validateBirthDateField}
                            onContinue={() => goToStep(2)}
                        />
                    </CheckoutStepSection>
                    
                    <CheckoutStepSection
                        title="Entrega"
                        stepNumber={2}
                        currentStep={currentStep}
                        icon={<LocalShippingIcon />}
                        onStepClick={goToStep}
                    >
                        <AddressForm
                            formData={formData}
                            disabledFields={{ address: disabledFields.address }}
                            loadingAddress={loadingAddress}
                            loadingShipping={loadingShipping}
                            shippingName={shippingName}
                            shippingPrice={shippingPrice}
                            deliveryTime={deliveryTime}
                            errors={errors.address}
                            onUpdateField={updateField}
                            onFetchAddress={handleAddressFetch}
                            onClearAddress={clearAddressFields}
                            onValidateAddress={validateAddressFields}
                            onContinue={() => goToStep(3)}
                        />
                    </CheckoutStepSection>
                    
                    <CheckoutStepSection
                        title="Pagamento"
                        stepNumber={3}
                        currentStep={currentStep}
                        icon={<PaymentIcon />}
                        onStepClick={goToStep}
                    >
                        <PaymentForm 
                            formData={formData}
                            isSubmitting={isSubmitting}
                            maskedCard={maskedCard}
                            cardFlag={cardFlag}
                            errors={errors.card}
                            onUpdateField={updateField}
                            onCardNumberChange={handleChangeCardNumber}
                            onValidateCardNumber={validateCardNumberField}
                            onValidateExpiration={validateCardExpirationField}
                            onValidateCVV={validateCardCVVField}
                            onValidateHolderName={validateCardHolderNameField}
                            onValidateHolderDocument={validateCardHolderDocumentField}
                            onPaymentSubmit={handlePaymentSubmit}
                        />
                    </CheckoutStepSection>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;
