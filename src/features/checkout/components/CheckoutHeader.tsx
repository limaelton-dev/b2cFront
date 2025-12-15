'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoColetek from '@/assets/img/logo_coletek.png';
import { THEME_COLOR } from '../theme';

export default function CheckoutHeader() {
    return (
        <Box
            component="header"
            sx={{
                bgcolor: '#fff',
                borderBottom: '1px solid #e8e8e8',
                py: 2,
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
                    <Link href="/">
                        <Image
                            src={LogoColetek}
                            alt="Coletek"
                            width={160}
                            height={50}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </Link>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <LockOutlinedIcon
                            sx={{
                                color: THEME_COLOR,
                                fontSize: 32,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.3,
                                color: '#333',
                            }}
                        >
                            Compra
                            <br />
                            100% Segura
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

