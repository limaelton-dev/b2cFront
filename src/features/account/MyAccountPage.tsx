"use client"
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '@/app/header';
import Cart from '@/components/Cart';
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

const mainItems: MainItemType[] = [
    {
        icon: <FeaturedPlayListOutlinedIcon sx={{color: '#102d57'}} />,
        label: 'Meus dados',
        subItems: [
            { icon: <BadgeOutlinedIcon sx={{color: '#102d57', fontSize: 20}} />, label: 'Dados pessoais'},
            { icon: <PlaceOutlinedIcon sx={{color: '#102d57', fontSize: 20}} />, label: 'Meus endereços'},
        ],
    },
    {
        icon: <LocalMallOutlinedIcon sx={{color: '#102d57'}}/>,
        label: 'Minhas compras',
    },
    {
        icon: <CreditCardIcon sx={{color: '#102d57'}}/>,
        label: 'Meus cartões',
    }
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

    return (
        <ProtectedRoute>
            <div className="container-fluid p-0">
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </div>
            
            <main>
                <Box 
                    sx={{
                        maxWidth: '1296px',
                        width: '100%',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 3, md: 4 },
                        pb: 6,
                        mt: 4,
                    }}
                >
                    <Box sx={{ 
                        width: { xs: '100%', md: '280px' }, 
                        flexShrink: 0,
                        mt: { xs: 2, md: 0 },
                    }}>
                        <SideBar 
                            items={mainItems} 
                            onSectionChange={setActiveSection} 
                            activeSection={activeSection}
                        />
                    </Box>
                    
                    <Box sx={{ flex: 1, mt: { xs: 0, md: 0 } }}>
                        {renderContent()}
                    </Box>
                </Box>
            </main>
        </ProtectedRoute>
    );
}

