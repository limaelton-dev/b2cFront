'use client';

import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import ReactInputMask from 'react-input-mask';
import { formatPrice } from '@/utils/product';

const THEME_COLOR = '#252d5f';

interface ShippingInfo {
    serviceName: string;
    deliveryTime?: number;
    price: number;
}

interface ProductShippingProps {
    postalCode: string;
    onPostalCodeChange: (value: string) => void;
    onCalculate: () => void;
    loading: boolean;
    error?: string;
    shippingInfo?: ShippingInfo;
}

export default function ProductShipping({
    postalCode,
    onPostalCodeChange,
    onCalculate,
    loading,
    error,
    shippingInfo,
}: ProductShippingProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #e8e8e8',
                bgcolor: '#fafafa',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShipping sx={{ color: THEME_COLOR, fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                    Calcule o frete
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <ReactInputMask
                    mask="99999-999"
                    value={postalCode}
                    onChange={(e) => onPostalCodeChange(e.target.value)}
                    maskChar=""
                >
                    {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                        <TextField
                            {...inputProps}
                            placeholder="00000-000"
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#fff',
                                    borderRadius: 1.5,
                                },
                            }}
                        />
                    )}
                </ReactInputMask>
                <Button
                    variant="contained"
                    onClick={onCalculate}
                    disabled={loading || postalCode.replace(/\D/g, '').length < 8}
                    sx={{
                        bgcolor: THEME_COLOR,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 1.5,
                        '&:hover': { bgcolor: '#1a2147' },
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Calcular'}
                </Button>
            </Box>

            {error && (
                <Typography
                    variant="caption"
                    sx={{ color: '#d32f2f', display: 'block', mt: 1.5 }}
                >
                    {error}
                </Typography>
            )}

            {shippingInfo && (
                <Paper
                    elevation={0}
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: '#fff',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                                {shippingInfo.serviceName}
                            </Typography>
                            {shippingInfo.deliveryTime && (
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    Entrega em até {shippingInfo.deliveryTime} dias úteis
                                </Typography>
                            )}
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 700, color: THEME_COLOR }}
                        >
                            R$ {formatPrice(shippingInfo.price)}
                        </Typography>
                    </Box>
                </Paper>
            )}
        </Paper>
    );
}

