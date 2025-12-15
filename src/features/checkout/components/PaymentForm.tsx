'use client';

import React, { useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Typography,
    Checkbox,
    FormControlLabel,
    Alert,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PixIcon from '@mui/icons-material/Pix';
import StarIcon from '@mui/icons-material/Star';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData, PAYMENT_METHOD, PROFILE_TYPE } from '../hooks/useCheckoutCustomer';
import { CardBrand } from '../utils/validation';
import { THEME_COLOR, THEME_COLOR_DARK, checkoutStyles } from '../theme';

interface CardErrors {
    number: boolean;
    numberMessage: string;
    expiration: boolean;
    expirationMessage: string;
    cvv: boolean;
    cvvMessage: string;
    holderName: boolean;
    holderNameMessage: string;
    holderDocument: boolean;
    holderDocumentMessage: string;
    brand: CardBrand;
}

interface PaymentFormProps {
    formData: CheckoutFormData;
    isSubmitting: boolean;
    maskedCard: { isMasked: boolean; finalDigits: string; cardHolder: string; expiration: string; brand: string };
    cardFlag: React.ReactNode;
    errors: CardErrors;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValidateCardNumber: (cardNumber: string) => void;
    onValidateExpiration: (expiration: string) => void;
    onValidateCVV: (cvv: string, cardNumber: string) => void;
    onValidateHolderName: (name: string) => void;
    onValidateHolderDocument: (document: string) => void;
    onPaymentSubmit: () => void;
}

const getCardBrand = (brand: string) => {
    const brands: Record<string, string> = {
        visa: 'visa',
        mastercard: 'mastercard',
        master: 'mastercard',
        amex: 'amex',
        discover: 'discover',
        diners: 'dinersclub',
        jcb: 'jcb',
        unionpay: 'unionpay',
        maestro: 'maestro',
        hipercard: 'hipercard',
        elo: 'elo',
    };
    return brands[brand?.toLowerCase()] || '';
};

