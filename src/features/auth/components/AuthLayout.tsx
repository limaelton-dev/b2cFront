'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Paper, Typography } from '@mui/material';
import Logo from '@/assets/img/logo_coletek_white.png';

const THEME_COLOR = '#252d5f';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #1a1f4e 0%, #2d1b4e 50%, #4a1942 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-25%',
                    width: '80%',
                    height: '150%',
                    background: 'radial-gradient(ellipse, rgba(106, 17, 17, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-30%',
                    right: '-20%',
                    width: '60%',
                    height: '100%',
                    background: 'radial-gradient(ellipse, rgba(12, 17, 79, 0.4) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: 1000,
                        minHeight: 600,
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(180deg, rgba(26, 31, 78, 0.9) 0%, rgba(45, 27, 78, 0.9) 100%)',
                            backdropFilter: 'blur(10px)',
                            p: 6,
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'radial-gradient(circle at 30% 70%, rgba(74, 25, 66, 0.4) 0%, transparent 50%)',
                            }}
                        />
                        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <Image
                                src={Logo}
                                alt="Coletek"
                                width={280}
                                height={140}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    mt: 3,
                                    fontSize: '0.875rem',
                                }}
                            >
                                © Coletek {new Date().getFullYear()}
                            </Typography>
                        </Box>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: '#fff',
                            borderRadius: 0,
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                p: { xs: 3, sm: 5 },
                                overflowY: 'auto',
                            }}
                        >
                            <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
                                <Image
                                    src={Logo}
                                    alt="Coletek"
                                    width={180}
                                    height={90}
                                    style={{ 
                                        objectFit: 'contain',
                                        filter: 'brightness(0) saturate(100%) invert(15%) sepia(30%) saturate(1500%) hue-rotate(200deg)',
                                    }}
                                    priority
                                />
                            </Box>

                            {title && (
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: THEME_COLOR,
                                        fontWeight: 700,
                                        mb: subtitle ? 1 : 3,
                                        textAlign: 'center',
                                    }}
                                >
                                    {title}
                                </Typography>
                            )}

                            {subtitle && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#666',
                                        mb: 4,
                                        textAlign: 'center',
                                    }}
                                >
                                    {subtitle}
                                </Typography>
                            )}

                            {children}
                        </Box>

                        <Box
                            sx={{
                                borderTop: '1px solid #eee',
                                py: 2,
                                px: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 3,
                                flexWrap: 'wrap',
                            }}
                        >
                            {['Termos de serviço', 'Política de Privacidade', 'Política de Entrega'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    style={{
                                        color: '#888',
                                        fontSize: '0.75rem',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
