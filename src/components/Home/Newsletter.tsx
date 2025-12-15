'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
} from '@mui/material';
import { Email } from '@mui/icons-material';

const THEME_COLOR = '#252d5f';

interface NewsletterProps {
    backgroundImage?: string;
}

export default function Newsletter({ backgroundImage }: NewsletterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accepted) return;
        console.log('Newsletter subscription:', { name, email });
    };

    return (
        <Box
            component="section"
            sx={{
                py: 6,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: backgroundImage ? undefined : THEME_COLOR,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'center', md: 'flex-start' },
                        gap: { xs: 4, md: 6 },
                    }}
                >
                    <Box sx={{ flex: { md: '0 0 40%' }, textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                mb: 1.5,
                                lineHeight: 1.3,
                            }}
                        >
                            Fique por dentro de todas as nossas ofertas e novidades
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                            }}
                        >
                            <strong>Cadastre seu email</strong> para receber todas as atualizações.
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            flex: 1,
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            <TextField
                                placeholder="Digite seu Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                        borderRadius: 3,
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            <TextField
                                placeholder="Digite seu Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                        borderRadius: 3,
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Email />}
                                disabled={!accepted || !email}
                                sx={{
                                    backgroundColor: '#1a2147',
                                    color: '#fff',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 3,
                                    px: 3,
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        backgroundColor: '#0f1530',
                                    },
                                    '&:disabled': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                    },
                                }}
                            >
                                Quero receber
                            </Button>
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-checked': {
                                            color: '#fff',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                    Estou ciente das condições de tratamento dos meus dados pessoais e
                                    forneço meu consentimento conforme descrito na{' '}
                                    <Link href="/privacidade" sx={{ color: '#fff', fontWeight: 600 }}>
                                        Política de Privacidade
                                    </Link>
                                    . Você pode cancelar a inscrição a qualquer momento.
                                </Typography>
                            }
                            sx={{ alignItems: 'flex-start', mt: 1 }}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

