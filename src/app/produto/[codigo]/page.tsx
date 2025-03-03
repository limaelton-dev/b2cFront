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
import { getProdsLimit, getProduto } from '../../services/produto/page';
import Cart from '../../components/cart';
import Header from '../../header';
import { useCart } from '../../context/cart';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography } from '@mui/material';
import { useToastSide } from '../../context/toastSide';
import ScrollTopButton from '../../components/scrollTopButton';
import useScrollToDiv from '../../components/useScrollToDiv';
import Footer from '../../footer';
import { Carousel } from 'primereact/carousel';

const getProdutosPage = async (limit: number) => {
    try {
        const resp = await getProdsLimit(limit);
        const prodFormatted = resp.data.map((produto: any) => ({
            id: produto.id,
            pro_codigo: produto.pro_codigo,
            pro_descricao: produto.pro_descricao,
            pro_desc_tecnica: produto.pro_desc_tecnica,
            pro_precovenda: produto.pro_precovenda,
            pro_valorultimacompra: produto.pro_valorultimacompra,
            imagens: produto.imagens,
            name: produto.pro_desc_tecnica,
            img: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0].url : "",
            price: produto.pro_precovenda ? `R$ ${produto.pro_precovenda.toFixed(2).replace('.', ',')}` : 'Preço indisponível',
            sku: produto.pro_partnum_sku,
        }));
        return prodFormatted;
    } catch (error) {
        console.error('Erro: ', error);
        return [];
    }
};

