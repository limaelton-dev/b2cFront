'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthProvider';
import TopBar from '../components/Header/TopBar';
import Logo from '../components/Header/Logo';
import SearchBox from '../components/Header/SearchBox/SearchBox';
import UserMenu from '../components/Header/UserMenu/UserMenu';
import CartButton from '../components/Header/CartButton/CartButton';
import CategoriesNav from '../components/Header/CategoriesNav/CategoriesNav';

interface HeaderProps {
    cartOpened: boolean;
    onCartToggle: (opened: boolean) => void;
}

export default function Header({ cartOpened, onCartToggle }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { cart } = useCart();

    const handleSubmitSearch = (term: string) => {
        if (!term.trim()) return;

        if (pathname === '/produtos') {
            const params = new URLSearchParams(window.location.search);
            params.set('s', term);
            params.set('page', '1');
            router.push(`/produtos?${params.toString()}`);
        } else {
            router.push(`/produtos?s=${encodeURIComponent(term)}&page=1`);
        }
    };

    const handleCartToggle = () => {
        onCartToggle(!cartOpened);
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
        >
            <TopBar />

            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 2, md: 4 },
                        py: 2,
                    }}
                >
                    <Box sx={{ flexShrink: 0 }}>
                        <Logo onClick={handleLogoClick} />
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            maxWidth: 600,
                            mx: { xs: 1, md: 4 },
                        }}
                    >
                        <SearchBox onSubmit={handleSubmitSearch} />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, md: 2 },
                            flexShrink: 0,
                        }}
                    >
                        <UserMenu user={user} />
                        <Box
                            sx={{
                                width: 1,
                                height: 32,
                                bgcolor: '#e8e8e8',
                                display: { xs: 'none', md: 'block' },
                            }}
                        />
                        <CartButton
                            count={cart?.items?.length || 0}
                            onClick={handleCartToggle}
                        />
                    </Box>
                </Box>
            </Container>

            <Box
                sx={{
                    bgcolor: '#f8f9fa',
                    borderTop: '1px solid #e8e8e8',
                    borderBottom: '1px solid #e8e8e8',
                }}
            >
                <Container maxWidth="lg">
                    <CategoriesNav />
                </Container>
            </Box>
        </Box>
    );
}
