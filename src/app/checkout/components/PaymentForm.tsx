"use client";
import React from 'react';
import { RadioGroup, FormControlLabel, Radio, TextField, InputAdornment, Button, CircularProgress, Box } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import ReactInputMask from 'react-input-mask';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';
import { CheckoutFormData } from '../hooks/useCheckoutForm';

interface PaymentFormProps {
    formData: CheckoutFormData;
    isSubmitting: boolean;
    maskedCard: {
        isMasked: boolean;
        finalDigits: string;
        cardHolder: string;
        expiration: string;
    };
    cardFlag: React.ReactNode;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPaymentSubmit: () => void;
}

/**
 * Componente para o formulário de pagamento no checkout
 */
const PaymentForm: React.FC<PaymentFormProps> = ({
    formData,
    isSubmitting,
    maskedCard,
    cardFlag,
    onUpdateField,
    onCardNumberChange,
    onPaymentSubmit
}) => {
    return (
        <div className="position-relative d-flex flex-wrap" style={{ width: '100%', height: '100%' }}>
            <div className="d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                <RadioGroup
                    row
                    value={formData.paymentMethod}
                    aria-labelledby="payment-method-radio-group"
                    name="payment-method-radio-group"
                    sx={{justifyContent: 'space-between', width: '100%', marginTop: '15px'}}
                >
                    <FormControlLabel 
                        value="1" 
                        sx={{margin: '0px'}} 
                        control={<Radio />} 
                        onClick={() => onUpdateField('paymentMethod', '1')} 
                        label="Cartão de Crédito" 
                    />
                    <FormControlLabel 
                        value="2" 
                        sx={{margin: '0px'}} 
                        control={<Radio />} 
                        onClick={() => onUpdateField('paymentMethod', '2')} 
                        label="Pix" 
                    />
                </RadioGroup>
                
                {formData.paymentMethod === '1' && (
                    <div className='d-flex justify-content-between flex-wrap' style={{height: '158px', width: '100%'}}>
                        <ReactInputMask
                            mask="9999 9999 9999 9999"
                            value={formData.cardNumber}
                            onChange={onCardNumberChange}
                            disabled={maskedCard.isMasked}
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
                                                    {cardFlag}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '23px', 
                                            fontWeight: 'bold',
                                        },
                                        width: '100%',
                                        marginBottom: '4px',
                                        marginTop: '0px'
                                    }}
                                />
                            )}
                        </ReactInputMask>
                        
                        <TextField 
                            sx={{width: '25%', marginBottom: '7px'}} 
                            disabled={maskedCard.isMasked} 
                            onChange={(e) => onUpdateField('cardCVV', e.target.value)} 
                            value={formData.cardCVV} 
                            label="CVV*" 
                            variant="standard" 
                        />
                        
                        <TextField 
                            sx={{width: '45%', marginBottom: '7px'}} 
                            disabled={maskedCard.isMasked} 
                            onChange={(e) => onUpdateField('cardExpirationDate', e.target.value)} 
                            value={formData.cardExpirationDate} 
                            label="Validade*" 
                            placeholder='mm/aa' 
                            variant="standard" 
                        />
                        
                        <div style={{width: '100%', marginTop: '25px'}}>
                            <Checkbox 
                                disabled={maskedCard.isMasked} 
                                label="Guardar para compras futuras"
                                checked={formData.saveCard}
                                onChange={(e) => onUpdateField('saveCard', e.target.checked)}
                            />
                        </div>
                        
                        {maskedCard.isMasked && (
                            <div style={{width: '100%', marginTop: '10px', textAlign: 'center', color: '#0d6efd', fontSize: '14px'}}>
                                <p>Você já possui um cartão cadastrado que será utilizado para esta compra.</p>
                            </div>
                        )}
                    </div>
                )}
                
                {formData.paymentMethod === '2' && (
                    <div className='d-flex justify-content-center align-items-center' style={{height: '158px', width: '100%'}}>
                        <span>A chave pix será liberada após a confirmação</span>
                    </div>
                )}
                
                {formData.profileType === '2' && (
                    <div className='d-flex justify-content-between flex-wrap' style={{ width: '100%' }}>
                        <div style={{width: '100%', marginTop: '3px'}}>
                            <Checkbox 
                                label="Estou autorizado a comprar em nome da empresa"
                                checked={formData.companyPurchaseAuthorization}
                                onChange={(e) => onUpdateField('companyPurchaseAuthorization', e.target.checked)}
                            />
                        </div>
                    </div>
                )}
                
                <div className="btn-pay mt-3" style={{ width: '100%' }}>
                    {!maskedCard.isMasked && formData.paymentMethod === '1' && 
                     (!formData.cardNumber || !formData.cardCVV || !formData.cardExpirationDate) && (
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
                        onClick={onPaymentSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Finalizar Compra'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm; 