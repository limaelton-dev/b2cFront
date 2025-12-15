"use client";
import React, { useState } from 'react';
import { Box, TextField, InputAdornment, Button, CircularProgress, Chip, ToggleButtonGroup, ToggleButton, Paper, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PixIcon from '@mui/icons-material/Pix';
import Checkbox from '@mui/joy/Checkbox';
import StarIcon from '@mui/icons-material/Star';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData, PAYMENT_METHOD, PROFILE_TYPE } from '../hooks/useCheckoutCustomer';
import { CardBrand } from '../utils/validation';

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
        'visa': 'visa',
        'mastercard': 'mastercard',
        'master': 'mastercard',
        'amex': 'amex',
        'discover': 'discover',
        'diners': 'dinersclub',
        'jcb': 'jcb',
        'unionpay': 'unionpay',
        'maestro': 'maestro',
        'hipercard': 'hipercard',
        'elo': 'elo'
    };
    return brands[brand?.toLowerCase()] || '';
};

const PaymentForm: React.FC<PaymentFormProps> = ({
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
    onPaymentSubmit
}) => {
    const [focused, setFocused] = useState<string>('');
    const isCreditCard = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD;
    const isDebitCard = formData.paymentMethod === PAYMENT_METHOD.DEBIT_CARD;
    const isCardPayment = isCreditCard || isDebitCard;
    const needsCardInfo = !maskedCard.isMasked && isCardPayment && (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate || !formData.cardHolderName || !formData.cardHolderDocument);

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

    // Formatar número para exibição no cartão visual
    const displayCardNumber = maskedCard.isMasked 
        ? `**** **** **** ${maskedCard.finalDigits}` 
        : formData.cardNumber;

    const displayExpiry = formData.cardExpirationDate?.replace('/', '') || '';

    return (
        <div className="position-relative d-flex flex-wrap" style={{ width: '100%', height: '100%' }}>
            <div className="d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                <ToggleButtonGroup
                    value={formData.paymentMethod}
                    exclusive
                    onChange={(_, value) => value && onUpdateField('paymentMethod', value)}
                    aria-label="método de pagamento"
                    sx={{ 
                        width: '100%', 
                        mt: 2,
                        display: 'flex',
                        gap: 1,
                        '& .MuiToggleButton-root': {
                            flex: 1,
                            py: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px !important',
                            textTransform: 'none',
                            flexDirection: 'column',
                            gap: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderColor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            },
                            '&:hover': {
                                bgcolor: 'action.hover',
                            }
                        }
                    }}
                >
                    <ToggleButton value={PAYMENT_METHOD.CREDIT_CARD}>
                        <CreditCardIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={500}>Crédito</Typography>
                    </ToggleButton>
                    <ToggleButton value={PAYMENT_METHOD.DEBIT_CARD}>
                        <AccountBalanceIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={500}>Débito</Typography>
                    </ToggleButton>
                    <ToggleButton value={PAYMENT_METHOD.PIX}>
                        <PixIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={500}>Pix</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
                
                {isCardPayment && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        {/* Visual do Cartão */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mb: 3,
                            position: 'relative'
                        }}>
                            {maskedCard.isMasked && (
                                <Chip 
                                    icon={<StarIcon sx={{ fontSize: '14px' }} />}
                                    label="Cartão Salvo" 
                                    size="small"
                                    color="primary"
                                    sx={{ 
                                        position: 'absolute', 
                                        top: -8, 
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        zIndex: 10,
                                        backgroundColor: '#102d57',
                                        fontWeight: 500,
                                        fontSize: '0.65rem',
                                        height: '20px'
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

                        {/* Campos do Formulário */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1 }}>
                            <TextField
                                sx={{ width: '100%', mb: 1 }}
                                label="Nome do Titular (como está no cartão)*"
                                value={formData.cardHolderName}
                                onChange={(e) => onUpdateField('cardHolderName', e.target.value.toUpperCase())}
                                onFocus={handleFocus('name')}
                                onBlur={handleHolderNameBlur}
                                variant="standard"
                                error={errors.holderName}
                                helperText={errors.holderName ? errors.holderNameMessage : ''}
                                inputProps={{ maxLength: 50, style: { textTransform: 'uppercase' } }}
                            />

                            <MaskedTextField
                                mask="9999 9999 9999 9999"
                                value={formData.cardNumber}
                                onChange={onCardNumberChange}
                                onFocus={handleFocus('number')}
                                onBlur={handleCardNumberBlur}
                                maskChar=""
                                label="Número do Cartão*"
                                variant="standard"
                                error={errors.number}
                                helperText={errors.number ? errors.numberMessage : ''}
                                placeholder="0000 0000 0000 0000"
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">{cardFlag}</InputAdornment> } }}
                                sx={{ width: '100%', mb: 1 }}
                            />
                            
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
                                label="Validade (MM/AA)*"
                                placeholder="MM/AA"
                                variant="standard"
                                error={errors.expiration}
                                helperText={errors.expiration ? errors.expirationMessage : ''}
                                sx={{ width: '48%', mb: 1 }}
                            />
                            
                            <TextField 
                                sx={{ width: '48%', mb: 1 }} 
                                onChange={(e) => onUpdateField('cardCVV', e.target.value.replace(/\D/g, ''))} 
                                onFocus={handleFocus('cvc')}
                                onBlur={handleCVVBlur}
                                value={formData.cardCVV} 
                                label="CVV*" 
                                variant="standard"
                                error={errors.cvv}
                                helperText={errors.cvv ? errors.cvvMessage : ''}
                                inputProps={{ maxLength: errors.brand === 'amex' ? 4 : 3 }}
                            />
                            
                            <MaskedTextField
                                mask="999.999.999-99"
                                value={formData.cardHolderDocument}
                                onChange={(e) => onUpdateField('cardHolderDocument', e.target.value)}
                                onBlur={handleHolderDocumentBlur}
                                label="CPF do Titular do Cartão*"
                                variant="standard"
                                error={errors.holderDocument}
                                helperText={errors.holderDocument ? errors.holderDocumentMessage : ''}
                                sx={{ width: '100%', mb: 1 }}
                            />
                            
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Checkbox 
                                    label="Guardar cartão para compras futuras"
                                    checked={formData.saveCard}
                                    onChange={(e) => onUpdateField('saveCard', e.target.checked)}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
                
                {!isCardPayment && (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            width: '100%', 
                            mt: 3, 
                            p: 3, 
                            bgcolor: '#f0fdf4',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'success.light',
                            textAlign: 'center'
                        }}
                    >
                        <PixIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                        <Typography variant="body1" fontWeight={500} color="success.dark">
                            Pagamento via PIX
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            A chave PIX será gerada após a confirmação do pedido
                        </Typography>
                    </Paper>
                )}
                
                {formData.profileType === PROFILE_TYPE.PJ && (
                    <div className='d-flex justify-content-between flex-wrap' style={{ width: '100%' }}>
                        <div style={{ width: '100%', marginTop: '3px' }}>
                            <Checkbox 
                                label="Estou autorizado a comprar em nome da empresa"
                                checked={formData.companyPurchaseAuthorization}
                                onChange={(e) => onUpdateField('companyPurchaseAuthorization', e.target.checked)}
                            />
                        </div>
                    </div>
                )}
                
                <div className="btn-pay mt-3" style={{ width: '100%' }}>
                    {needsCardInfo && (
                        <div style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#fee', color: '#d33', textAlign: 'center' }}>
                            <span>Preencha todos os campos do cartão para continuar</span>
                        </div>
                    )}
                    
                    <Button variant="contained" color="primary" fullWidth onClick={onPaymentSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Compra'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
