'use client';

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Container, Pagination, Typography } from '@mui/material';

import Cart from '../../components/Cart';
import ClientOnly from '../../components/ClientOnly';
import Header from '@/app/header';
import Footer from '@/app/footer';

import { useAddToCart } from '@/hooks/useAddToCart';

import { fetchRootCategories } from '@/api/categories/services/categories-service';
import { fetchBrands } from '@/api/brands/services/brand-service';
import { fetchAllProducts } from '@/api/products/services/product';

import ProductsGrid from './components/products/ProductsGrid';
import FiltersContainer from './components/filters/FiltersContainer';
import BreadCrumbsPage from './components/breadcrumbs/BreadCrumbsPage';

import type { Product } from '@/api/products/types/product';
import type { Category } from '@/api/categories/types/category';
import type { Brand } from '../../api/brands/types/brand';
import type { PaginatedProducts } from '@/api/products/types/paginetad-products';
import { DEFAULT_LIMIT } from '@/types/pagination';

import {
    buildQueryString,
    parseFiltersFromSearchParams,
    toOffsetLimit,
    PaginationState,
} from './utils';
import { Filters } from '../../types/filters';

const THEME_COLOR = '#252d5f';

function fallbackPaginated(): PaginatedProducts {
    return {
        items: [],
        offset: 0,
        limit: 0,
        total: 0,
        page: 1,
        lastPage: 1,
    };
}

async function getPaginatedProducts(
    filters: Filters,
    pagination: PaginationState = { page: 1, size: DEFAULT_LIMIT },
    signal?: AbortSignal
): Promise<PaginatedProducts> {
    try {
        const data = await fetchAllProducts(
            filters,
            toOffsetLimit(pagination.page, pagination.size),
            signal
        );
        return data;
    } catch {
        return fallbackPaginated();
    }
}

async function getBrands(): Promise<Brand[]> {
    try {
        const data = await fetchBrands();
        return data ?? [];
    } catch {
        return [];
    }
}

async function getCategories(): Promise<Category[]> {
    try {
        const data = await fetchRootCategories();
        return data ?? [];
    } catch {
        return [];
    }
}

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart, loadingProducts } = useAddToCart();

    const [cartOpened, setCartOpened] = useState(false);

    const [{ isLoading, products, totalPages, currentPage }, setList] = useState({
        isLoading: true,
        products: [] as Product[],
        totalPages: 1,
        totalItems: 0,
        currentPage: 1,
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchAbortRef = useRef<AbortController | null>(null);

    const { filters, page } = useMemo(() => {
        return parseFiltersFromSearchParams(searchParams);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const [cats, bnds] = await Promise.all([getCategories(), getBrands()]);
            if (!mounted) return;
            setCategories(Array.isArray(cats) ? cats : []);
            setBrands(Array.isArray(bnds) ? bnds : []);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        fetchAbortRef.current?.abort();
        const controller = new AbortController();
        fetchAbortRef.current = controller;

        setList((s) => ({ ...s, isLoading: true }));
        (async () => {
            const data = await getPaginatedProducts(
                filters,
                { page, size: DEFAULT_LIMIT },
                controller.signal
            );
            setList({
                isLoading: false,
                products: data.items ?? [],
                totalPages: data.lastPage ?? 1,
                totalItems: data.total ?? 0,
                currentPage: data.page ?? page ?? 1,
            });
        })();

        return () => controller.abort();
    }, [filters, page]);

    const replaceURL = useCallback(
        (nextFilters: Filters, nextPage = 1) => {
            const qs = buildQueryString(nextFilters, nextPage);
            startTransition(() => {
                router.replace(qs ? `/produtos${qs}` : '/produtos', { scroll: false });
            });
        },
        [router]
    );

    const handleFiltersChange = useCallback(
        (nextFilters: Filters) => {
            replaceURL(nextFilters, 1);
        },
        [replaceURL]
    );

    const handlePageChange = useCallback(
        (_e: unknown, nextPage: number) => {
            replaceURL(filters, nextPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [filters, replaceURL]
    );

    const handleAddToCart = useCallback(
        async (product: Product) => {
            await addToCart(product, {
                onSuccess: () => {
                    setTimeout(() => {
                        setCartOpened(true);
                    }, 500);
                },
            });
        },
        [addToCart]
    );

    const handleCartToggle = useCallback((opened: boolean) => {
        setCartOpened(opened);
    }, []);

    return (
        <>
            <ClientOnly>
                <Cart cartOpened={cartOpened} onCartToggle={handleCartToggle} />
                <Header cartOpened={cartOpened} onCartToggle={handleCartToggle} />
            </ClientOnly>

            <Container maxWidth="lg" sx={{ py: 3 }}>
                <BreadCrumbsPage />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3,
                        mt: 2,
                    }}
                >
                    <FiltersContainer
                        categories={categories}
                        brands={brands}
                        filters={filters}
                        setFilters={handleFiltersChange}
                    />

                    <Box sx={{ flex: 1 }}>
                        <ProductsGrid
                            products={products}
                            isLoading={isLoading || isPending}
                            loadingProducts={loadingProducts}
                            handleAddToCart={handleAddToCart}
                        />

                        {totalPages > 1 && !isLoading && products.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 4,
                                    mb: 2,
                                }}
                            >
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontWeight: 600,
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor: `${THEME_COLOR} !important`,
                                            color: '#fff',
                                        },
                                        '& .MuiPaginationItem-root:hover': {
                                            backgroundColor: 'rgba(37, 45, 95, 0.1)',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>

            <Footer />
        </>
    );
}
