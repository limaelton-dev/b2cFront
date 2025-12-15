'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
    SearchOff,
    ErrorOutline,
    RefreshOutlined,
    ShoppingBagOutlined,
} from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

type EmptyStateType = 'empty' | 'error' | 'no-results';

interface ProductsEmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    description?: string;
    onRetry?: () => void;
    showRetryButton?: boolean;
    showBrowseButton?: boolean;
}

const defaultContent: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
    empty: {
        icon: <ShoppingBagOutlined sx={{ fontSize: 80, color: THEME_COLOR, opacity: 0.6 }} />,
        title: 'Nenhum produto disponível',
        description: 'No momento não há produtos para exibir. Volte em breve para conferir as novidades!',
    },
    error: {
        icon: <ErrorOutline sx={{ fontSize: 80, color: '#d32f2f', opacity: 0.7 }} />,
        title: 'Ops! Algo deu errado',
        description: 'Não foi possível carregar os produtos. Por favor, tente novamente.',
    },
    'no-results': {
        icon: <SearchOff sx={{ fontSize: 80, color: THEME_COLOR, opacity: 0.6 }} />,
        title: 'Nenhum resultado encontrado',
        description: 'Não encontramos produtos com os filtros selecionados. Tente ajustar sua busca.',
    },
};

export default function ProductsEmptyState({
    type = 'empty',
    title,
    description,
    onRetry,
    showRetryButton = true,
    showBrowseButton = true,
}: ProductsEmptyStateProps) {
    const content = defaultContent[type];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 8,
                px: 3,
                width: '100%',
                minHeight: 300,
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: '50%',
                    backgroundColor: type === 'error' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(37, 45, 95, 0.08)',
                }}
            >
                {content.icon}
            </Box>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 1.5,
                }}
            >
                {title || content.title}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: '#666',
                    maxWidth: 400,
                    mb: 3,
                    lineHeight: 1.6,
                }}
            >
                {description || content.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {showRetryButton && type === 'error' && onRetry && (
                    <Button
                        variant="contained"
                        startIcon={<RefreshOutlined />}
                        onClick={onRetry}
                        sx={{
                            backgroundColor: THEME_COLOR,
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#1a2147',
                            },
                        }}
                    >
                        Tentar novamente
                    </Button>
                )}

                {showBrowseButton && (
                    <Button
                        variant={type === 'error' ? 'outlined' : 'contained'}
                        href="/produtos"
                        sx={{
                            backgroundColor: type === 'error' ? 'transparent' : THEME_COLOR,
                            color: type === 'error' ? THEME_COLOR : '#fff',
                            borderColor: THEME_COLOR,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: type === 'error' ? 'rgba(37, 45, 95, 0.08)' : '#1a2147',
                                borderColor: THEME_COLOR,
                            },
                        }}
                    >
                        Ver todos os produtos
                    </Button>
                )}
            </Box>
        </Box>
    );
}

