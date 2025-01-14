"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import '../../assets/css/produto.css';
import Image from 'next/image';
import LogoColetek from '../../assets/img/logo_coletek.png';
import HeadphoneImg from '../../assets/img/headphone.png';
import BannerProd from '../../assets/img/banner_mouse.png';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEffect, useState } from 'react';
import { getProduto } from '../../services/produto/page';
import Cart from '../../components/cart';
import Header from '../../header';
import { useCart } from '../../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress } from '@mui/material';
import { useToastSide } from '../../context/toastSide';
import ScrollTopButton from '../../components/scrollTopButton';
import useScrollToDiv from '../../components/useScrollToDiv';
import Footer from '../../footer';

const ProductPage = () => {
    const offsetTop = useState(0);
    const scrollTo = useScrollToDiv();
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [loadBtn, setLoadBtn] = useState(false);
    const [isPromoProd, setIsPromoProd] = useState(false);
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const { codigo } = useParams();
    const [product, setProduct] = useState({
        pro_codigo: 54862,
        pro_descricao: 'DISCO FLAP 4 1/2" GRÃO 400',
        pro_valorultimacompra: 139.90,
        cores: []
    });
    const [openedCart, setOpenedCart] = useState(false);

    useEffect(() => {
        const header = document.getElementById("header-page");
        const sticky = header.offsetTop;

        const myFunction = (e) => {
            if (window.scrollY > 600) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        }
        window.addEventListener('scroll', myFunction);
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

    function formatStr(str) {
        return str
            .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remove os caracteres de acentuação
            .replace(/[^a-zA-Z0-9 ]/g, ''); // Remove caracteres especiais, mantendo apenas letras, números e espaços
    }

    return (
    <>
        <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
        <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
        <ScrollTopButton/>
        <main>
            <section id="content-product">
                <div className="banner-product">
                    <div className="container d-flex">
                        <div className="col-lg-6 d-flex flex-column">
                            <h2>{product.pro_descricao}</h2>
                            <span className='sku'>{product.pro_codigo}</span>
                            <div className="nav-product">
                                <div className="button-nav" onClick={() => scrollTo('caracteristicas')}><b>Características</b></div>
                                <div className="button-nav" onClick={() => scrollTo('especificacoes')}><b>Especificações Técnicas</b></div>
                                <div className="button-nav" onClick={() => scrollTo('tabs')}><b>Avaliações</b></div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex" style={{paddingLeft: '80px'}}>
                            <div className="price-info-head col-lg-6">
                                <span className='price'>
                                    {isPromoProd ? 
                                        <span>R$ {Number(product.pro_valorultimacompra).toFixed(2).replace('.',',')}</span>
                                            :
                                        <>
                                            <span>De <b style={{textDecoration: 'line-through'}}>R$ {Number(product.pro_valorultimacompra).toFixed(2).replace('.',',')}</b></span>
                                            <span>Por <b>R$ {Number((product.pro_valorultimacompra - 5)).toFixed(2).replace('.',',')}</b></span>
                                        </>
                                    }
                                </span>
                                <span>Em até 12x de <b>R$ {Number(product.pro_valorultimacompra).toFixed(2).replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {Number((product.pro_valorultimacompra - 5)).toFixed(2).replace('.',',')}</span> no pagamento pix</span>
                            </div>
                            <div className="button-buy col-lg-6 d-flex align-items-center justify-content-center">
                                <button type='button'
                                    onClick={handleAddToCart}
                                    className='btn-buy-primary'
                                >
                                    {loadBtn ? 
                                        <CircularProgress color="inherit" />
                                        :
                                        'Comprar'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container d-flex flex-wrap">
                    <div className="content-img">
                        <Image
                            src={HeadphoneImg}
                            alt="Headphone"
                            layout="responsive"
                        />
                        <div className="carrousel mt-4">
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
                                <div className="sku">SKU: {product.pro_codigo}</div>
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
                            </div>
                            <hr/>
                            <div className="content-product-info">
                                <p>O famoso headset Voicer Comfort da C3TECH agora com conexão USB. Com som limpo e claro, use em call centers, aulas ou residência.
                                    O controle de volume integrado ao cabo, haste do microfone flexível, almofadas e arco revestidos de espuma tornam o uso fácil,
                                     além de proporcionar um conforto inexplicável, 
                                     ideal para te acompanhar em todas as chamadas.</p>
                            </div>
                            <div className='d-flex flex-direction-column align-items-center'>
                                <p className="text-colors">Cores:</p>
                                <div className="colors">
                                    {product.cores.map((item) => (
                                        <div 
                                            onClick={() => setIsActiveColorId(item.id)}
                                            className={'color ' + (isActiveColorId == item.id ? ' active' : '')}
                                            style={{backgroundColor: item.hex}}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className="content-price d-flex flex-direction-column align-items-center">
                                <span className="price text-center">
                                    R$ {Number(product.pro_valorultimacompra).toFixed(2).replace('.',',')}
                                </span>
                                <span className="card-info">
                                    Até 12x no cartão
                                </span>
                                <span>Em até 12x de <b>R$ {Number(product.pro_valorultimacompra).toFixed(2).replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {Number((product.pro_valorultimacompra - 5)).toFixed(2).replace('.',',')}</span> no pagamento pix</span>
                                <button type='button'
                                    onClick={handleAddToCart}
                                    className='btn-buy-primary mt-3'
                                >
                                    {loadBtn ? 
                                        <CircularProgress color="inherit" />
                                        :
                                        'Comprar'
                                    }
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
            <section id="recomend" style={{paddingBottom: '25px', marginTop: '25px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Recomendado para você</p>
                    </div>
                    <div className="products prod-listing" style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
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
            <section id="banner_prod">
                <div className="container">
                    <Image
                        height={500}
                        src={BannerProd}
                        alt="Banner"
                        layout="responsive"
                    />
                </div>
            </section>
            <section id='especificacoes' style={{margin: '25px 0px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Especificações</p>
                    </div>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
                    Sed feugiat neque lacinia tellus elementum, et fringilla orci posuere.<br/>
                    Nulla viverra risus id facilisis varius.<br/>

                    Nunc at mauris sed lectus euismod efficitur in blandit dolor.<br/>
                    Sed cursus velit porttitor vehicula egestas.<br/>
                    Mauris vel tortor at arcu interdum vehicula eget vel diam.<br/>
                    Praesent sodales urna vitae faucibus vulputate.<br/>
                    Mauris gravida diam sit amet magna porta, vel rutrum velit scelerisque.<br/>
                    Integer euismod dolor quis ligula accumsan pretium.<br/>

                    Maecenas ultricies lectus eget egestas sollicitudin.<br/>
                    Phasellus at turpis ut sem ullamcorper fringilla in sed orci.<br/>
                    Aliquam a dolor eget eros ultrices facilisis.<br/>
                    Donec eu tortor eu urna lobortis tincidunt a quis arcu.<br/>
                    Morbi vulputate enim eu euismod mollis.<br/>
                    Aenean pretium ex sit amet massa cursus, suscipit scelerisque ligula posuere.<br/>

                    Donec volutpat lacus eu purus lobortis, nec semper urna lobortis.<br/>
                    Integer sed sapien molestie, elementum justo quis, lacinia odio.<br/>
                    Pellentesque eu nibh efficitur, posuere sapien sit amet, consequat sem.<br/>
                    Proin non orci sit amet sem fringilla commodo vitae aliquet nisi.<br/>
                    Etiam sed felis ut odio porttitor sagittis in ac lacus.<br/>
                    Nulla eu nisl blandit, bibendum enim vel, auctor felis.<br/>

                    Nulla egestas nisl bibendum eros gravida congue.<br/>
                    Mauris commodo felis sit amet sem consequat, non commodo nulla volutpat.<br/>
                    Duis at nisl in arcu accumsan bibendum.<br/>
                    In quis quam nec felis hendrerit pretium vitae sed urna.<br/>
                    Vestibulum semper sem at nisl euismod, interdum tristique sem fringilla.<br/>
                    </p>
                </div>
            </section>
            <section id="tabs">
                <div className="container">
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
            <Footer/>
        </main>
    </>
  );
};

export default ProductPage;