'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Rating,
    Box,
    CircularProgress,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Product } from '@/api/products/types/product';
import {
    getProductImage,
    getProductName,
    getProductPriceWithDiscount,
    getActiveSku,
} from '@/utils/product';

const THEME_COLOR = '#252d5f';

interface ProductCardProps {
    product: Product;
    isLoading?: boolean;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, isLoading = false, onAddToCart }: ProductCardProps) {
    const priceInfo = getProductPriceWithDiscount(product);
    const activeSku = getActiveSku(product);
    const hasStock = activeSku && (activeSku.marketplaceStock ?? activeSku.amount ?? 0) > 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading && hasStock) {
            onAddToCart(product);
        }
    };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 3,
                border: '1px solid #e8e8e8',
                boxShadow: 'none',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(37, 45, 95, 0.12)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {priceInfo.hasDiscount && (
                <Chip
                    label={`${priceInfo.discountPercentage}% OFF`}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1,
                        backgroundColor: THEME_COLOR,
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                    }}
                />
            )}

            <Link href={`/produto/${product.slug}`} style={{ textDecoration: 'none' }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%',
                        backgroundColor: '#fafafa',
                        borderRadius: '12px 12px 0 0',
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src={getProductImage(product)}
                        alt={getProductName(product)}
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        style={{ objectFit: 'contain', padding: '16px' }}
                        unoptimized
                    />
                </Box>
            </Link>

            <CardContent sx={{ flexGrow: 1, pb: 1, pt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                        value={4.7}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{
                            '& .MuiRating-iconFilled': { color: '#F6B608' },
                            '& .MuiRating-iconEmpty': { color: '#e0e0e0' },
                        }}
                    />
                    <Typography variant="caption" sx={{ ml: 0.5, color: '#666' }}>
                        4.7
                    </Typography>
                </Box>

                <Link href={`/produto/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: '#333',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            minHeight: 40,
                            lineHeight: 1.3,
                            '&:hover': { color: THEME_COLOR },
                        }}
                    >
                        {getProductName(product)}
                    </Typography>
                </Link>

                {product.model && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#999',
                            display: 'block',
                            mt: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {product.model}
                    </Typography>
                )}

                <Box sx={{ mt: 1.5 }}>
                    {priceInfo.hasDiscount && priceInfo.originalPrice && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#999',
                                textDecoration: 'line-through',
                                display: 'block',
                            }}
                        >
                            {priceInfo.originalPrice}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#333',
                                fontSize: '1.1rem',
                            }}
                        >
                            {priceInfo.finalPrice}
                        </Typography>
                        {priceInfo.hasDiscount && (
                            <Chip
                                label={`${priceInfo.discountPercentage}% OFF`}
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(37, 45, 95, 0.1)',
                                    color: THEME_COLOR,
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    height: 20,
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={!isLoading && <ShoppingCart fontSize="small" />}
                    disabled={isLoading || !hasStock}
                    onClick={handleAddToCart}
                    sx={{
                        backgroundColor: THEME_COLOR,
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#1a2147',
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666',
                        },
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : hasStock ? (
                        'Adicionar ao carrinho'
                    ) : (
                        'Indisponível'
                    )}
                </Button>
            </CardActions>
        </Card>
    );
}

