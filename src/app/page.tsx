"use client"
import React from 'react';
import Image from 'next/image';
import './assets/css/home.css';
import LogoColetek from './assets/img/logo_coletek.png';
import bgNewsletter from './assets/img/background.png';
import Banner1 from './assets/img/132.jpg';
import HeadphoneImg from './assets/img/headphone.png';
import { useEffect, useState, useRef } from 'react';
import Header from './header';
import Footer from './footer';
import Cart from './components/Cart';
import { Carousel } from 'primereact/carousel';
import { Radio, Typography } from '@mui/material';
import { useCart } from './context/CartProvider';
import { useToastSide } from './context/ToastSideProvider';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import ClientOnly from './components/ClientOnly';
import { fetchAllProducts } from './api/products/services/product';
import { Product } from './api/products/types/product';

const getProdutosPage = async (limit: number = 12) => {
    try {
        const resp = await fetchAllProducts(
            { categories: [], brands: [], term: '' }, 
            { offset: 0, limit: limit }
        );
        console.log('Resposta da API:', resp);
        
        // Verificar diferentes estruturas de resposta
        let products = [];
        if (resp.items && Array.isArray(resp.items)) {
            products = resp.items;
        } else if (Array.isArray(resp)) {
            products = resp;
        }
        
        console.log('Produtos encontrados:', products.length);
        return products.slice(0, limit); // Garantir que não exceda o limite
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
};

export default function HomePage() {
    const { addItem } = useCart();
    const { showToast } = useToastSide();
    const [openedCart, setOpenedCart] = useState(false);
    const [prodsNew, setProdsNew] = useState<Product[]>([]);
    const [prodsMaisVend, setProdsMaisVend] = useState<Product[]>([]);
    const [marcas, setMarcas] = useState<any[]>([]);
    const [prodsOfertas, setProdOfertas] = useState<Product[]>([]);
    const [loadingProduct, setLoadingProduct] = useState<number | null>(null);
    

    useEffect(() => {

        const loadProdutos = async () => {
            const products = await getProdutosPage(12);
            console.log('products lidos: ', products);
            
            if (products && products.length > 0) {
                // Dividir os produtos para diferentes seções
                setProdsNew(products.slice(0, 12)); // Lançamentos - primeiros 12
                setProdsMaisVend(products.slice(0, 12)); // Mais vendidos - primeiros 12 (pode ser alterado para uma lógica específica)
                setProdOfertas(products.slice(0, 12)); // Ofertas - primeiros 12 (pode ser alterado para uma lógica específica)
            } else {
                console.warn('Nenhum produto foi carregado');
                setProdsNew([]);
                setProdsMaisVend([]);
                setProdOfertas([]);
            }
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

    const productTemplate = (product: Product) => {
        const handleAddToCart = async () => {
            setLoadingProduct(product.id);
            
            try {
                // Encontrar o primeiro SKU ativo do produto
                const activeSku = product.skus?.find(sku => sku.active) || product.skus?.[0];
                
                if (!activeSku) {
                    showToast('Produto sem SKU disponível.', 'error');
                    setLoadingProduct(null);
                    return;
                }
                
                // Adiciona SKU ID e Product ID ao carrinho
                await addItem(activeSku.id, product.id);
                setTimeout(() => {
                    setLoadingProduct(null);
                    showToast('O produto foi adicionado ao carrinho!', 'success');
                    setOpenedCart(true);
                }, 500);
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
                showToast('Erro ao adicionar produto ao carrinho.', 'error');
                setLoadingProduct(null);
            }
        };

        // Função para obter a imagem do produto
        const getProductImage = (product) => {
            // Nova estrutura: usar a imagem principal ou a primeira imagem
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                const mainImage = product.images.find(img => img.main) || product.images[0];
                if (mainImage) {
                    return mainImage.standardUrl || mainImage.originalImage || mainImage.url;
                }
            }
            
            // Compatibilidade: estrutura antiga
            if (product.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
                return product.imagens[0].url;
            }

            if (product.pro_imagem) {
                return product.pro_imagem;
            }
            
            return HeadphoneImg;
        };

        // Função para obter o preço do produto
        const getProductPrice = (product) => {
            // Nova estrutura: usar o preço do primeiro SKU ativo
            if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
                const activeSku = product.skus.find(sku => sku.active) || product.skus[0];
                if (activeSku && activeSku.price && !isNaN(Number(activeSku.price))) {
                    return `R$ ${Number(activeSku.price).toFixed(2).replace('.', ',')}`;
                }
            }
            
            // Compatibilidade: usar campos antigos
            if (product.pro_precovenda && !isNaN(Number(product.pro_precovenda))) {
                return `R$ ${Number(product.pro_precovenda).toFixed(2).replace('.', ',')}`;
            }
            
            return 'Preço não disponível';
        };

        // Função para obter o nome do produto
        const getProductName = (product) => {
            return product.title || product.name || product.pro_descricao || "Produto";
        };

        return (
            <div className="product">
                <div className="wishlist-button">

                </div>
                <a href={`/produto/${product.slug}`}>
                    <Image
                            src={getProductImage(product)}
                            width={200}
                            height={200}
                            alt={getProductName(product)}
                            unoptimized={true}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                    />
                </a>
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
                <a className='title-link-product' href={`/produto/${product.slug}`}>
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
                        {getProductName(product)}
                    </Typography>
                </a>
                <div className="description">
                    {product.model || product.description || ''}
                </div>
                <div className="price">
                    {getProductPrice(product)}
                    <div className="discount">
                        (5% OFF)
                    </div>
                </div>
                <div className='addToCartBox d-flex justify-content-center'>
                    <button 
                        type='button' 
                        className='addToCartButton'
                        onClick={handleAddToCart}
                        disabled={loadingProduct === product.id}
                    >
                        {loadingProduct === product.id ? 'Adicionando...' : 'Adicionar ao carrinho'}
                    </button>
                </div>
            </div>
        )
    }

    const templateMarca = (marca: any) => {
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
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>
            <main>
                <section id="banner">
                    <Image
                        src={Banner1}
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
                {/* <section id="promo">
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
                </section> */}
                <section id="prod-newest">
                    <div className="container">
                        <div className="title-section">
                            <p>Lançamentos</p>
                        </div>
                        <div className="products prod-listing">
                            <Carousel value={prodsNew} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions} circular />
                            
                        </div>
                    </div>
                </section>
                <section id="marcas">
                    <div className="container">
                        <div className="title-section">
                            <p>Nossas marcas</p>
                        </div>
                        <div className="content-marcas">
                            <Carousel value={marcas} numVisible={5} numScroll={1} itemTemplate={templateMarca} circular />
                        </div>
                    </div>
                </section>
                <section id="prod-trending">
                    <div className="container">
                        <div className="title-section">
                            <p>Mais vendidos</p>
                        </div>
                        <div className="products prod-listing">
                            <Carousel value={prodsMaisVend} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions} circular />
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                                        width={200}
                                        height={200}
                                        unoptimized={true}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
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
                <section id="newsletter" style={{backgroundImage: "url('"+bgNewsletter.src+"')", backgroundSize: '100% 400%'}}>
                    <div className="container d-flex">
                        <div className="col-lg-5 d-flex align-items-start flex-direction-column justify-content-center" style={{height: '250px'}}>
                            <h3 style={{color: 'white'}}>Fique por dentro de todas as nossas ofertas e novidades</h3>
                            <h6 style={{color: 'white'}}><b>Cadastre seu email</b> para receber todas as atualizações.</h6>
                        </div>
                        <div className="col-lg-7 d-flex align-items-start flex-direction-column justify-content-center inputs">
                            <div className='inputs-newsletter'>
                                <input type="text" placeholder='Digite seu Nome' />
                                <input type="text" placeholder='Digite seu Email' />
                                <button type='button'>Quero receber as novidades</button>
                            </div>
                            <div style={{marginTop: '15px', color: 'white'}}>
                                <Checkbox sx={{'& .MuiCheckbox-label': {zIndex: '55'}, color: 'white'}} label={<>Estou ciente das condições de tratamento dos meus dados pessoais e forneço meu conscentimento conforme descrito na <b>Política de Privacidade</b>. Você pode cancelar a inscrição a qualquer momento por meio do link nos email de nossa comunicação.</>}/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}
