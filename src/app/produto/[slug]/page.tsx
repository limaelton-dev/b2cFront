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
import Cart from '../../components/Cart';
import ClientOnly from '../../components/ClientOnly';
import Header from '../../header';
import { useCart } from '../../context/CartProvider';
import { Alert, Snackbar, Slide, Button, CircularProgress, Typography, TextField, Checkbox, Breadcrumbs, Link } from '@mui/material';
import { useToastSide } from '../../context/ToastSideProvider';
import Footer from '../../footer';
import { Carousel } from 'primereact/carousel';
import ReactInputMask from 'react-input-mask';
import axios from 'axios';
import { valorFreteDeslogado } from '../../api/checkout/services/checkout';
import HomeIcon from '@mui/icons-material/Home';
import { Product } from '../../api/products/types/product';
import { fetchAllProducts, fetchProductBySlug } from '../../api/products/services/product';

const ProductPage = () => {
    const { showToast } = useToastSide();
    const { addItem } = useCart();

    // Função auxiliar para obter o preço do primeiro SKU disponível
    const getFirstSkuPrice = (product?: Product): number | null => {
        if (!product?.skus || product.skus.length === 0) return null;
        const firstSku = product.skus[0];
        return firstSku?.price || firstSku?.sellPrice || null;
    };

    // Função auxiliar para formatar preço
    const formatPrice = (price: number | null): string => {
        if (price === null || price === undefined) return 'Preço não disponível';
        return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
    };
    const [loadBtn, setLoadBtn] = useState(false);
    const [isPromoProd, setIsPromoProd] = useState(false);
    const [selectedImg, setSelectedImg] = useState('');
    const [cep, setCep] = useState('');
    const [isActiveColorId, setIsActiveColorId] = useState(null)
    const [loadingProduct, setLoadingProduct] = useState<number | null>(null);
    const [product, setProduct] = useState<Product>();
    const [prodsRelation, setProdsRelation] = useState<Product[]>([])
    const [loadingCep, setLoadingCep] = useState(false);
    const { slug } = useParams();
    const [freteNome, setFreteNome] = useState('');
    const [fretePreco, setFretePreco] = useState(0);
    const [prazo, setPrazo] = useState(0);
    const [freteError, setFreteError] = useState('');
    const [loading, setLoading] = useState(true);
    const [openedCart, setOpenedCart] = useState(false);
    console.log('slug', slug);
    const loadProduct = async () => {
        try {
            const dataProduct = await fetchProductBySlug(slug as string);
            setProduct(dataProduct);
            if (dataProduct?.images?.length > 0) {
                const mainImage = dataProduct.images.find((image) => image.main === true);
                setSelectedImg(mainImage?.url || dataProduct.images[0]?.url || '');
            }
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedProducts = async () => {
        try {
            const dataRelatedProducts = await fetchAllProducts({ categories: [], brands: [], term: '' }, { offset: 0, limit: 12 });
            setProdsRelation(dataRelatedProducts.items);
            console.log('produtos relacionados:', dataRelatedProducts.items);
            console.log('produtos relacionados2:', prodsRelation);
        } catch (error) {
            console.error('Erro ao buscar produtos relacionados:', error);
        }
    }
    
    useEffect(() => {
        loadProduct();
        loadRelatedProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const responsiveOptions = [
        { breakpoint: "1400px", numVisible: 4, numScroll: 2 },
        { breakpoint: "1199px", numVisible: 3, numScroll: 2 },
        { breakpoint: "991px", numVisible: 2, numScroll: 2 },
        { breakpoint: "767px", numVisible: 1, numScroll: 1 },
        { breakpoint: "575px", numVisible: 1, numScroll: 1 }  
    ];

    const productDescription = (description) => {
        return (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        );
    }

    const handleAddToCart = async () => {
        setLoadBtn(true);
        
        try {
            if (!product) {
                showToast('Produto não carregado.', 'error');
                setLoadBtn(false);
                return;
            }
            
            // Encontrar o primeiro SKU ativo do produto
            const activeSku = product.skus?.find(sku => sku.active) || product.skus?.[0];
            
            if (!activeSku) {
                showToast('Produto sem SKU disponível.', 'error');
                setLoadBtn(false);
                return;
            }
            
            await addItem(activeSku.id);
            setTimeout(() => {
                setLoadBtn(false);
                showToast('O produto foi adicionado ao carrinho!', 'success');
                setOpenedCart(true);
            }, 500);
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            showToast('Erro ao adicionar produto ao carrinho.', 'error');
            setLoadBtn(false);
        }
    }

    const productTemplate = (product) => {
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
                
                await addItem(activeSku.id);
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

        return (
            <div className="product">
                <div className="wishlist-button">

                </div>
                <a href={`/produto/${product.slug}`}>
                    <Image
                            src={product?.images && product.images.length > 0 ? 
                                (product.images[0].url || product.images[0].standardUrl || product.images[0].originalImage) : 
                                HeadphoneImg.src}
                            width={200}
                            height={200}
                            alt="Produto"
                            layout="responsive"
                            unoptimized={true}
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
                        {product.title}
                    </Typography>
                </a>
                <div className="description">
                    {productDescription(product.model)}
                </div>
                <div className="price">
                    {formatPrice(getFirstSkuPrice(product))}
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

    const changePicture = (id) => {
        if (product?.images && product.images.length > 0) {
            const foundImage = product.images.find((image) => image.id === id);
            if (foundImage) {
                setSelectedImg(foundImage.url || foundImage.standardUrl || foundImage.originalImage || '');
            }
        }
    }

    const buscarEndereco = async (cep: string) => {
        if (cep.length === 9) {
            setLoadingCep(true);
            setFreteError('');
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                setTimeout(async () => {
                    if (data.erro) {
                        setFreteError('CEP não encontrado!');
                        setLoadingCep(false);
                    } else {
                        try {
                            // Verificar se o ID do produto está disponível
                            const produtoId = product.id;
                            
                            if (!produtoId) {
                                setFreteError('Produto não identificado');
                                setLoadingCep(false);
                                return;
                            }
                            
                            // Usar apenas o produto atual para cálculo de frete
                            const dadosProdutos = [{
                                produto_id: produtoId,
                                quantity: 1
                            }];
                            
                            const frete = await valorFreteDeslogado(cep, dadosProdutos);
                            
                            if (frete && frete.data && frete.data.data) {
                                setFreteNome('PAC');
                                setFretePreco(frete.data.data.totalPreco || 0);
                                setPrazo(frete.data.data.maiorPrazo || 0);
                            } else {
                                console.error('Resposta inválida da API de frete:', frete);
                                setFreteError('Não foi possível calcular o frete para este produto.');
                                // Limpa os dados de frete anteriores
                                setFreteNome('');
                                setFretePreco(0);
                                setPrazo(0);
                            }
                        } catch (freteError) {
                            console.error('Erro ao calcular frete:', freteError);
                            setFreteError('Erro ao calcular o frete. Tente novamente.');
                            // Limpa os dados de frete anteriores
                            setFreteNome('');
                            setFretePreco(0);
                            setPrazo(0);
                        }
                    }
                    setLoadingCep(false);
                }, 800);
            } catch (error) {
                console.error('Erro ao buscar o endereço:', error);
                setFreteError('Erro ao buscar o endereço.');
                setLoadingCep(false);
            }
        }
    };

    const handleChangeCep = (e) => {
        const newCep = e.target.value;
        setCep(newCep);
    }
    
    const calcularFrete = () => {
        if (cep && cep.length === 9) {
            buscarEndereco(cep);
        } else {
            setFreteError('Digite um CEP válido');
        }
    }
    const stringTester = 'teste';

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>
            {/* TODO:TRATAR ERRO DE CARREGAMENTO DA API */}
            {loading ? (
                <main>
                    <p>Carregando...</p>
                </main>
            ) : !product ? (
                <main>
                    <p>Produto não encontrado.</p>
                </main>
            ) : (
                <main>
                <section id="content-product">
                    <div className="container">
                        <div className="w-100 mb-3">
                            {/* <Breadcrumbs aria-label="breadcrumb">
                                <Link
                                    underline="hover"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                    color="inherit"
                                    href="/"
                                >
                                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                    Home
                                </Link>
                                <Typography
                                    sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                                >
                                    {product.categoryLevel1.name}
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                                >
                                    {product.categoryLevel2.name}
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                                >
                                    {product.title}
                                </Typography>
                            </Breadcrumbs> */}
                        </div>
                    </div>
                    <div className="banner-product">
                        <div className="container d-flex">
                            <div className="col-lg-6 d-flex flex-column">
                                <h2>{product.title}</h2>
                                <span className='sku'>{product.model}</span>
                                <div className="nav-product">
                                    <div className="button-nav" onClick={() => {}}><b>Características</b></div>
                                    <div className="button-nav" onClick={() => {}}><b>Especificações Técnicas</b></div>
                                    <div className="button-nav" onClick={() => {}}><b>Avaliações</b></div>
                                </div>
                            </div>
                            <div className="col-lg-6 d-flex" style={{paddingLeft: '80px'}}>
                                <div className="price-info-head col-lg-6">
                                    <span className='price'>
                                        {(() => {
                                            const price = getFirstSkuPrice(product);
                                            if (price === null) {
                                                return <span>Preço não disponível</span>;
                                            }
                                            
                                            if (isPromoProd) {
                                                return <span>{formatPrice(price)}</span>;
                                            } else {
                                                return (
                                                    <>
                                                        <span>De <b style={{textDecoration: 'line-through'}}>{formatPrice(price)}</b></span>
                                                        <span>Por <b>{formatPrice(price)}</b></span>
                                                    </>
                                                );
                                            }
                                        })()}
                                    </span>
                                    {(() => {
                                        const price = getFirstSkuPrice(product);
                                        if (price === null) return null;
                                        
                                        return (
                                            <>
                                                <span>Em até 12x de <b>R$ {(price / 12).toFixed(2).replace('.',',')}</b></span>
                                                <span>ou <span style={{textDecoration: 'underline'}}>{formatPrice(price)}</span> no pagamento pix</span>
                                            </>
                                        );
                                    })()}
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
                                    width={400}
                                    height={400}
                                    unoptimized={true}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <div className="carrousel mt-4">
                                {product?.images && product.images.length > 0 ? product.images.map((p) => (
                                    <div className="img-carrousel" key={p.id}>
                                        <Image
                                            src={p.url || p.standardUrl || p.originalImage}
                                            alt="Produto"
                                            width={150}
                                            height={150}
                                            unoptimized={true}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'contain'
                                            }}
                                            onClick={() => changePicture(p.id)}
                                        />
                                    </div>
                                )) : (
                                    <div className="img-carrousel">
                                        <Image
                                            src={HeadphoneImg}
                                            alt="Produto"
                                            width={150}
                                            height={150}
                                            unoptimized={true}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="content-infoprod">
                            <div className="content-title-prod">
                                {/* <h1>{product.description}</h1> */}
                                <div className="rating-infoprod">
                                    <div className="sku">Modelo: {product.model}</div>
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
                                    {productDescription(product.description)}
                                </div>
                                <hr />
                                <div className="content-price d-flex flex-direction-column align-items-center">
                                    <h6>Calcule o Frete:</h6>
                                    <div className="frete" style={{marginBottom: '15px'}}>
                                        <div className={'d-flex flex-column justify-content-center align-items-center'} style={{marginTop: '20px', marginBottom: '8px'}}>
                                        <ReactInputMask
                                            mask="99999-999"
                                            value={cep}
                                            onChange={handleChangeCep}
                                            maskChar=""
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                {...inputProps}
                                                label="Digite o CEP"
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInputBase-input::placeholder': {
                                                        fontSize: '23px', 
                                                        fontWeight: 'bold',
                                                    },width: '120px',  marginBottom: '8px'
                                                }}
                                                />
                                            )}
                                        </ReactInputMask>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            size="small" 
                                            onClick={calcularFrete}
                                            disabled={loadingCep}
                                            style={{marginTop: '5px', fontSize: '12px', textTransform: 'none'}}
                                        >
                                            Calcular
                                        </Button>
                                        </div>
                                        {loadingCep && (
                                            <div className="text-center">
                                                <CircularProgress size={20} color="primary" />
                                                <span className="ml-2">Calculando frete...</span>
                                            </div>
                                        )}
                                        {freteError && (
                                            <div className="text-center text-danger">
                                                <small>{freteError}</small>
                                            </div>
                                        )}
                                        {freteNome && 
                                            <>
                                                <div className="frete-box">
                                                    <div className="frete">
                                                        <div className='text-frete'>
                                                            <span>{freteNome} {'(até '+prazo+' dias úteis)'} </span>
                                                            <span className="price">
                                                                R$ {(fretePreco || 0).toFixed(2).replace('.',',')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    {(() => {
                                        const price = getFirstSkuPrice(product);
                                        if (price === null) {
                                            return (
                                                <span className="price text-center">
                                                    Preço não disponível
                                                </span>
                                            );
                                        }
                                        
                                        return (
                                            <>
                                                <span className="price text-center">
                                                    {formatPrice(price)}
                                                </span>
                                                <span className="card-info">
                                                    Até 12x no cartão
                                                </span>
                                                <span>Em até 12x de <b>R$ {(price / 12).toFixed(2).replace('.',',')}</b></span>
                                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {(price - 5).toFixed(2).replace('.',',')}</span> no pagamento pix</span>
                                            </>
                                        );
                                    })()}
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
                            <Carousel value={prodsRelation} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions} circular/>
                        </div>
                    </div>
                </section>
                <section id='especificacoes' style={{margin: '25px 0px'}}>
                    <div className="container">
                        <div className="title-section">
                            <p>Especificações</p>
                        </div>
                        <div className="txt-espec-prods">
                            <p><strong>Referência:</strong>{stringTester}</p>
                            <p><strong>Descrição Técnica:</strong> {stringTester}</p>
                            <p><strong>Modelo Comercial:</strong> {stringTester}</p>
                            <p><strong>Marca:</strong> {product.brand.name}</p>
                            <p><strong>DUN14:</strong> {stringTester}</p>
                            <p><strong>Prazo de Garantia:</strong> {product.warrantyTime} {product.warrantyText ? `(${product.warrantyText})` : ''}</p>
                            <p><strong>Conteúdo Embalagem:</strong> {stringTester}</p>
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
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
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
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                            </p>
                                        </div>
                                    </div>
                                    <div className="content-midias">
                                        <div className="img-midias">
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
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
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                                            </p>
                                        </div>
                                    </div>
                                    <div className="content-midias">
                                        <div className="img-midias">
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                            <div className="midia">
                                                <Image
                                                    src={HeadphoneImg}
                                                    alt="Headphone"
                                                    unoptimized={true}
                                                    width={100}
                                                    height={100}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        objectFit: 'contain'
                                                    }}
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
            )}
        </>
  );
};

export default ProductPage;