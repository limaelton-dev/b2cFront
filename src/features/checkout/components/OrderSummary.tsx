'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Paper, Typography, List, ListItem, Divider, Skeleton } from '@mui/material';
import { THEME_COLOR } from '../theme';
import { getCartItemImage, getCartItemTitle, getProductSkuCode, getProductCategory } from '@/utils/product';

interface CartItem {
    skuId: number;
    quantity: number;
    product?: any;
    sku?: any;
}

interface OrderSummaryProps {
    cartItems: CartItem[];
    subtotal: string;
    rawTotal: string;
    pixDiscountedPrice: string;
    pixDiscount: number;
    shippingPrice: number | null;
    isLoading?: boolean;
}

export default function OrderSummary({
    cartItems,
    subtotal,
    rawTotal,
    pixDiscountedPrice,
    pixDiscount,
    shippingPrice,
    isLoading = false,
}: OrderSummaryProps) {
    if (isLoading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid #e8e8e8',
                }}
            >
                <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Box sx={{ flex: 1 }}>
                        {[1, 2].map((i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Skeleton variant="rounded" width={80} height={80} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ minWidth: 280 }}>
                        <Skeleton variant="rounded" height={180} />
                    </Box>
                </Box>
            </Paper>
        );
    }

    const hasItems = cartItems.length > 0;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                border: '1px solid #e8e8e8',
            }}
        >
            <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <Box
                    sx={{
                        flex: 1,
                        maxHeight: 262,
                        overflowY: 'auto',
                        pr: 1.5,
                        '&::-webkit-scrollbar': {
                            width: 5,
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 10,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(0, 0, 0, 0.3)',
                        },
                    }}
                >
                    {hasItems ? (
                        cartItems.map((item, index) => {
                            const category = getProductCategory(item);

                            return (
                                <Box
                                    key={`${item.skuId}-${index}`}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mb: 2,
                                        pb: 2,
                                        borderBottom: index < cartItems.length - 1 ? '1px solid #e8e8e8' : 'none',
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
                        })
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Nenhum produto no carrinho
                        </Typography>
                    )}
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        bgcolor: '#f8f9fa',
                        p: 2,
                        borderRadius: 2,
                        minWidth: 280,
                    }}
                >
                    {hasItems ? (
                        <List dense disablePadding>
                            <ListItem sx={{ justifyContent: 'space-between', py: 1, px: 0 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="body2">R$ {rawTotal}</Typography>
                            </ListItem>
                            <ListItem sx={{ justifyContent: 'space-between', py: 1, px: 0 }}>
                                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                                    Total à vista ({pixDiscount}% off)
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                                    R$ {pixDiscountedPrice}
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ justifyContent: 'space-between', py: 1, px: 0 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Entrega
                                </Typography>
                                <Typography variant="body2">
                                    R$ {shippingPrice ? shippingPrice.toFixed(2).replace('.', ',') : '0,00'}
                                </Typography>
                            </ListItem>
                            <Divider sx={{ my: 1 }} />
                            <ListItem sx={{ justifyContent: 'space-between', py: 1, px: 0 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: THEME_COLOR }}>
                                    R$ {subtotal.replace('.', ',')}
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
    );
}

