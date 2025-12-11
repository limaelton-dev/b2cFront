"use client";
import React, { useState } from 'react';
import { Box, RadioGroup, FormControlLabel, Radio, TextField, InputAdornment, Button, CircularProgress, Chip } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import StarIcon from '@mui/icons-material/Star';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData, PAYMENT_METHOD, PROFILE_TYPE } from '../hooks/useCheckoutCustomer';

interface PaymentFormProps {
    formData: CheckoutFormData;
    isSubmitting: boolean;
    maskedCard: { isMasked: boolean; finalDigits: string; cardHolder: string; expiration: string; brand: string };
    cardFlag: React.ReactNode;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    onUpdateField,
    onCardNumberChange,
    onPaymentSubmit
}) => {
    const [focused, setFocused] = useState<string>('');
    const isCreditCard = formData.paymentMethod === PAYMENT_METHOD.CREDIT_CARD;
    const needsCardInfo = !maskedCard.isMasked && isCreditCard && (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate || !formData.cardHolderName);

    const handleFocus = (fieldName: string) => () => setFocused(fieldName);
    const handleBlur = () => setFocused('');

    // Formatar número para exibição no cartão visual
    const displayCardNumber = maskedCard.isMasked 
        ? `**** **** **** ${maskedCard.finalDigits}` 
        : formData.cardNumber;

    const displayExpiry = formData.cardExpirationDate?.replace('/', '') || '';

    return (
        <div className="position-relative d-flex flex-wrap" style={{ width: '100%', height: '100%' }}>
            <div className="d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                <RadioGroup
                    row
                    value={formData.paymentMethod}
                    aria-labelledby="payment-method-radio-group"
                    name="payment-method-radio-group"
                    sx={{ justifyContent: 'space-between', width: '100%', mt: '15px' }}
                >
                    <FormControlLabel 
                        value={PAYMENT_METHOD.CREDIT_CARD}
                        sx={{ margin: 0 }} 
                        control={<Radio />} 
                        onClick={() => onUpdateField('paymentMethod', PAYMENT_METHOD.CREDIT_CARD)} 
                        label="Cartão de Crédito" 
                    />
                    <FormControlLabel 
                        value={PAYMENT_METHOD.PIX}
                        sx={{ margin: 0 }} 
                        control={<Radio />} 
                        onClick={() => onUpdateField('paymentMethod', PAYMENT_METHOD.PIX)} 
                        label="Pix" 
                    />
                </RadioGroup>
                
                {isCreditCard && (
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
                                onBlur={handleBlur}
                                disabled={maskedCard.isMasked}
                                variant="standard"
                                inputProps={{ maxLength: 50, style: { textTransform: 'uppercase' } }}
                            />

                            <MaskedTextField
                                mask="9999 9999 9999 9999"
                                value={formData.cardNumber}
                                onChange={onCardNumberChange}
                                onFocus={handleFocus('number')}
                                onBlur={handleBlur}
                                disabled={maskedCard.isMasked}
                                maskChar="X"
                                label="Número do Cartão*"
                                variant="standard"
                                placeholder='•••• •••• •••• ••••'
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">{cardFlag}</InputAdornment> } }}
                                sx={{ width: '100%', mb: 1 }}
                            />
                            
                            <MaskedTextField
                                mask="99/99"
                                value={formData.cardExpirationDate}
                                onChange={(e) => onUpdateField('cardExpirationDate', e.target.value)}
                                onFocus={handleFocus('expiry')}
                                onBlur={handleBlur}
                                disabled={maskedCard.isMasked}
                                label="Validade (MM/AA)*"
                                placeholder='MM/AA'
                                variant="standard"
                                sx={{ width: '48%', mb: 1 }}
                            />
                            
                            <TextField 
                                sx={{ width: '48%', mb: 1 }} 
                                onChange={(e) => onUpdateField('cardCVV', e.target.value.replace(/\D/g, ''))} 
                                onFocus={handleFocus('cvc')}
                                onBlur={handleBlur}
                                value={formData.cardCVV} 
                                label="CVV*" 
                                variant="standard"
                                inputProps={{ maxLength: 4 }}
                                helperText={maskedCard.isMasked ? "Informe para confirmar" : ""}
                            />
                            
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Checkbox 
                                    disabled={maskedCard.isMasked} 
                                    label="Guardar cartão para compras futuras"
                                    checked={formData.saveCard}
                                    onChange={(e) => onUpdateField('saveCard', e.target.checked)}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
                
                {!isCreditCard && (
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '158px', width: '100%' }}>
                        <span>A chave pix será liberada após a confirmação</span>
                    </div>
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
