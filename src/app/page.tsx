"use client"
import React from 'react';
import Image from 'next/image';
import './assets/css/home.css';
import LogoColetek from './assets/img/logo_coletek.png';
import Banner from './assets/img/banner.png';
import HeadphoneImg from './assets/img/headphone.png';
import { useEffect, useState, useRef } from 'react';
import Header from './header';
import Footer from './footer';
import Cart from './components/cart';
import { Carousel } from 'primereact/carousel';
import { Typography } from '@mui/material';
import { getProdsLimit } from './services/produto/page';

const getProdutosPage = async (limit: number) => {
    try {
        const resp = await getProdsLimit(limit);
        const prodFormatted = resp.data.map((produto: any) => ({
            id: produto.id,
            name: produto.pro_desc_tecnica,
            img: produto.imagens.length > 0 ? produto.imagens[0].url : "",
            price: 'R$ 254,90',
            sku: produto.pro_partnum_sku,
        }));
        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
    }
};

export default function HomePage() {
    const [openedCart, setOpenedCart] = useState(false);
    const [prodsNew, setProdsNew] = useState<object[]>([]);
    const [prodsMaisVend, setProdsMaisVend] = useState<object[]>([]);
    const [marcas, setMarcas] = useState<object[]>([]);
    const [prodsOfertas, setProdOfertas] = useState<object[]>([]);
    

    useEffect(() => {

        const loadProdutos = async () => {
            const products = await getProdutosPage(8);
            setProdsNew(products);
            setProdsMaisVend(products);
            setProdOfertas(products)
          };
      
        loadProdutos();

        setMarcas([
            {link: "", img: LogoColetek},
            {link: "", img: LogoColetek},
            {link: "", img: LogoColetek},
            {link: "", img: LogoColetek},
            {link: "", img: LogoColetek},
            {link: "", img: LogoColetek}
        ]);
        
    }, []);
    
    const responsiveOptions = [
        { breakpoint: "1400px", numVisible: 4, numScroll: 2 },
        { breakpoint: "1199px", numVisible: 3, numScroll: 2 },
        { breakpoint: "991px", numVisible: 2, numScroll: 2 },
        { breakpoint: "767px", numVisible: 1, numScroll: 1 },
        { breakpoint: "575px", numVisible: 1, numScroll: 1 }  
    ];

    const productTemplate = (product) => {
        return (
            <div className="product">
                <div className="wishlist-button">

                </div>
                <Image
                        src={product.img}
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
                <a className='title-link-product' href={`/produto/${product.id}`}>
                    <Typography
                        variant="body1"
                        className='title-product'
                        sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                        }}
                    >
                        {product.name}
                    </Typography>
                </a>
                <div className="description">
                    {product.sku}
                </div>
                <div className="price">
                    {product.price}
                    <div className="discount">
                        (5% OFF)
                    </div>
                </div>
                <div className='addToCartBox d-flex justify-content-center'>
                    <button type='button' className='addToCartButton'>Adicionar ao carrinho</button>
                </div>
            </div>
        )
    }

    const templateMarca = (marca) => {
        return (
            <a href={marca.link} className="link-marca">
                <div className="marca col-lg-2">
                    <Image
                        src={marca.img}
                        alt="Logo Coletek"
                    />
                </div>
            </a>
        )
    }

    return (
        <>
            <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
            <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            <main>
                <section id="banner">
                    <Image
                        src={Banner}
                        alt="Banner"
                    />
                </section>
                <section id="info-cards">
                    <div className="container d-flex">
                        <div className="col-lg-3 col-md-3 col-12 card-info">
                            <div className="content">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm480 0q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120Z"/>
                                </svg>
                                <div className="content-text">
                                    <p>Frete grátis</p>
                                    <p className="description-text">
                                        Veja as condições
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-12 card-info">
                            <div className="content">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z"/>
                                </svg>
                                <div className="content-text">
                                    <p>Compra segura</p>
                                    <p className="description-text">
                                        Sua compra é segura
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-12 card-info">
                            <div className="content">
                                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z" stroke="#292D32"/>
                                    <path d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z" stroke="#292D32"/>
                                    <path d="M5.25 17.8101H6.96997" stroke="#fff"/>
                                    <path d="M9.10986 17.8101H12.5499" stroke="#fff"/>
                                    <path d="M2 12.6101H19" stroke="#fff"/>
                                </svg>
                                <div className="content-text">
                                    <p>Parcele em até 12x</p>
                                    <p className="description-text">
                                        Sem juros no crédito
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-12 card-info">
                            <svg fill="#000000" width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"/>
                                <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"/>
                            </svg>
                            <div className="content-text">
                                <p>Pagamento com Pix liberado</p>
                                <p className="description-text">
                                    Aprovação instantânea
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="promo">
                    <div className="container">
                        <div className="cards">
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                            <div className="card">
                                <div className="title-card">
                                    Example Title
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="prod-newest">
                    <div className="container">
                        <div className="title-section">
                            <p>Lançamentos</p>
                        </div>
                        <div className="products prod-listing">
                            <Carousel value={prodsNew} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions}/>
                            
                        </div>
                    </div>
                </section>
                <section id="marcas">
                    <div className="container">
                        <div className="title-section">
                            <p>Nossas marcas</p>
                        </div>
                        <div className="content-marcas">
                            <Carousel value={marcas} numVisible={5} numScroll={1} itemTemplate={templateMarca}/>
                        </div>
                    </div>
                </section>
                <section id="prod-trending">
                    <div className="container">
                        <div className="title-section">
                            <p>Mais vendidos</p>
                        </div>
                        <div className="products prod-listing">
                            <Carousel value={prodsMaisVend} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions}/>
                        </div>
                    </div>
                </section>
                <section id="colecao-categorias">
                    <div className="container">
                        <div className="title-section">
                            Coleção de produtos por categoria
                        </div>
                        <div className="content-collections">
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo">
            
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo ">
                                
                                </div>
                            </div>
                            <div className="collection">
                                <div className="content-img">
                                    <Image
                                        src={HeadphoneImg}
                                        alt="Headphone"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="title-collection">
                                    Headphone
                                </div>
                                <div className="promo">
            
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="prod-categorias">
                    <div className="container">

                        <div className="content">
                            <div className="promo-banner">
                                <div className="banner"></div>
                            </div>
                            <div className="products">
                                <div className="title-section">
                                    <p>Super Ofertas</p>
                                </div>
                                <Carousel value={prodsOfertas} numVisible={4} numScroll={4} itemTemplate={productTemplate} responsiveOptions={responsiveOptions}/>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="banner-promo">
                    <div className="container">
                        <div className="banner-promo-full">
                                    
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}
