"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button, CircularProgress, Typography, TextField } from '@mui/material';
import { Carousel } from 'primereact/carousel';
import ReactInputMask from 'react-input-mask';

import '@/assets/css/produto.css';
import HeadphoneImg from '@/assets/img/headphone.png';
import Cart from '@/components/Cart';
import ClientOnly from '@/components/ClientOnly';
import Header from '@/app/header';
import Footer from '@/app/footer';

import { useAuth } from '@/context/AuthProvider';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useShipping } from '@/hooks/useShipping';
import { useProductDetails } from './hooks/useProductDetails';

import { Product } from '@/api/products/types/product';
import { fetchAllProducts } from '@/api/products/services/product';
import { formatPrice, getFirstSkuPrice, getSkuPrice } from '@/utils/product';

const ProductPage = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const { addToCartWithSkuId, isProductLoading } = useAddToCart();
    
    const {
        product,
        selectedSkuId,
        selectedImageUrl,
        loading,
        getSelectedSku,
        getFilteredImages,
        changeVariation,
        changeImage
    } = useProductDetails(slug as string);

    const {
        postalCode,
        setPostalCode,
        loadingShipping,
        shippingInfo,
        error: shippingError,
        calculateShippingForSingleProduct
    } = useShipping();

    const [openedCart, setOpenedCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loadingRelatedProduct, setLoadingRelatedProduct] = useState<number | null>(null);

    const getSelectedSkuPrice = () => {
        const selectedSku = getSelectedSku();
        return getSkuPrice(selectedSku);
    };
    useEffect(() => {
        const loadRelatedProducts = async () => {
            try {
                const dataRelatedProducts = await fetchAllProducts(
                    { categories: [], brands: [], term: '' },
                    { offset: 0, limit: 12 }
                );
                setRelatedProducts(dataRelatedProducts.items);
            } catch (error) {
                console.error('Erro ao buscar produtos relacionados:', error);
            }
        };

        loadRelatedProducts();
    }, []);

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
        if (!product || !selectedSkuId) return;

        const success = await addToCartWithSkuId(selectedSkuId, product.id, {
            onSuccess: () => {
                setTimeout(() => {
                    setOpenedCart(true);
                }, 500);
            }
        });
    };

    const productTemplate = (relatedProduct: Product) => {
        const handleRelatedAddToCart = async () => {
            setLoadingRelatedProduct(relatedProduct.id);

            try {
                const activeSku = relatedProduct.skus?.find(sku => sku.active) || relatedProduct.skus?.[0];
                if (!activeSku) return;

                await addToCartWithSkuId(activeSku.id, relatedProduct.id, {
                    onSuccess: () => {
                        setTimeout(() => {
                            setOpenedCart(true);
                        }, 500);
                    }
                });
            } finally {
                setLoadingRelatedProduct(null);
            }
        };

        return (
            <div className="product">
                <div className="wishlist-button"></div>
                <a href={`/produto/${relatedProduct.slug}`}>
                    <Image
                        src={relatedProduct?.images && relatedProduct.images.length > 0 ?
                            (relatedProduct.images[0].url || relatedProduct.images[0].standardUrl || relatedProduct.images[0].originalImage) :
                            HeadphoneImg.src}
                        width={200}
                        height={200}
                        alt="Produto"
                        layout="responsive"
                        unoptimized={true}
                    />
                </a>
                <div className="promo green">Até 20% OFF</div>
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
                <a className='title-link-product' href={`/produto/${relatedProduct.slug}`}>
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
                        {relatedProduct.title}
                    </Typography>
                </a>
                <div className="description">
                    {productDescription(relatedProduct.model)}
                </div>
                <div className="price">
                    {`R$ ${formatPrice(getFirstSkuPrice(relatedProduct) || 0)}`}
                    <div className="discount">(5% OFF)</div>
                </div>
                <div className='addToCartBox d-flex justify-content-center'>
                    <button
                        type='button'
                        className='addToCartButton'
                        onClick={handleRelatedAddToCart}
                        disabled={loadingRelatedProduct === relatedProduct.id}
                    >
                        {loadingRelatedProduct === relatedProduct.id ? 'Adicionando...' : 'Adicionar ao carrinho'}
                    </button>
                </div>
            </div>
        );
    };

    const handleCalculateShipping = async () => {
        const selectedSku = getSelectedSku();
        if (!selectedSku || !postalCode) return;

        await calculateShippingForSingleProduct(
            postalCode,
            selectedSku.id,
            selectedSku.partnerId
        );
    };
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
                                            const price = getSelectedSkuPrice();
                                            if (price === null) {
                                                return <span>Preço não disponível</span>;
                                            }
                                            
                                            return <span>{`R$ ${formatPrice(price)}`}</span>;
                                        })()}
                                    </span>
                                    {(() => {
                                        const selectedSku = getSelectedSku();
                                        const price = getSkuPrice(selectedSku);
                                        if (price === null) return null;
                                        
                                        return (
                                            <>
                                                <span>Em até 12x de <b>R$ {formatPrice(price / 12)}</b></span>
                                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {formatPrice(price)}</span> no pagamento pix</span>
                                            </>
                                        );
                                    })()}
                                </div>
                                <div className="button-buy col-lg-6 d-flex align-items-center justify-content-center">
                                    <button type='button'
                                        onClick={handleAddToCart}
                                        className='btn-buy-primary'
                                    >
                                        {isProductLoading(product?.id || 0) ?
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
                                    src={selectedImageUrl || HeadphoneImg.src}
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
                                {(() => {
                                    const filteredImages = getFilteredImages();
                                    return filteredImages.length > 0 ? filteredImages.map((p) => (
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
                                                onClick={() => changeImage(p.id)}
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
                                    );
                                })()}
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
                                {/* Seletor de Variações */}
                                {product.hasVariations && product.skus && product.skus.length > 1 && (
                                    <div className="variations-selector" style={{ marginBottom: '20px' }}>
                                        {(() => {
                                            // Extrair tipos de variação únicos
                                            const variationTypes = new Map();
                                            product.skus.forEach(sku => {
                                                sku.variations?.forEach(variation => {
                                                    if (!variationTypes.has(variation.type)) {
                                                        variationTypes.set(variation.type, []);
                                                    }
                                                    if (!variationTypes.get(variation.type).some((v: any) => v.description === variation.description)) {
                                                        variationTypes.get(variation.type).push(variation);
                                                    }
                                                });
                                            });

                                            return Array.from(variationTypes.entries()).map(([typeName, variations]: [string, any[]]) => (
                                                <div key={typeName} style={{ marginBottom: '15px' }}>
                                                    <h6 style={{ marginBottom: '10px' }}>{typeName}:</h6>
                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                        {variations.map((variation) => {
                                                            const selectedSku = getSelectedSku();
                                                            const isSelected = selectedSku?.variations?.some(v => v.description === variation.description);
                                                            return (
                                                                <button
                                                                    key={variation.id}
                                                                    onClick={() => changeVariation(variation.description)}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: isSelected ? '#007bff' : 'white',
                                                                        color: isSelected ? 'white' : '#333',
                                                                        cursor: 'pointer',
                                                                        fontWeight: isSelected ? 'bold' : 'normal',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    {variation.description}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
                                <div className="content-price d-flex flex-direction-column align-items-center">
                                    <h6>Calcule o Frete:</h6>
                                    <div className="frete" style={{marginBottom: '15px'}}>
                                        <div className={'d-flex flex-column justify-content-center align-items-center'} style={{marginTop: '20px', marginBottom: '8px'}}>
                                        <ReactInputMask
                                            mask="99999-999"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
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
                                            onClick={handleCalculateShipping}
                                            disabled={loadingShipping}
                                            style={{marginTop: '5px', fontSize: '12px', textTransform: 'none'}}
                                        >
                                            Calcular
                                        </Button>
                                        </div>
                                        {loadingShipping && (
                                            <div className="text-center">
                                                <CircularProgress size={20} color="primary" />
                                                <span className="ml-2">Calculando frete...</span>
                                            </div>
                                        )}
                                        {shippingError && (
                                            <div className="text-center text-danger">
                                                <small>{shippingError}</small>
                                            </div>
                                        )}
                                        {shippingInfo &&
                                            <>
                                                <div className="frete-box">
                                                    <div className="frete">
                                                        <div className='text-frete'>
                                                            <span>{shippingInfo.serviceName} {shippingInfo.deliveryTime ? `(até ${shippingInfo.deliveryTime} dias úteis)` : ''} </span>
                                                            <span className="price">
                                                                R$ {formatPrice(shippingInfo.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    {(() => {
                                        const price = getSelectedSkuPrice();
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
                                                    R$ {formatPrice(price)}
                                                </span>
                                                <span className="card-info">
                                                    Até 12x no cartão
                                                </span>
                                                <span>Em até 12x de <b>R$ {formatPrice(price / 12)}</b></span>
                                                <span>ou <span style={{textDecoration: 'underline'}}>R$ {formatPrice(price * 0.95)}</span> no pagamento pix</span>
                                            </>
                                        );
                                    })()}
                                    <button type='button'
                                        onClick={handleAddToCart}
                                        className='btn-buy-primary mt-3'
                                    >
                                        {isProductLoading(product?.id || 0) ?
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
                            <Carousel value={relatedProducts} numVisible={4} numScroll={2} itemTemplate={productTemplate} responsiveOptions={responsiveOptions} circular/>
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