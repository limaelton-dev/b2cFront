"use client"
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import '../assets/css/produtos.css';
import Image from 'next/image';
import LogoColetek from '../assets/img/logo_coletek.png';
import HeadphoneImg from '../assets/img/headphone.png';
import BannerProd from '../assets/img/banner_mouse.png';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEffect, useState } from 'react';
import { getProduto } from '../services/produto/page';
import Cart from '../components/cart';
import Header from '../header';
import { useCart } from '../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography, Checkbox, FormControlLabel, FormGroup, Pagination, Switch } from '@mui/material';
import { useToastSide } from '../context/toastSide';
import Footer from '../footer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ProductsPage = () => {
    const [openedCart, setOpenedCart] = useState(false);
    const [loadBtn, setLoadBtn] = useState(false);
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [products, serProducts] = useState<{ name: string; img: string; price: string; sku: string }[]>([]);
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const { codigo } = useParams();
    const [product, setProduct] = useState({
        pro_codigo: 54862,
        pro_descricao: 'DISCO FLAP 4 1/2" GRÃO 400',
        pro_valorultimacompra: 139.90,
        cores: []
    });
    const searchParams = useSearchParams();

    const category = searchParams.get("categoria");
    const offer = searchParams.get("offer");
    
    const handleAddToCart = async () => {
        setLoadBtn(true);
        if(!addToCart(product, isActiveColorId)) {
            showToast('O produto já existe no carrinho!','error')
            setLoadBtn(false);
        }
        else {
            setTimeout(() => {
                setLoadBtn(false)
                showToast('O produto foi adicionado ao carrinho!','success')
                setOpenedCart(true);
            }, 500)
        }
    }

    useEffect(() => {
        serProducts([
            {name: 'Bebedouro com Compressor ADD4923L 127V Philips', img: 'https://www.portalcoletek.com.br/Imagens/PHILIPS_ADD4923L_01.jpg', price: 'R$ 254,90', sku: 'ADD4923L127V-PL'},
            {name: 'Garrafa de Agua Daily AWP2731GRR Cinza Philips', img: 'https://www.portalcoletek.com.br/Imagens/PHILIPS_AWP2731GRR_01.jpg', price: 'R$ 119,90', sku: 'AWP2731GRR-PL'},
            {name: 'Mouse Pad Game MP7035 Preto HP', img: 'https://www.portalcoletek.com.br/Imagens/HPGAMING_7JH36AA_01.jpg', price: 'R$ 29,90', sku: 'MP7035-HP'},
            {name: 'Mouse Game USB M270 Preto HP', img: 'https://www.portalcoletek.com.br/Imagens/HPGAMING_7ZZ87AA_01.jpg', price: 'R$ 149,90', sku: 'M270-HP'},
            {name: 'Teclado Game USB K500F HP', img: 'https://www.portalcoletek.com.br/Imagens/HPGAMING_7ZZ97AA_01.jpg', price: 'R$ 199,90', sku: 'K500F-HP'},
            {name: 'Fone Com Microfone Game 7.1 USB H500GS Preto HP', img: 'https://www.portalcoletek.com.br/Imagens/HPGAMING_9AJ66AA_01.jpg', price: 'R$ 319,90', sku: 'H500GS-HP'}
        ]);
    }, []);

    return (
        <>
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
            <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            <div className="container d-flex flex-wrap justify-content-center mt-3">
                <div style={{width:'20%'}}>
                    <div className="filtros-bg" style={{borderRadius: '6px', border: '1px solid #c1c1c1'}}>
                        <div className="filtros">
                            <h4 className='text-left mb-3 title-filtros'>Filtros</h4>
                            <div className="filtro">
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Categorias</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked={category == 'acessorio'} size='small' />} label="Acessórios" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Gamer" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Teclado e Mouse" />
                                            <FormControlLabel control={<Checkbox defaultChecked={category == 'energia'} size='small' />} label="Energia" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Cabos e Adaptadores" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Mobilidade" />
                                            <FormControlLabel control={<Checkbox defaultChecked={category == 'gabinete'} size='small' />} label="Gabinete" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Streaming" />
                                            <FormControlLabel control={<Checkbox defaultChecked={category == 'audio'} size='small' />} label="Audio" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Video" />
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Marcas</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox size='small' />} label="G3tech" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Acer" />
                                            <FormControlLabel control={<Checkbox size='small' />} label="Dell" />
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ArrowDropDownIcon />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <Typography sx={{fontWeight: 'bold'}} component="span">Mais Opções</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormGroup sx={{display: 'flex', justifyContent: 'flex-start'}}>
                                            <FormControlLabel control={<Switch defaultChecked={false} />} labelPlacement="start" label="Frete Grátis" />
                                            <FormControlLabel control={<Switch defaultChecked={offer == 'sim'} />} labelPlacement="start" label="Promoção" />
                                        </FormGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='products' style={{width:'80%'}}>
                    {products.map((produto) => (
                        <div className="product">
                            <div className="wishlist-button">
            
                            </div>
                            <Image
                                src={produto.img}
                                width={200}
                                height={200}
                                alt="Headphone"
                                layout="responsive"
                            />
                            <div className="promo green">
                                Até 20% OFF
                            </div>
                            <div className="promo-rating">
                                <div className="colors">
                                    <div className="color red"></div>
                                    <div className="color black"></div>
                                    <div className="color white"></div>
                                </div>
                                <div className="rating">
                                    4.7
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F6B608">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="title-product">
                                {produto.name}
                            </div>
                            <div className="description">
                                {produto.sku}
                            </div>
                            <div className="price">
                                {produto.price}
                                <div className="discount">
                                    (5% OFF)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{width: '100%', margin: '15px', display: 'flex', justifyContent: 'center'}}>
                    <Pagination count={10}  />
                </div>
            </div>
            <Footer/>
        </>
    )
};
export default ProductsPage;