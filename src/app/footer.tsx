'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Box,
    Container,
    Typography,
    IconButton,
    Divider,
    Grid,
} from '@mui/material';
import {
    Facebook,
    Instagram,
    LinkedIn,
    YouTube,
} from '@mui/icons-material';
import LogoColetek from '@/assets/img/logo_coletek_white.png';

const THEME_COLOR = '#252d5f';

interface FooterLink {
    label: string;
    href: string;
}

const institutionalLinks: FooterLink[] = [
    { label: 'Quem somos', href: '/quem-somos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Localização', href: '/localizacao' },
    { label: 'Trabalhe conosco', href: '/trabalhe-conosco' },
];

const helpLinks: FooterLink[] = [
    { label: 'Política de privacidade', href: '/privacidade' },
    { label: 'Política de entrega', href: '/entrega' },
    { label: 'Termos e condições', href: '/termos' },
    { label: 'Central de atendimento', href: '/atendimento' },
];

const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <YouTube />, href: 'https://youtube.com', label: 'YouTube' },
];

function FooterLinkSection({ title, links }: { title: string; links: FooterLink[] }) {
    return (
        <Box>
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 700,
                    color: '#fff',
                    mb: 2,
                    fontSize: '1rem',
                }}
            >
                {title}
            </Typography>
            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: '#fff',
                                },
                            }}
                        >
                            {link.label}
                        </Typography>
                    </Link>
                ))}
            </Box>
        </Box>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: THEME_COLOR,
                color: '#fff',
                pt: 6,
                pb: 3,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Logo and Social */}
                    <Grid item xs={12} md={3}>
                        <Box sx={{ mb: 3 }}>
                            <Image
                                src={LogoColetek}
                                alt="Coletek"
                                width={140}
                                height={50}
                                style={{ objectFit: 'contain' }}
                                unoptimized
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                mb: 2,
                                lineHeight: 1.6,
                            }}
                        >
                            Sua loja de tecnologia e informática com os melhores preços e produtos.
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: '#fff',
                                fontWeight: 600,
                                mb: 1.5,
                            }}
                        >
                            Siga-nos nas redes sociais
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {socialLinks.map((social) => (
                                <IconButton
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            color: '#fff',
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                    }}
                                    size="small"
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Institutional Links */}
                    <Grid item xs={6} md={3}>
                        <FooterLinkSection title="Institucional" links={institutionalLinks} />
                    </Grid>

                    {/* Help Links */}
                    <Grid item xs={6} md={3}>
                        <FooterLinkSection title="Dúvidas" links={helpLinks} />
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: '#fff',
                                mb: 2,
                                fontSize: '1rem',
                            }}
                        >
                            Contato
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                contato@coletek.com.br
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                (11) 1234-5678
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                Segunda a Sexta: 9h às 18h
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Copyright */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        © {currentYear} Coletek. Todos os direitos reservados.
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.4)',
                            textAlign: { xs: 'center', sm: 'right' },
                        }}
                    >
                        CNPJ: 00.000.000/0001-00
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
