"use client";
import React from 'react';
import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';
import Checkbox from '@mui/joy/Checkbox';
import ReactInputMask from 'react-input-mask';
import { CheckoutFormData } from '../hooks/useCheckoutForm';

interface AddressFormProps {
    formData: CheckoutFormData;
    disabledFields: {
        address: boolean;
    };
    loadingAddress: boolean;
    freteNome?: string;
    fretePreco?: number;
    prazo?: number;
    onUpdateField: (field: keyof CheckoutFormData, value: any) => void;
    onFetchAddress: () => void;
    onContinue: () => void;
}

/**
 * Componente para o formulário de endereço no checkout
 */
const AddressForm: React.FC<AddressFormProps> = ({
    formData,
    disabledFields,
    loadingAddress,
    freteNome,
    fretePreco,
    prazo,
    onUpdateField,
    onFetchAddress,
    onContinue
}) => {
    // Verificar se o CEP está completo para buscar endereço
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cepValue = e.target.value;
        onUpdateField('postalCode', cepValue);
        
        if (cepValue.length === 9) {
            onFetchAddress();
        }
    };

    return (
        <form className="d-flex justify-content-center flex-wrap position-relative">
            <div className="d-flex justify-content-center flex-wrap" style={{ width: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{marginTop: '20px', marginBottom: '8px', width: '100%'}}>
                    <ReactInputMask
                        mask="99999-999"
                        value={formData.postalCode}
                        onChange={handleCepChange}
                        maskChar=""
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="CEP*"
                                variant="standard"
                                sx={{
                                    '& .MuiInputBase-input::placeholder': {
                                        fontSize: '23px', 
                                        fontWeight: 'bold',
                                    },
                                    width: '60%',
                                    marginBottom: '8px'
                                }}
                            />
                        )}
                    </ReactInputMask>
                </div>
                
                <div className='d-flex justify-content-between flex-wrap' style={{ position: 'relative', width: '100%' }}>
                    {loadingAddress ? (
                        <Box sx={{ 
                            position: 'absolute', 
                            top: '40%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            zIndex: '99999'
                        }}>
                            <CircularProgress />
                        </Box>
                    ) : null}
                    
                    <Box className='d-flex justify-content-between flex-wrap' 
                         sx={{filter: loadingAddress ? 'blur(2px)' : 'blur:(0px)', width: '100%'}}>
                        <TextField 
                            sx={{width: '100%', marginBottom: '8px', marginTop: '0px'}} 
                            value={formData.street} 
                            onChange={(e) => onUpdateField('street', e.target.value)} 
                            label="Endereço de Entrega*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '19%', marginBottom: '8px'}} 
                            value={formData.number} 
                            onChange={(e) => onUpdateField('number', e.target.value)} 
                            label="Número*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '45%', marginBottom: '8px'}} 
                            value={formData.complement} 
                            onChange={(e) => onUpdateField('complement', e.target.value)} 
                            label="Complemento" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '31%', marginBottom: '8px'}} 
                            value={formData.state} 
                            onChange={(e) => onUpdateField('state', e.target.value)} 
                            label="Estado*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '42%', marginBottom: '8px'}} 
                            value={formData.city} 
                            onChange={(e) => onUpdateField('city', e.target.value)} 
                            label="Cidade*" 
                            variant="standard" 
                        />
                        <TextField 
                            sx={{width: '42%', marginBottom: '8px'}} 
                            value={formData.neighborhood} 
                            onChange={(e) => onUpdateField('neighborhood', e.target.value)} 
                            label="Bairro*" 
                            variant="standard" 
                        />
                    </Box>
                    
                    {freteNome && (
                        <div className="fretes" style={{ width: '100%' }}>
                            <h6 style={{marginTop: '10px'}}>Escolha o frete:</h6>
                            <div className="frete-box">
                                <div className="frete">
                                    <Checkbox 
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                background: 'gray', 
                                                borderRadius: '4px'
                                            },
                                            '& .MuiCheckbox-label': {
                                                zIndex: '55'
                                            }
                                        }}
                                        label={
                                            <div className='text-frete'>
                                                <span>{freteNome} {prazo ? `(até ${prazo} dias úteis)` : ''} </span>
                                                <span className="price">
                                                    R$ {fretePreco !== undefined ? fretePreco.toFixed(2).replace('.', ',') : '0,00'}
                                                </span>
                                            </div>
                                        }
                                        checked={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <Button 
                        variant="contained" 
                        color="primary"
                        className='mb-3'
                        fullWidth 
                        onClick={onContinue}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AddressForm; 