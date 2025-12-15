'use client';

import React from 'react';
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Typography,
    Paper,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MaskedTextField from './MaskedTextField';
import { CheckoutFormData } from '../hooks/useCheckoutCustomer';
import { THEME_COLOR, checkoutStyles } from '../theme';

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

export default function AddressForm({
    formData,
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
    onContinue,
}: AddressFormProps) {
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
        <Box component="form" sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 1 }}>
                <MaskedTextField
                    mask="99999-999"
                    value={formData.postalCode}
                    onChange={handleCepChange}
                    label="CEP *"
                    error={errors.postalCode}
                    helperText={errors.postalCode ? 'CEP é obrigatório' : ''}
                    size="small"
                    sx={{ ...checkoutStyles.textField, width: '60%' }}
                />
            </Box>

            <Box sx={{ position: 'relative' }}>
                {loadingAddress && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                        }}
                    >
                        <CircularProgress sx={{ color: THEME_COLOR }} />
                    </Box>
                )}

                <Box sx={{ filter: loadingAddress ? 'blur(2px)' : 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Endereço de Entrega *"
                            value={formData.street}
                            onChange={(e) => onUpdateField('street', e.target.value)}
                            error={errors.street}
                            helperText={errors.street ? 'Endereço é obrigatório' : ''}
                            size="small"
                            sx={checkoutStyles.textField}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Número *"
                                value={formData.number}
                                onChange={(e) => onUpdateField('number', e.target.value)}
                                error={errors.number}
                                helperText={errors.number ? 'Obrigatório' : ''}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                            <TextField
                                fullWidth
                                label="Complemento"
                                value={formData.complement}
                                onChange={(e) => onUpdateField('complement', e.target.value)}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Estado *"
                                value={formData.state}
                                onChange={(e) => onUpdateField('state', e.target.value)}
                                error={errors.state}
                                helperText={errors.state ? 'Obrigatório' : ''}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                            <TextField
                                fullWidth
                                label="Cidade *"
                                value={formData.city}
                                onChange={(e) => onUpdateField('city', e.target.value)}
                                error={errors.city}
                                helperText={errors.city ? 'Obrigatório' : ''}
                                size="small"
                                sx={checkoutStyles.textField}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Bairro *"
                            value={formData.neighborhood}
                            onChange={(e) => onUpdateField('neighborhood', e.target.value)}
                            error={errors.neighborhood}
                            helperText={errors.neighborhood ? 'Obrigatório' : ''}
                            size="small"
                            sx={checkoutStyles.textField}
                        />
                    </Box>

                    {loadingShipping ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CircularProgress size={24} sx={{ color: THEME_COLOR }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Calculando frete...
                            </Typography>
                        </Box>
                    ) : shippingName ? (
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid #e8e8e8',
                                bgcolor: '#fafafa',
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#333' }}>
                                Opção de entrega:
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked
                                        sx={checkoutStyles.checkbox}
                                        size="small"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <LocalShippingOutlinedIcon sx={{ color: THEME_COLOR, fontSize: 20 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2">
                                                {shippingName}
                                                {deliveryTime && (
                                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                        (até {deliveryTime} dias úteis)
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={600} sx={{ color: THEME_COLOR }}>
                                            R$ {shippingPrice?.toFixed(2).replace('.', ',') || '0,00'}
                                        </Typography>
                                    </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                            />
                        </Paper>
                    ) : null}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleContinue}
                        sx={{ ...checkoutStyles.button, mt: 2 }}
                    >
                        Continuar
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
