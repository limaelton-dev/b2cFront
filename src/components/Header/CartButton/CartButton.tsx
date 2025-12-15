'use client';

import React from 'react';
import { Box, Badge, Typography, Tooltip } from '@mui/material';
import { ShoppingBagOutlined } from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

interface CartButtonProps {
    count: number;
    onClick: () => void;
}

export default function CartButton({ count, onClick }: CartButtonProps) {
    return (
        <Tooltip title="Carrinho" arrow>
            <Box
                onClick={onClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(37, 45, 95, 0.05)',
                        '& .cart-icon': { color: THEME_COLOR },
                        '& .cart-text': { color: THEME_COLOR },
                    },
                }}
            >
                <Badge
                    badgeContent={count}
                    max={99}
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: THEME_COLOR,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            minWidth: 18,
                            height: 18,
                            animation: count > 0 ? 'pulse 0.3s ease-in-out' : 'none',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.2)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        },
                    }}
                >
                    <ShoppingBagOutlined
                        className="cart-icon"
                        sx={{
                            fontSize: 26,
                            color: '#666',
                            transition: 'color 0.2s ease',
                        }}
                    />
                </Badge>
                <Typography
                    className="cart-text"
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: '#666',
                        fontSize: '0.85rem',
                        display: { xs: 'none', sm: 'block' },
                        transition: 'color 0.2s ease',
                    }}
                >
                    Carrinho
                </Typography>
            </Box>
        </Tooltip>
    );
}