export default function PaymentForm({
    formData,
    isSubmitting,
    maskedCard,
    cardFlag,
    errors,
    onUpdateField,
    onCardNumberChange,
    onValidateCardNumber,
    onValidateExpiration,
    onValidateCVV,
    onValidateHolderName,
    onValidateHolderDocument,
    onPaymentSubmit,
}: PaymentFormProps) {
    const [focused, setFocused] = useState<string>('');
    const isCreditCard = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD;
    const isDebitCard = formData.paymentMethod === PAYMENT_METHOD.DEBIT_CARD;
    const isCardPayment = isCreditCard || isDebitCard;
    const needsCardInfo =
        !maskedCard.isMasked &&
        isCardPayment &&
        (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate || !formData.cardHolderName || !formData.cardHolderDocument);

    const handleFocus = (fieldName: string) => () => setFocused(fieldName);

    const handleCardNumberBlur = () => {
        setFocused('');
        if (formData.cardNumber) onValidateCardNumber(formData.cardNumber);
    };

    const handleExpirationBlur = () => {
        setFocused('');
        if (formData.cardExpirationDate) onValidateExpiration(formData.cardExpirationDate);
    };

    const handleCVVBlur = () => {
        setFocused('');
        if (formData.cardCVV) onValidateCVV(formData.cardCVV, formData.cardNumber);
    };

    const handleHolderNameBlur = () => {
        setFocused('');
        if (formData.cardHolderName) onValidateHolderName(formData.cardHolderName);
    };

    const handleHolderDocumentBlur = () => {
        if (formData.cardHolderDocument) onValidateHolderDocument(formData.cardHolderDocument);
    };

    const displayCardNumber = maskedCard.isMasked ? `**** **** **** ${maskedCard.finalDigits}` : formData.cardNumber;
    const displayExpiry = formData.cardExpirationDate?.replace('/', '') || '';

    return (
        <Box sx={{ width: '100%' }}>
            <ToggleButtonGroup
                value={formData.paymentMethod}
                exclusive
                onChange={(_, value) => value && onUpdateField('paymentMethod', value)}
                aria-label="método de pagamento"
                sx={{
                    width: '100%',
                    mt: 1,
                    display: 'flex',
                    gap: 1,
                    '& .MuiToggleButton-root': {
                        flex: 1,
                        py: 1.5,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px !important',
                        textTransform: 'none',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&.Mui-selected': {
                            bgcolor: THEME_COLOR,
                            color: '#fff',
                            borderColor: THEME_COLOR,
                            '&:hover': {
                                bgcolor: THEME_COLOR_DARK,
                            },
                        },
                        '&:hover': {
                            bgcolor: 'rgba(37, 45, 95, 0.04)',
                        },
                    },
                }}
            >
                <ToggleButton value={PAYMENT_METHOD.CREDIT_CARD}>
                    <CreditCardIcon fontSize="small" />
                    <Typography variant="caption" fontWeight={500}>
                        Crédito
                    </Typography>
                </ToggleButton>
                <ToggleButton value={PAYMENT_METHOD.DEBIT_CARD}>
                    <AccountBalanceIcon fontSize="small" />
                    <Typography variant="caption" fontWeight={500}>
                        Débito
                    </Typography>
                </ToggleButton>
                <ToggleButton value={PAYMENT_METHOD.PIX}>
                    <PixIcon fontSize="small" />
                    <Typography variant="caption" fontWeight={500}>
                        Pix
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {isCardPayment && (
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
                        {maskedCard.isMasked && (
                            <Chip
                                icon={<StarIcon sx={{ fontSize: '14px' }} />}
                                label="Cartão Salvo"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10,
                                    bgcolor: THEME_COLOR,
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: '0.65rem',
                                    height: '20px',
                                    '& .MuiChip-icon': { color: '#fff' },
                                }}
                            />
                        )}
                        <Cards
                            number={displayCardNumber}
                            name={formData.cardHolderName || ''}
                            expiry={displayExpiry}
                            cvc={formData.cardCVV || ''}
                            focused={focused as any}
                            preview={maskedCard.isMasked}
                            issuer={maskedCard.isMasked ? getCardBrand(maskedCard.brand) : ''}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome do Titular (como está no cartão) *"
                            value={formData.cardHolderName}
                            onChange={(e) => onUpdateField('cardHolderName', e.target.value.toUpperCase())}
                            onFocus={handleFocus('name')}
                            onBlur={handleHolderNameBlur}
                            error={errors.holderName}
                            helperText={errors.holderName ? errors.holderNameMessage : ''}
                            size="small"
                            inputProps={{ maxLength: 50, style: { textTransform: 'uppercase' } }}
                            sx={checkoutStyles.textField}
                        />

                        <MaskedTextField
                            mask="9999 9999 9999 9999"
                            value={formData.cardNumber}
                            onChange={onCardNumberChange}
                            onFocus={handleFocus('number')}
                            onBlur={handleCardNumberBlur}
                            maskChar=""
                            label="Número do Cartão *"
                            error={errors.number}
                            helperText={errors.number ? errors.numberMessage : ''}
                            placeholder="0000 0000 0000 0000"
                            slotProps={{
                                input: { endAdornment: <InputAdornment position="end">{cardFlag}</InputAdornment> },
                            }}
                            size="small"
                            fullWidth
                            sx={checkoutStyles.textField}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <MaskedTextField
                                mask="99/99"
                                value={formData.cardExpirationDate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    onUpdateField('cardExpirationDate', value);
                                    if (value.length === 5) onValidateExpiration(value);
                                }}
                                onFocus={handleFocus('expiry')}
                                onBlur={handleExpirationBlur}
                                label="Validade (MM/AA) *"
                                placeholder="MM/AA"
                                error={errors.expiration}
                                helperText={errors.expiration ? errors.expirationMessage : ''}
                                size="small"
                                fullWidth
                                sx={checkoutStyles.textField}
                            />
                            <TextField
                                fullWidth
                                label="CVV *"
                                value={formData.cardCVV}
                                onChange={(e) => onUpdateField('cardCVV', e.target.value.replace(/\D/g, ''))}
                                onFocus={handleFocus('cvc')}
                                onBlur={handleCVVBlur}
                                error={errors.cvv}
                                helperText={errors.cvv ? errors.cvvMessage : ''}
                                inputProps={{ maxLength: errors.brand === 'amex' ? 4 : 3 }}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                        </Box>

                        <MaskedTextField
                            mask="999.999.999-99"
                            value={formData.cardHolderDocument}
                            onChange={(e) => onUpdateField('cardHolderDocument', e.target.value)}
                            onBlur={handleHolderDocumentBlur}
                            label="CPF do Titular do Cartão *"
                            error={errors.holderDocument}
                            helperText={errors.holderDocument ? errors.holderDocumentMessage : ''}
                            size="small"
                            fullWidth
                            sx={checkoutStyles.textField}
                        />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.saveCard}
                                    onChange={(e) => onUpdateField('saveCard', e.target.checked)}
                                    sx={checkoutStyles.checkbox}
                                    size="small"
                                />
                            }
                            label={<Typography variant="body2">Guardar cartão para compras futuras</Typography>}
                        />
                    </Box>
                </Box>
            )}

            {!isCardPayment && (
                <Paper
                    elevation={0}
                    sx={{
                        mt: 3,
                        p: 3,
                        bgcolor: '#f0fdf4',
                        borderRadius: 2,
                        border: '1px dashed #86efac',
                        textAlign: 'center',
                    }}
                >
                    <PixIcon sx={{ fontSize: 48, color: '#22c55e', mb: 1 }} />
                    <Typography variant="body1" fontWeight={500} sx={{ color: '#166534' }}>
                        Pagamento via PIX
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        A chave PIX será gerada após a confirmação do pedido
                    </Typography>
                </Paper>
            )}

            {formData.profileType === PROFILE_TYPE.PJ && (
                <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.companyPurchaseAuthorization}
                                onChange={(e) => onUpdateField('companyPurchaseAuthorization', e.target.checked)}
                                sx={checkoutStyles.checkbox}
                                size="small"
                            />
                        }
                        label={<Typography variant="body2">Estou autorizado a comprar em nome da empresa</Typography>}
                    />
                </Box>
            )}

            <Box sx={{ mt: 3 }}>
                {needsCardInfo && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        Preencha todos os campos do cartão para continuar
                    </Alert>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onPaymentSubmit}
                    disabled={isSubmitting}
                    sx={checkoutStyles.button}
                >
                    {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Finalizar Compra'}
                </Button>
            </Box>
        </Box>
    );
}