const ProductPage = () => {
    const offsetTop = useState(0);
    const scrollTo = useScrollToDiv();
    const { showToast } = useToastSide();
    const { addToCart, cartItems } = useCart();
    const [loadBtn, setLoadBtn] = useState(false);
    const [isPromoProd, setIsPromoProd] = useState(false);
    const [selectedImg, setSelectedImg] = useState('');
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const [loadingProduct, setLoadingProduct] = useState<number | null>(null);
    const [prodsRelation, setProdsRelation] = useState<object[]>([]);
    const { codigo } = useParams();
    const [product, setProduct] = useState({
        id: 54862,
        pro_descricao: 'DISCO FLAP 4 1/2" GRÃO 400',
        pro_precovenda: 139.90,
        pro_modelo_com: '',
        pro_apresentacao: '',
        pro_referencia: '',
        pro_desc_tecnica: '',
        pro_codigobarra: '',
        pro_prazogarantia: '',
        pro_conteudo_emb: '',
        cores: [],
        imagens: [],
        fabricante: {
            id: 1,
            fab_codigo: 1,
            fab_descricao: '',
        }
    });
    const [openedCart, setOpenedCart] = useState(false);

    useEffect(() => {

        const loadProdutos = async () => {
            const products = await getProdutosPage(8);
            setProdsRelation(products)
        };
      
        loadProdutos();
        
    }, []);

    const responsiveOptions = [
        { breakpoint: "1400px", numVisible: 4, numScroll: 2 },
        { breakpoint: "1199px", numVisible: 3, numScroll: 2 },
        { breakpoint: "991px", numVisible: 2, numScroll: 2 },
        { breakpoint: "767px", numVisible: 1, numScroll: 1 },
        { breakpoint: "575px", numVisible: 1, numScroll: 1 }  
    ];

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
                    setSelectedImg(response.data[0].imagens[0].url)
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

    const productTemplate = (product) => {
        const handleAddToCart = async () => {
            setLoadingProduct(product.id);
            if(!addToCart(product, null)) {
                showToast('O produto já existe no carrinho!', 'error');
                setLoadingProduct(null);
            } else {
                setTimeout(() => {
                    setLoadingProduct(null);
                    showToast('O produto foi adicionado ao carrinho!', 'success');
                    setOpenedCart(true);
                }, 500);
            }
        };

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

    function formatStr(str) {
        return str
            .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Remove os caracteres de acentuação
            .replace(/[^a-zA-Z0-9 ]/g, ''); // Remove caracteres especiais, mantendo apenas letras, números e espaços
    }

    const changePicture = (id) => {
        setSelectedImg(product.imagens.find((imagem) => imagem.id === id).url)
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
                            <span className='sku'>{product.pro_modelo_com}</span>
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
                                        <span>R$ {Number(product.pro_precovenda).toFixed(2).replace('.',',')}</span>
                                            :
                                        <>
                                            <span>De <b style={{textDecoration: 'line-through'}}>R$ {Number(product.pro_precovenda).toFixed(2).replace('.',',')}</b></span>
                                            <span>Por <b>R$ {Number((product.pro_precovenda - 5)).toFixed(2).replace('.',',')}</b></span>
                                        </>
                                    }
                                </span>
                                <span>Em até 12x de <b>R$ {Number(product.pro_precovenda).toFixed(2).replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {Number((product.pro_precovenda - 5)).toFixed(2).replace('.',',')}</span> no pagamento pix</span>
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
                        <div className="img-carrousel">
                            <Image
                                src={selectedImg}
                                alt="Headphone"
                                layout="responsive"
                                width={400}
                                height={400}
                            />
                        </div>
                        <div className="carrousel mt-4">
                            {product.imagens.map((p) => (
                                <div className="img-carrousel">
                                    <Image
                                        key={p.id}
                                        src={p.url}
                                        alt="Headphone"
                                        layout="responsive"
                                        width={150}
                                        height={150}

                                        onClick={() => changePicture(p.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="content-infoprod">
                        <div className="content-title-prod">
                            <h1>{product.pro_descricao}</h1>
                            <div className="rating-infoprod">
                                <div className="sku">SKU: {product.pro_modelo_com}</div>
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
                                <p>{product.pro_apresentacao}</p>
                            </div>
                            {/* <div className='d-flex flex-direction-column align-items-center'>
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
                            </div> */}
                            <hr />
                            <div className="content-price d-flex flex-direction-column align-items-center">
                                <span className="price text-center">
                                    R$ {Number(product.pro_precovenda).toFixed(2).replace('.',',')}
                                </span>
                                <span className="card-info">
                                    Até 12x no cartão
                                </span>
                                <span>Em até 12x de <b>R$ {Number(product.pro_precovenda).toFixed(2).replace('.',',')}</b></span>
                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {Number((product.pro_precovenda - 5)).toFixed(2).replace('.',',')}</span> no pagamento pix</span>
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
                        <Carousel value={prodsRelation} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions}/>
                    </div>
                </div>
            </section>
            {/* <section id="banner_prod">
                <div className="container">
                    <Image
                        height={500}
                        src={BannerProd}
                        alt="Banner"
                        layout="responsive"
                    />
                </div>
            </section> */}
            <section id='especificacoes' style={{margin: '25px 0px'}}>
                <div className="container">
                    <div className="title-section">
                        <p>Especificações</p>
                    </div>
                    <div className="txt-espec-prods">
                        <p><strong>Referência:</strong> {product.pro_referencia}</p>
                        <p><strong>Descrição Técnica:</strong> {product.pro_desc_tecnica}</p>
                        <p><strong>Modelo Comercial:</strong> {product.pro_modelo_com}</p>
                        <p><strong>Marca:</strong> {product.fabricante.fab_descricao}</p>
                        <p><strong>Apresentação:</strong> {product.pro_apresentacao}</p>
                        {/* <p><strong>Tipo Giro:</strong> {product.pro_descricao}</p> */}
                        <p><strong>DUN14:</strong> {product.pro_codigobarra}</p>
                        <p><strong>Prazo de Garantia:</strong> {product.pro_prazogarantia}</p>
                        <p><strong>Conteúdo Embalagem:</strong> {product.pro_conteudo_emb}</p>
                    </div>
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