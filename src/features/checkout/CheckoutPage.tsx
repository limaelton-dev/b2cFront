'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Breadcrumbs, CircularProgress, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { PaymentIcon as CardPaymentIcon } from 'react-svg-credit-card-payment-icons';

import CartComponent from '@/components/Cart';
import Footer from '@/app/footer';

import CheckoutHeader from './components/CheckoutHeader';
import OrderSummary from './components/OrderSummary';
import CheckoutStepSection from './components/CheckoutStepSection';
import PersonalInfoForm from './components/PersonalInfoForm';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';

import { useCheckoutCustomer, PAYMENT_METHOD } from './hooks/useCheckoutCustomer';
import { useCheckoutSteps } from './hooks/useCheckoutSteps';
import { useCheckoutPricing } from './hooks/useCheckoutPricing';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { useToastSide } from '@/context/ToastSideProvider';
import { completeCheckoutWithCreditCard, completeCheckoutWithDebitCard, completeCheckoutWithPix } from './services/complete-checkout';
import { detectCardBrand } from './utils/validation';
import { THEME_COLOR } from './theme';

type CartLoadingState = 'loading' | 'ready' | 'empty';

export default function CheckoutPage() {
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
        clearShippingData,
    } = useCheckoutPricing(cartItems);

    const handleAddressLoaded = useCallback(
        async (postalCode: string) => {
            if (postalCode?.length >= 8) {
                try {
                    await calculateShipping(postalCode, true);
                } catch {
                    // Silencioso
                }
            }
        },
        [calculateShipping]
    );

    const {
        formData,
        updateField,
        isAuthenticated,
        maskedCard,
        savedIds,
        disabledFields,
        loadingAddress,
        autoFillAddressByPostalCode,
        clearAddressFields,
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
        validateAllCardFields,
    } = useCheckoutSteps(formData, isAuthenticated);

    const cardFlag = useMemo(() => {
        const brand = detectCardBrand(formData.cardNumber);
        const brandMap: Record<string, JSX.Element> = {
            Visa: <CardPaymentIcon type="Visa" format="flatRounded" width={40} />,
            Mastercard: <CardPaymentIcon type="Mastercard" format="logo" width={40} />,
            'American Express': <CardPaymentIcon type="Amex" format="flatRounded" width={40} />,
            Elo: <CardPaymentIcon type="Elo" format="flatRounded" width={40} />,
            Hipercard: <CardPaymentIcon type="Hipercard" format="flatRounded" width={50} />,
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
        if (cartState === 'ready' && formData.postalCode && !shippingName && !loadingShipping && !hasCalculatedInitialShipping.current) {
            const cleanCep = formData.postalCode.replace(/\D/g, '');
            if (cleanCep.length === 8) {
                hasCalculatedInitialShipping.current = true;
                calculateShipping(cleanCep, isAuthenticated).catch(() => {});
            }
        }
    }, [cartState, formData.postalCode, shippingName, loadingShipping, calculateShipping, isAuthenticated]);

    if (cartState === 'loading') {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <CircularProgress sx={{ color: THEME_COLOR }} />
                <Typography variant="body1" color="text.secondary">
                    Carregando carrinho...
                </Typography>
            </Box>
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
        const isCardPayment = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD || formData.paymentMethod === PAYMENT_METHOD.DEBIT_CARD;

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
                result = await completeCheckoutWithPix(formData, parseFloat(calculateSubtotal()) * (1 - pixDiscount / 100), isAuthenticated, savedIds);
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
            <CheckoutHeader />

            <Container maxWidth="lg" sx={{ py: 3 }}>
                {!maskedCard.isMasked && formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD && !formData.cardNumber && !formData.cardHolderName && (
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                        Preencha os dados do cartão para continuar
                    </Alert>
                )}

                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                        Home
                    </Link>
                    <Typography sx={{ color: THEME_COLOR, fontWeight: 600 }}>Checkout</Typography>
                </Breadcrumbs>

                <OrderSummary
                    cartItems={cartItems}
                    subtotal={calculateSubtotal()}
                    rawTotal={calculateRawTotal()}
                    pixDiscountedPrice={getPixDiscountedPrice()}
                    pixDiscount={pixDiscount}
                    shippingPrice={shippingPrice}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 2.5,
                        mb: 4,
                    }}
                >
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
                </Box>
            </Container>

            <Footer />
        </>
    );
}
