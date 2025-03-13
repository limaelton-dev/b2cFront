"use client"
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../header';
import SideBar from './components/layout/SideBar';
import DadosPessoais from './features/dados-pessoais/DadosPessoais';
import MeusEnderecos from './features/meus-enderecos/MeusEnderecos';
import MeusCartoes from './features/meus-cartoes/MeusCartoes';
import MinhasCompras from './features/minhas-compras/MinhasCompras';
import Cart from '../components/cart';
import { MainItemType } from './types';

// Importações de CSS necessárias para o header
import '../assets/css/--globalClasses.css';
import '../assets/css/home.css';
import '../assets/css/home/header.css';
import '../assets/css/home/cart.css';
import '../assets/css/home/footer.css';
import '../assets/css/home/categorias.css';

// Ícones
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

// Definição dos itens do menu lateral
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

const MyAccountPage: React.FC = () => {
  // Estado para controlar o carrinho
  const [openedCart, setOpenedCart] = useState(false);
  
  // Estado para controlar a seção atual
  const [activeSection, setActiveSection] = useState('Dados pessoais');


  // Função para renderizar o conteúdo com base na seção ativa
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
    <>
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
          
          <Box sx={{ 
            flex: 1, 
            mt: { xs: 0, md: 0 },
          }}>
            {renderContent()}
          </Box>
        </Box>
      </main>
    </>
  );
};

export default MyAccountPage;