'use client';

import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import {
    LocalShipping,
    Security,
    CreditCard,
    Pix,
} from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

interface InfoCardItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const infoCards: InfoCardItem[] = [
    {
        icon: <LocalShipping sx={{ fontSize: 40, color: THEME_COLOR }} />,
        title: 'Frete grátis',
        description: 'Veja as condições',
    },
    {
        icon: <Security sx={{ fontSize: 40, color: THEME_COLOR }} />,
        title: 'Compra segura',
        description: 'Sua compra é segura',
    },
    {
        icon: <CreditCard sx={{ fontSize: 40, color: THEME_COLOR }} />,
        title: 'Parcele em até 12x',
        description: 'Sem juros no crédito',
    },
    {
        icon: <Pix sx={{ fontSize: 40, color: THEME_COLOR }} />,
        title: 'Pagamento com Pix',
        description: 'Aprovação instantânea',
    },
];

export default function InfoCards() {
    return (
        <Box component="section" sx={{ py: 4, backgroundColor: '#fff' }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 2, md: 3 },
                    }}
                >
                    {infoCards.map((card, index) => (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                px: 3,
                                py: 2,
                                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'auto' },
                                maxWidth: { xs: '100%', md: 280 },
                                backgroundColor: 'transparent',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#333',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {card.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {card.description}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

