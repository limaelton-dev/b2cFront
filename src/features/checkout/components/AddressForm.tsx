"use client";
import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData } from '../hooks/useCheckoutCustomer';

interface AddressErrors {
    postalCode: boolean;
    street: boolean;
    number: boolean;
    neighborhood: boolean;
    city: boolean;
    state: boolean;
}

interface AddressFormProps {
    formData: CheckoutFormData;
    disabledFields: { address: boolean };
    loadingAddress: boolean;
    loadingShipping?: boolean;
    shippingName?: string;
    shippingPrice?: number;
    deliveryTime?: number;
    errors: AddressErrors;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onFetchAddress: (cep: string) => void;
    onClearAddress: () => void;
    onValidateAddress: () => void;
    onContinue: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
    formData,
    disabledFields,
    loadingAddress,
    loadingShipping,
    shippingName,
    shippingPrice,
    deliveryTime,
    errors,
    onUpdateField,
    onFetchAddress,
    onClearAddress,
    onValidateAddress,
    onContinue
}) => {
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cepValue = e.target.value;
        const cleanCep = cepValue.replace(/\D/g, '');
        
        onUpdateField('postalCode', cepValue);
        
        if (cleanCep.length === 8) {
            onFetchAddress(cepValue);
        } else if (cleanCep.length < 8 && formData.street) {
            onClearAddress();
        }
    };

    const handleContinue = () => {
        onValidateAddress();
        onContinue();
    };

    return (
        <form className="d-flex justify-content-center flex-wrap position-relative">
            <div className="d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '20px', marginBottom: '8px', width: '100%' }}>
                    <MaskedTextField
                        mask="99999-999"
                        value={formData.postalCode}
                        onChange={handleCepChange}
                        label="CEP*"
                        variant="standard"
                        error={errors.postalCode}
                        helperText={errors.postalCode ? 'CEP é obrigatório' : ''}
                        sx={{ width: '60%', mb: '8px' }}
                    />
                </div>
                
                <div className='d-flex justify-content-between flex-wrap' style={{ position: 'relative', width: '100%' }}>
                    {loadingAddress && (
                        <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    
                    <Box className='d-flex justify-content-between flex-wrap' sx={{ filter: loadingAddress ? 'blur(2px)' : 'none', width: '100%' }}>
                        <TextField 
                            sx={{ width: '100%', mb: '8px', mt: 0 }} 
                            value={formData.street} 
                            onChange={(e) => onUpdateField('street', e.target.value)} 
                            label="Endereço de Entrega*" 
                            variant="standard" 
                            error={errors.street}
                            helperText={errors.street ? 'Endereço é obrigatório' : ''}
                        />
                        <TextField 
                            sx={{ width: '19%', mb: '8px' }} 
                            value={formData.number} 
                            onChange={(e) => onUpdateField('number', e.target.value)} 
                            label="Número*" 
                            variant="standard" 
                            error={errors.number}
                            helperText={errors.number ? 'Obrigatório' : ''}
                        />
                        <TextField 
                            sx={{ width: '45%', mb: '8px' }} 
                            value={formData.complement} 
                            onChange={(e) => onUpdateField('complement', e.target.value)} 
                            label="Complemento" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{ width: '31%', mb: '8px' }} 
                            value={formData.state} 
                            onChange={(e) => onUpdateField('state', e.target.value)} 
                            label="Estado*" 
                            variant="standard" 
                            error={errors.state}
                            helperText={errors.state ? 'Obrigatório' : ''}
                        />
                        <TextField 
                            sx={{ width: '42%', mb: '8px' }} 
                            value={formData.city} 
                            onChange={(e) => onUpdateField('city', e.target.value)} 
                            label="Cidade*" 
                            variant="standard" 
                            error={errors.city}
                            helperText={errors.city ? 'Obrigatório' : ''}
                        />
                        <TextField 
                            sx={{ width: '42%', mb: '8px' }} 
                            value={formData.neighborhood} 
                            onChange={(e) => onUpdateField('neighborhood', e.target.value)} 
                            label="Bairro*" 
                            variant="standard" 
                            error={errors.neighborhood}
                            helperText={errors.neighborhood ? 'Obrigatório' : ''}
                        />
                    </Box>
                    
                    {loadingShipping ? (
                        <div className="fretes" style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                            <CircularProgress size={24} />
                            <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>Calculando frete...</p>
                        </div>
                    ) : shippingName ? (
                        <div className="fretes" style={{ width: '100%' }}>
                            <h6 style={{ marginTop: '10px' }}>Escolha o frete:</h6>
                            <div className="frete-box">
                                <div className="frete">
                                    <Checkbox 
                                        sx={{ '& .MuiSvgIcon-root': { background: 'gray', borderRadius: '4px' }, '& .MuiCheckbox-label': { zIndex: 55 } }}
                                        label={
                                            <div className='text-frete'>
                                                <span>{shippingName} {deliveryTime ? `(até ${deliveryTime} dias úteis)` : ''}</span>
                                                <span className="price">R$ {shippingPrice?.toFixed(2).replace('.', ',') || '0,00'}</span>
                                            </div>
                                        }
                                        checked
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                    
                    <Button variant="contained" color="primary" className='mb-3' fullWidth onClick={handleContinue}>
                        Continuar
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddressForm;

