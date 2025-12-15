'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    CircularProgress,
    Chip,
    Divider,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Breadcrumbs } from '@/components/common';
import { ProductCard, ProductCardSkeleton, ProductsEmptyState } from '@/components/ProductCard';
import {
    ProductImageGallery,
    ProductVariations,
    ProductShipping,
    ProductSpecifications,
    ProductReviews,
    ProductRating,
    ProductPageSkeleton,
} from '@/components/ProductPage';
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
import { formatPrice, getSkuPrice } from '@/utils/product';

const THEME_COLOR = '#252d5f';

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
        changeImage,
    } = useProductDetails(slug as string);

    const {
        postalCode,
        setPostalCode,
        loadingShipping,
        shippingInfo,
        error: shippingError,
        calculateShippingForSingleProduct,
    } = useShipping();

    const [openedCart, setOpenedCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loadingRelatedProducts, setLoadingRelatedProducts] = useState<{ [key: number]: boolean }>({});

        const selectedSku = getSelectedSku();
    const selectedPrice = getSkuPrice(selectedSku);

    useEffect(() => {
        const loadRelatedProducts = async () => {
            try {
                const dataRelatedProducts = await fetchAllProducts(
                    { categories: [], brands: [], term: '' },
                    { offset: 0, limit: 12 }
                );
                setRelatedProducts(dataRelatedProducts.items);
            } catch {
                setRelatedProducts([]);
            }
        };

        loadRelatedProducts();
    }, []);

    const handleAddToCart = async () => {
        if (!product || !selectedSkuId) return;

        await addToCartWithSkuId(selectedSkuId, product.id, {
            onSuccess: () => {
                setTimeout(() => setOpenedCart(true), 500);
            },
        });
    };

    const handleRelatedAddToCart = useCallback(
        async (relatedProduct: Product) => {
            setLoadingRelatedProducts((prev) => ({ ...prev, [relatedProduct.id]: true }));

            try {
                const activeSku = relatedProduct.skus?.find((sku) => sku.active) || relatedProduct.skus?.[0];
                if (!activeSku) return;

                await addToCartWithSkuId(activeSku.id, relatedProduct.id, {
                    onSuccess: () => {
                        setTimeout(() => setOpenedCart(true), 500);
                    },
                });
            } finally {
                setLoadingRelatedProducts((prev) => ({ ...prev, [relatedProduct.id]: false }));
            }
        },
        [addToCartWithSkuId]
    );

    const handleCalculateShipping = async () => {
        if (!selectedSku || !postalCode) return;

        await calculateShippingForSingleProduct(postalCode, selectedSku.id, selectedSku.partnerId);
    };

    const breadcrumbItems = product
        ? [
              { label: 'Produtos', href: '/produtos' },
              ...(product.categoryLevel1 ? [{ label: product.categoryLevel1.name, href: `/produtos?categoria=${product.categoryLevel1.id}&page=1` }] : []),
              { label: product.title },
          ]
        : [{ label: 'Produtos', href: '/produtos' }];

    const specifications = product
        ? [
              { label: 'Marca', value: product.brand?.name },
              { label: 'Modelo', value: product.model },
              { label: 'Garantia', value: product.warrantyTime ? `${product.warrantyTime} meses${product.warrantyText ? ` (${product.warrantyText})` : ''}` : null },
          ]
        : [];

    const mockReviewData = {
        averageRating: 4.5,
        totalReviews: 145,
        distribution: [
            { stars: 5, percentage: 80 },
            { stars: 4, percentage: 10 },
            { stars: 3, percentage: 5 },
            { stars: 2, percentage: 3 },
            { stars: 1, percentage: 2 },
        ],
        reviews: [
            {
                id: 1,
                author: 'Fernanda Sales',
                rating: 4.5,
                comment: 'Produto excelente! Chegou rápido e muito bem embalado. Recomendo.',
                date: '15/11/2024',
            },
            {
                id: 2,
                author: 'Alisson Campos',
                rating: 5,
                comment: 'Superou minhas expectativas. Qualidade impecável e ótimo custo-benefício.',
                date: '10/11/2024',
            },
        ],
    };

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={openedCart} onCartToggle={setOpenedCart} />
                <Header cartOpened={openedCart} onCartToggle={setOpenedCart} />
            </ClientOnly>

            {loading ? (
                <ProductPageSkeleton />
            ) : !product ? (
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <ProductsEmptyState
                        type="error"
                        title="Produto não encontrado"
                        description="O produto que você está procurando não existe ou foi removido."
                    />
                </Container>
            ) : (
                <main>
                    <Container maxWidth="lg">
                        <Breadcrumbs items={breadcrumbItems} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <ProductImageGallery
                                    images={getFilteredImages()}
                                    selectedImageUrl={selectedImageUrl || undefined}
                                    onImageSelect={changeImage}
                                    productTitle={product.title}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ position: 'sticky', top: 100 }}>
                                    <Chip
                                        label={product.brand?.name || 'Marca'}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(37, 45, 95, 0.08)',
                                            color: THEME_COLOR,
                                            fontWeight: 600,
                                            mb: 1.5,
                                        }}
                                    />

                                <Typography
                                        variant="h4"
                                        component="h1"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#222',
                                            mb: 1,
                                            lineHeight: 1.3,
                                        }}
                                >
                                    {product.title}
                                </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#888', mb: 2 }}
                                    >
                                        Modelo: {product.model}
                                    </Typography>

                                    <ProductRating rating={4.7} reviewCount={145} />

                                    <Divider sx={{ my: 3 }} />

                                    {selectedPrice !== null ? (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: THEME_COLOR,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                R$ {formatPrice(selectedPrice)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#666', mt: 1 }}
                                            >
                                                Em até 12x de{' '}
                                                <strong>R$ {formatPrice(selectedPrice / 12)}</strong>
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#4caf50', fontWeight: 600, mt: 0.5 }}
                                            >
                                                R$ {formatPrice(selectedPrice * 0.95)} no PIX (5% off)
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="h5"
                                            sx={{ color: '#999', mb: 3 }}
                                        >
                                            Preço não disponível
                                        </Typography>
                                    )}

                                    {product.hasVariations && product.skus && product.skus.length > 1 && (
                                        <ProductVariations
                                            skus={product.skus}
                                            selectedSku={selectedSku || undefined}
                                            onVariationChange={changeVariation}
                                        />
                                    )}

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={handleAddToCart}
                                        disabled={isProductLoading(product.id)}
                                        sx={{
                                            bgcolor: THEME_COLOR,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            mb: 3,
                                            '&:hover': {
                                                bgcolor: '#1a2147',
                                            },
                                        }}
                                    >
                                        {isProductLoading(product.id) ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'Adicionar ao Carrinho'
                                        )}
                                    </Button>

                                    <ProductShipping
                                        postalCode={postalCode}
                                        onPostalCodeChange={setPostalCode}
                                        onCalculate={handleCalculateShipping}
                                        loading={loadingShipping}
                                        error={shippingError}
                                        shippingInfo={shippingInfo || undefined}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                                border: '1px solid #e8e8e8',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: '#333', mb: 2 }}
                            >
                                Descrição do Produto
                            </Typography>
                            <Box
                                sx={{
                                    color: '#555',
                                    lineHeight: 1.8,
                                    '& p': { mb: 2 },
                                    '& ul, & ol': { pl: 3, mb: 2 },
                                    '& li': { mb: 0.5 },
                                }}
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <ProductSpecifications specifications={specifications} />
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <ProductReviews {...mockReviewData} />
                        </Box>

                        <Box sx={{ py: 6 }}>
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
                                Recomendado para você
                            </Typography>

                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={16}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                breakpoints={{
                                    480: { slidesPerView: 2, spaceBetween: 16 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1024: { slidesPerView: 4, spaceBetween: 24 },
                                }}
                                style={{ paddingBottom: 40 }}
                            >
                                {relatedProducts.length === 0
                                    ? Array.from({ length: 4 }).map((_, index) => (
                                          <SwiperSlide key={`skeleton-${index}`}>
                                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                  <ProductCardSkeleton />
                                              </Box>
                                          </SwiperSlide>
                                      ))
                                    : relatedProducts.map((relatedProduct) => (
                                          <SwiperSlide key={relatedProduct.id}>
                                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                  <ProductCard
                                                      product={relatedProduct}
                                                      isLoading={loadingRelatedProducts[relatedProduct.id]}
                                                      onAddToCart={handleRelatedAddToCart}
                                                  />
                                              </Box>
                                          </SwiperSlide>
                                      ))}
                            </Swiper>
                        </Box>
                    </Container>

                    <Footer />
                </main>
            )}
        </>
  );
};

export default ProductPage;
