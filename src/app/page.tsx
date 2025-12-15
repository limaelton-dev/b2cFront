"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '@/assets/css/home.css';
import LogoColetek from '@/assets/img/logo_coletek.png';
import bgNewsletter from '@/assets/img/background.png';
import Banner1 from '@/assets/img/132.jpg';
import Header from './header';
import Footer from './footer';
import Cart from '../components/Cart';
import ClientOnly from '../components/ClientOnly';
import { ProductCard, ProductCardSkeleton, ProductsEmptyState } from '../components/ProductCard';
import { InfoCards, Newsletter } from '../components/Home';
import { useCart } from '../context/CartProvider';
import { useToastSide } from '../context/ToastSideProvider';
import { fetchAllProducts } from '../api/products/services/product';
import { Product } from '../api/products/types/product';
import { getActiveSku } from '@/utils/product';

const THEME_COLOR = '#252d5f';

const getProdutosPage = async (limit: number = 12) => {
    try {
        const resp = await fetchAllProducts(
            { categories: [], brands: [], term: '' }, 
            { offset: 0, limit: limit }
        );
        
        let products = [];
        if (resp.items && Array.isArray(resp.items)) {
            products = resp.items;
        } else if (Array.isArray(resp)) {
            products = resp;
        }
        
        return products.slice(0, limit);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
};

interface ProductSectionProps {
    title: string;
    products: Product[];
    isLoading: boolean;
    hasError?: boolean;
    loadingProducts: { [key: number]: boolean };
    onAddToCart: (product: Product) => void;
    onRetry?: () => void;
}

function ProductSection({ title, products, isLoading, hasError, loadingProducts, onAddToCart, onRetry }: ProductSectionProps) {
    const skeletonCount = 4;
    const hasProducts = products && products.length > 0;

    return (
        <Box component="section" sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#333',
                        mb: 3,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 3,
                            backgroundColor: THEME_COLOR,
                            borderRadius: 1,
                        },
                    }}
                >
                    {title}
                </Typography>
                
                {isLoading ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        style={{ paddingBottom: 40 }}
                    >
                        {Array.from({ length: skeletonCount }).map((_, index) => (
                            <SwiperSlide key={`skeleton-${index}`}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProductCardSkeleton />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : hasError ? (
                    <ProductsEmptyState 
                        type="error" 
                        onRetry={onRetry}
                        showBrowseButton={false}
                    />
                ) : !hasProducts ? (
                    <ProductsEmptyState 
                        type="empty"
                        showRetryButton={false}
                    />
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        style={{ paddingBottom: 40 }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProductCard
                                        product={product}
                                        isLoading={loadingProducts[product.id]}
                                        onAddToCart={onAddToCart}
                                    />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </Container>
        </Box>
    );
}

interface BrandItem {
    link: string;
    img: typeof LogoColetek;
}

function BrandsSection({ brands }: { brands: BrandItem[] }) {
    return (
        <Box component="section" sx={{ py: 4, backgroundColor: '#fafafa' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#333',
                        mb: 3,
                        textAlign: 'center',
                    }}
                >
                    Nossas marcas
                </Typography>
                
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={2}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop
                    breakpoints={{
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                    }}
                >
                    {brands.map((brand, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                component="a"
                                href={brand.link || '#'}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    p: 2,
                                    filter: 'grayscale(1)',
                                    opacity: 0.7,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        filter: 'grayscale(0)',
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Image
                                    src={brand.img}
                                    alt="Marca"
                                    width={120}
                                    height={60}
                                    style={{ objectFit: 'contain' }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
}

export default function HomePage() {
    const { addItem } = useCart();
    const { showToast } = useToastSide();
    const [openedCart, setOpenedCart] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [prodsNew, setProdsNew] = useState<Product[]>([]);
    const [prodsMaisVend, setProdsMaisVend] = useState<Product[]>([]);
    const [prodsOfertas, setProdOfertas] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<{ [key: number]: boolean }>({});
    const [marcas, setMarcas] = useState<BrandItem[]>([]);

    useEffect(() => {
        const loadProdutos = async () => {
            setIsLoading(true);
            const products = await getProdutosPage(12);
            
            if (products && products.length > 0) {
                setProdsNew(products.slice(0, 12));
                setProdsMaisVend(products.slice(0, 12));
                setProdOfertas(products.slice(0, 12));
            } else {
                setProdsNew([]);
                setProdsMaisVend([]);
                setProdOfertas([]);
            }
            setIsLoading(false);
        };
      
        loadProdutos();

        setMarcas([
            { link: "", img: LogoColetek },
            { link: "", img: LogoColetek },
            { link: "", img: LogoColetek },
            { link: "", img: LogoColetek },
            { link: "", img: LogoColetek },
            { link: "", img: LogoColetek }
        ]);
    }, []);

    const handleAddToCart = useCallback(async (product: Product) => {
        setLoadingProducts(prev => ({ ...prev, [product.id]: true }));
        
        try {
            const activeSku = getActiveSku(product);
            
            if (!activeSku) {
                showToast('Produto sem SKU disponível.', 'error');
                setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
                return;
            }
            
            await addItem(activeSku.id, product.id);
            setTimeout(() => {
                setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
                showToast('O produto foi adicionado ao carrinho!', 'success');
                setOpenedCart(true);
            }, 500);
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            showToast('Erro ao adicionar produto ao carrinho.', 'error');
            setLoadingProducts(prev => ({ ...prev, [product.id]: false }));
        }
    }, [addItem, showToast]);

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart}/>
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>
            
            <main>
                <Box
                    component="section"
                    sx={{
                        width: '100%',
                        '& img': {
                            width: '100%',
                            height: { xs: '40vh', md: '57vh' },
                            objectFit: 'cover',
                        },
                    }}
                >
                    <Image
                        src={Banner1}
                        alt="Banner promocional"
                        priority
                    />
                </Box>

                <InfoCards />

                <ProductSection
                    title="Lançamentos"
                    products={prodsNew}
                    isLoading={isLoading}
                    loadingProducts={loadingProducts}
                    onAddToCart={handleAddToCart}
                />

                <BrandsSection brands={marcas} />

                <ProductSection
                    title="Mais vendidos"
                    products={prodsMaisVend}
                    isLoading={isLoading}
                    loadingProducts={loadingProducts}
                    onAddToCart={handleAddToCart}
                />

                <ProductSection
                    title="Super Ofertas"
                    products={prodsOfertas}
                    isLoading={isLoading}
                    loadingProducts={loadingProducts}
                    onAddToCart={handleAddToCart}
                />

                <Newsletter backgroundImage={bgNewsletter.src} />
            </main>
            
            <Footer/>
        </>
    );
}
