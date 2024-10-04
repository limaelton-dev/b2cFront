"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import '../../assets/css/produto.css';
import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek.png';
import HeadphoneImg from '../../assets/img/headphone.png';
import Ximg from '../../assets/img/svg/x.svg';
import Vi from '../../assets/img/vi.webp';
import Ae from '../../assets/img/ae.webp';
import Dn from '../../assets/img/dn.webp';
import Mc from '../../assets/img/mc.webp';
import Elo from '../../assets/img/elo.webp';
import Hyper from '../../assets/img/hyper.webp';
import { useEffect, useState } from 'react';
import { getProduto } from '../../services/produto/page';
import Cart from '../../components/cart';
import Header from '../../header';
import { useCart } from '../../context/cart';
import { Alert, Snackbar, Slide } from '@mui/material';

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

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const response = await getProduto(codigo);
                if(response.status === 200 && response.data) {
                    setProduct(response.data);
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
            <section id="content-product">
                <div className="container d-flex flex-wrap">
                    <div className="content-img">
                        <Image
                            src={HeadphoneImg}
                            alt="Headphone"
                            layout="responsive"
                        />
                        <div className="carrousel">
                            <div className="img-carrousel">
                                <Image
                                    src={HeadphoneImg}
                                    alt="Headphone"
                                    layout="responsive"
                                />
                            </div>
                            <div className="img-carrousel">
                                <Image
                                    src={HeadphoneImg}
                                    alt="Headphone"
                                    layout="responsive"
                                />
                            </div>
                            <div className="img-carrousel">
                                <Image
                                    src={HeadphoneImg}
                                    alt="Headphone"
                                    layout="responsive"
                                />
                            </div>
                            <div className="img-carrousel">
                                <Image
                                    src={HeadphoneImg}
                                    alt="Headphone"
                                    layout="responsive"
                                />
                            </div>
                            <div className="img-carrousel">
                                <Image
                                    src={HeadphoneImg}
                                    alt="Headphone"
                                    layout="responsive"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="content-infoprod">
                        <div className="content-title-prod">
                            <h1>{product.pro_descricao}</h1>
                            <div className="rating-infoprod">
                                <div className="label-stars">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                    </svg>
                                    <p className="count-rating">(145)</p>
                                </div>
                                <div className="sku">SKU: {product.pro_codigo}</div>
                            </div>
                            <hr/>
                            <div className="content-price">
                                <span className="price">
                                    R$ 389,90
                                </span>
                                <span className="card-info">
                                    Até 12x no cartão
                                </span>
                            </div>
                            <p className="text-colors">Cores:</p>
                            <div className="colors">
                                <div className="color red"></div>
                                <div className="color black"></div>
                                <div className="color white"></div>
                            </div>
                            <p className="text-options">Opções:</p>
                            <div className="options">
                                <div className="option active">Headphone</div>
                                <div className="option">Headphone + Mouse</div>
                                <div className="option">Headphone + Mouse + Mousepad</div>
                            </div>
                            <button type='button' onClick={handleAddToCart}>Comprar</button>
                            <hr/>
                            <h5>Aceitamos:</h5>
                            <div className="options-card">
                                <div className="option">
                                    <Image
                                        src={Vi}
                                        alt=""
                                        layout="responsive"
                                    />
                                </div>
                                <div className="option">
                                    <Image
                                        src={Ae}
                                        alt=""
                                        layout="responsive"
                                    />
                                </div>
                                <div className="option">
                                    <Image
                                        src={Dn}
                                        alt=""
                                        layout="responsive"
                                    />
                                </div>
                                <div className="option">
                                    <Image
                                        src={Mc}
                                        alt=""
                                        layout="responsive"
                                    />
                                </div>
                                <div className="option">
                                    <Image
                                        src={Elo}
                                        alt=""
                                        layout="responsive"
                                    />
                                </div>
                                <div className="option">
                                    <Image
                                        src={Hyper}
                                        alt="twitter"
                                        layout="responsive"
                                    />
                                </div>
                            </div>
                            <hr/>
                            <h5>Compartilhe:</h5>
                            <div className="compartilhe">
                                <ul className="midias">
                                    <li className="whats">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" /></svg>
                                    </li>
                                    <li className="x">
                                        <Image
                                            src={Ximg}
                                            alt="twitter"
                                            layout="responsive"
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="tabs">
                <div className="container">
                    <div className="content-tabs">
                        <ul>
                            <li className="active">Avaliações</li>
                            <li>Detalhes</li>
                            <li>Produtos Relacionados</li>
                        </ul>
                    </div>
                    <div className="content-showtab">
                        <div className="tab-rating">
                            <div className="rating-left">
                                <h3>Avaliações</h3>
                                <div className="rating">
                                    <span className="rate">4.50</span>
                                    <div className="stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                        <p className="count-rating">(145)</p>
                                    </div>
                                </div>
                                <div className="rating-graph">
                                    <div className="line">
                                        <span>5</span>
                                        <div className="content-progress">
                                            <div style={{width: '80%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>4</span>
                                        <div className="content-progress">
                                            <div style={{width: '0%'}}className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>3</span>
                                        <div className="content-progress">
                                            <div style={{width: '10%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>2</span>
                                        <div className="content-progress">
                                            <div style={{width: '0%'}}className="progress-bar"></div>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <span>1</span>
                                        <div className="content-progress">
                                            <div style={{width: '10%'}} className="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rating-right">
                                <h3>Mídia</h3>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="comments">
                            <div className="comment">
                                <div className="content-comment">
                                    <span>Fernanda Sales</span>
                                    <div className="label-stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                        </p>
                                    </div>
                                </div>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                            <div className="comment">
                                <div className="content-comment">
                                    <span>Alisson Campos</span>
                                    <div className="label-stars">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="M480-644v236l96 74-36-122 90-64H518l-38-124ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                            <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                                        </svg>
                                    </div>
                                    <div className="text">
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                        </p>
                                    </div>
                                </div>
                                <div className="content-midias">
                                    <div className="img-midias">
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                        <div className="midia">
                                            <Image
                                                src={HeadphoneImg}
                                                alt="Headphone"
                                                layout="responsive"
                                            />
                                        </div>
                                    </div>
                                    <div className="more">
                                        <span>
                                            +62
                                        </span>
                                        <a href="">Ver mais</a>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="prod-newest" style={{paddingBottom: '25px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Usuários também visitaram</p>
                    </div>
                    <div className="products prod-listing">
                        <div className="product">
                            <div className="wishlist-button">

                            </div>
                            <Image
                                src={HeadphoneImg}
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
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="description">
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="price">
                                R$ 235,50
                                <div className="discount">
                                    (5% OFF)
                                </div>
                            </div>
                        </div>
                        <div className="product">
                            <div className="wishlist-button">

                            </div>
                            <Image
                                                src={HeadphoneImg}
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
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="description">
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="price">
                                R$ 235,50
                                <div className="discount">
                                    (5% OFF)
                                </div>
                            </div>
                        </div>
                        <div className="product">
                            <div className="wishlist-button">

                            </div>
                            <Image
                                src={HeadphoneImg}
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
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="description">
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="price">
                                R$ 235,50
                                <div className="discount">
                                    (5% OFF)
                                </div>
                            </div>
                        </div>
                        <div className="product">
                            <div className="wishlist-button">

                            </div>
                            <Image
                                                src={HeadphoneImg}
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
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="description">
                                Headphone Coletek 7.1 surround
                            </div>
                            <div className="price">
                                R$ 235,50
                                <div className="discount">
                                    (5% OFF)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
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
            </footer>
        </main>
    </>
  );
};

export default ProductPage;