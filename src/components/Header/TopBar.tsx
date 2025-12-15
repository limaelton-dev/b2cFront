'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Container } from '@mui/material';
import {
    PhoneAndroid,
    LocationOn,
    Headset,
    LocalShipping,
    Receipt,
} from '@mui/icons-material';

const TOPBAR_GRADIENT = 'linear-gradient(90deg, rgba(106,17,17,1) 0%, rgba(14,17,43,1) 64%, rgba(12,17,79,1) 100%)';

interface TopBarLinkProps {
    icon: React.ReactNode;
    label: string;
    href?: string;
}

function TopBarLink({ icon, label, href }: TopBarLinkProps) {
    const content = (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#BCBCBE',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#fff' },
            }}
        >
            {icon}
            <Typography variant="caption" sx={{ color: 'inherit' }}>
                {label}
            </Typography>
        </Box>
    );

    if (href) {
        return (
            <Link href={href} style={{ textDecoration: 'none' }}>
                {content}
            </Link>
        );
    }

    return content;
}

export default function TopBar() {
    return (
        <Box
            sx={{
                background: TOPBAR_GRADIENT,
                py: 0.75,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TopBarLink
                            icon={<Headset sx={{ fontSize: 16 }} />}
                            label="Contate-nos"
                            href="/contato"
                        />
                        <TopBarLink
                            icon={<LocalShipping sx={{ fontSize: 16 }} />}
                            label="Rastrear pedido"
                            href="/rastreio"
                        />
                        <TopBarLink
                            icon={<Receipt sx={{ fontSize: 16 }} />}
                            label="Meus pedidos"
                            href="/minhaconta/pedidos"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TopBarLink
                            icon={<PhoneAndroid sx={{ fontSize: 16 }} />}
                            label="Baixar App"
                        />
                        <TopBarLink
                            icon={<LocationOn sx={{ fontSize: 16 }} />}
                            label="Local da Loja"
                            href="/localizacao"
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
