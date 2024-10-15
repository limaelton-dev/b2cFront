"use client"
import React from 'react';
import '../assets/css/minhaconta.css';
import { useState } from 'react';
import Cart from '../components/cart';
import Header from '../header';
import { Alert, Snackbar, Slide, Typography, Box, List } from '@mui/material';
import DadosPessoais from './components/DadosPessoais';
import MinhasComprasPage from './components/MinhasComprasPage';
import MeusEnderecos from './components/MeusEnderecos';
import SideBar from './components/SideBar';

import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

const mainItems = [
    {
        icon: <FeaturedPlayListOutlinedIcon sx={{color: '#4C90F3'}} />,
        label: 'Meus dados',
        subItems: [
            { icon: <></>, label: 'Dados pessoais'},
            { icon: <></>, label: 'Meus endereços'},
        ],
    },
    {
        icon: <LocalMallOutlinedIcon sx={{color: '#4C90F3'}}/>,
        label: 'Minhas compras',
    },
    {
        icon: <CreditCardIcon sx={{color: '#4C90F3'}}/>,
        label: 'Meus cartões',
    }
];


const MyAccountPage = ({cart}) => {

    const [openedCart, setOpenedCart] = useState(false);
    const [openToast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [renderedSection, setRenderedSection] = React.useState('Dados Pessoais');

    const handleSectionChange = (section) => {
        setRenderedSection(section);
    }

    const renderContent = () => {
        switch (renderedSection) {
          case 'Dados pessoais':
            return <DadosPessoais />;
          case 'Minhas compras':
            return <MinhasComprasPage />;
          case 'Meus endereços':
            return <MeusEnderecos />;
          default:
            return (
              <Typography sx={{ marginBottom: 2 }}>
                Selecione uma opção no menu.
              </Typography>
            );
        }
      };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setToast(false);
    };

    return (
    <>
        <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
        <Snackbar
            sx={{ borderRadius: '3px'}}
            open={openToast}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionComponent={Slide}
        >   
            <Alert severity="info" sx={{ 
                width: '100%',
                boxShadow: '0px 0px 1px 1px red;',
                background: 'white',
                color: 'red',
                '.MuiAlert-icon': {
                    color: 'red',
                }
            }}>
                {toastMessage}
            </Alert>
        </Snackbar>
        <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
        
        <main>
            {/* <Typography sx={{padding:'0px 291.5px'}}> Minha Conta </Typography> */}
            <Box 
                sx={{
                    padding:'0px 291.5px',
                    display: 'flex',
                    gap: '1',
                }}
                
            > 

                <Box component="div" sx= {{marginTop: '24px', width: '500px'}}>
                    <SideBar items={mainItems} onSectionChange={setRenderedSection} />
                </Box>
                {renderContent()}
            </Box>
        </main>
    </>
  );
};

export default MyAccountPage;