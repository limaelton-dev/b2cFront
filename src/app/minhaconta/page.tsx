"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import '../assets/css/produto.css';
import { useEffect, useState } from 'react';
import { getProduto } from '../services/produto/page';
import Cart from '../components/cart';
import Header from '../header';
import { useCart } from '../context/cart';
import { Alert, Snackbar, Slide, Typography, Box } from '@mui/material';
import DadosPessoais from './components/DadosPessoais';
import MinhasComprasPage from './components/MinhasComprasPage';
import MeusEnderecos from './components/MeusEnderecos';



const ProductPage = ({cart}) => {
    const { addToCart, cartItems } = useCart();
    const { codigo } = useParams();
    const [product, setProduct] = useState({
        pro_codigo: 54862,
        pro_descricao: 'DISCO FLAP 4 1/2" GRÃO 400',
        pro_valorultimacompra: 139.90,
        pro_quantity: 1,
    });
    const [openedCart, setOpenedCart] = useState(false);
    const [response, setResponse] = useState();
    const [openToast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [renderedSection, setRenderedSection] = React.useState('Dados Pessoais');

    const renderContent = () => {
        switch (renderedSection) {
          case 'Dados Pessoais':
            return <DadosPessoais />;
          case 'Minhas Compras':
            return <MinhasComprasPage />;
          case 'Meus Endereços':
            return <MeusEnderecos />;
          default:
            return (
              <Typography sx={{ marginBottom: 2 }}>
                Selecione uma opção no menu.
              </Typography>
            );
        }
      };

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await getProduto(codigo);
                if(response.status === 200 && response.data) {
                    setProduct(response.data[0]);
                }
            } catch (error) {
                console.error('Erro ao buscar produtos', error);
            }
        };
        fetchProduto();
    },[])

    const handleAddToCart = () => {
        if(!addToCart(product)) {
            setToast(true);
            setToastMessage('O produto já existe no carrinho.')
        }
        else {
            setTimeout(() => {
                setOpenedCart(true);
            }, 500)
        }
    }

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
            <Box 
                sx={{padding:'20px 200px'}}
                > 
                {renderContent()}
            </Box>

            {/* <footer>
                <div className="container d-flex flex-wrap">
                    <div className="col-lg-3">
                        <div className="logo-footer">
                            <img src="./assets/imgs/logo_coletek.png" alt=""/>
                        </div>
                        <h4>Siga-nos nas<br/>redes sociais!</h4>
                        <ul>
                            <li></li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <h4>Institucional</h4>
                        <ul>
                            <li>
                                <a href="">Quem somos</a>
                            </li>
                            <li>
                                <a href="">Blog</a>
                            </li>
                            <li>
                                <a href="">Localização</a>
                            </li>
                            <li>
                                <a href="">Trabalhe conosco</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <h4>Dúvidas</h4>
                        <ul>
                            <li>
                                <a href="">Política de privacidade</a>
                            </li>
                            <li>
                                <a href="">Política de entrega</a>
                            </li>
                            <li>
                                <a href="">Termos e condições</a>
                            </li>
                            <li>
                                <a href="">Central de atendimento</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <h4>Newsletter</h4>
                        <p>Inscreva-se para receber nossas ofertas!</p>
                        <form action="url" method="POST" id="newsletter-form">
                            <div className="content-inp">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/>
                                </svg>
                                <input type="text" name="email" placeholder="Digite seu email"/>
                            </div>
                            <button>
                                Inscrever
                            </button>
                        </form>
                    </div>
                    <div className="copyright">
                        <hr/>
                        <p>©️ Coletek 2024.</p>
                    </div>
                </div>
            </footer> */}
        </main>
    </>
  );
};

export default ProductPage;