'use client';

import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Header from '@/app/header';
import Cart from '@/components/Cart';
import { Breadcrumbs } from '@/components/common';
import SideBar from './components/layout/SideBar';
import DadosPessoais from './sections/dados-pessoais/DadosPessoais';
import MeusEnderecos from './sections/meus-enderecos/MeusEnderecos';
import MeusCartoes from './sections/meus-cartoes/MeusCartoes';
import MinhasCompras from './sections/minhas-compras/MinhasCompras';
import { MainItemType } from './types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

const THEME_COLOR = '#252d5f';

const mainItems: MainItemType[] = [
    {
        icon: <FeaturedPlayListOutlinedIcon />,
        label: 'Meus dados',
        subItems: [
            { icon: <BadgeOutlinedIcon />, label: 'Dados pessoais' },
            { icon: <PlaceOutlinedIcon />, label: 'Meus endereços' },
        ],
    },
    {
        icon: <LocalMallOutlinedIcon />,
        label: 'Minhas compras',
    },
    {
        icon: <CreditCardIcon />,
        label: 'Meus cartões',
    },
];

export default function MyAccountPage() {
    const [openedCart, setOpenedCart] = useState(false);
    const [activeSection, setActiveSection] = useState('Dados pessoais');

    const renderContent = () => {
        switch (activeSection) {
            case 'Dados pessoais':
                return <DadosPessoais />;
            case 'Meus endereços':
                return <MeusEnderecos />;
            case 'Minhas compras':
                return <MinhasCompras />;
            case 'Meus cartões':
                return <MeusCartoes />;
            default:
                return <DadosPessoais />;
        }
    };

    const getBreadcrumbItems = () => {
        const items = [{ label: 'Minha Conta' }];

        if (activeSection !== 'Minha Conta') {
            items[0] = { label: 'Minha Conta', href: '#' };
            items.push({ label: activeSection });
        }

        return items;
    };

    return (
        <ProtectedRoute>
            <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart} />

            <Container maxWidth="lg">
                <Breadcrumbs items={getBreadcrumbItems()} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        pb: 6,
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', md: 280 },
                            flexShrink: 0,
                        }}
                    >
                        <SideBar
                            items={mainItems}
                            onSectionChange={setActiveSection}
                            activeSection={activeSection}
                        />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>{renderContent()}</Box>
                </Box>
            </Container>
        </ProtectedRoute>
    );
}
