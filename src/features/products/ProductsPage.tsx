"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, Typography } from "@mui/material";

import "@/assets/css/produtos.css";
import Cart from "../../components/Cart";
import ClientOnly from "../../components/ClientOnly";
import Header from "@/app/header";
import Footer from "@/app/footer";
import NoImage from "@/assets/img/noimage.png";

import { useAddToCart } from "@/hooks/useAddToCart";

import { fetchRootCategories } from "@/api/categories/services/categories-service";
import { fetchBrands } from "@/api/brands/services/brand-service";
import { fetchAllProducts } from "@/api/products/services/product";

import ProductsGrid from "./components/products/ProductsGrid";
import FiltersContainer from "./components/filters/FiltersContainer";
import BreadCrumbsPage from "./components/breadcrumbs/BreadCrumbsPage";

import type { Product } from "@/api/products/types/product";
import type { Category } from "@/api/categories/types/category";
import type { Brand } from "../../api/brands/types/brand";
import type { PaginatedProducts } from "@/api/products/types/paginetad-products";
import { DEFAULT_LIMIT } from "@/types/pagination";

import {
    buildQueryString,
    parseFiltersFromSearchParams,
    toOffsetLimit,
    PaginationState,
} from "./utils";
import { Filters } from "../../types/filters";

function fallbackPaginated(): PaginatedProducts {
    return { 
        items: [], 
        offset: 0, 
        limit: 0, 
        total: 0, 
        page: 1, 
        lastPage: 1 
    };
}

// Adapta o serviço atual para um retorno paginado consistente
async function getPaginatedProducts(
    filters: Filters,
    pagination: PaginationState = { page: 1, size: DEFAULT_LIMIT },
    signal?: AbortSignal
): Promise<PaginatedProducts> {
    try {
        console.log('getPaginatedProducts - Chamando fetchAllProducts com:', { filters, pagination: toOffsetLimit(pagination.page, pagination.size) });
        const data = await fetchAllProducts(filters, toOffsetLimit(pagination.page, pagination.size), signal);
        return data;
    } catch (error) {
        console.error('getPaginatedProducts - Erro:', error);
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

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, loadingProducts } = useAddToCart();

  const [cartOpened, setCartOpened] = useState(false);

  const [
      { isLoading, products, totalPages, totalItems, currentPage },
      setList,
  ] = useState({
      isLoading: false,
      products: [] as Product[],
      totalPages: 1,
      totalItems: 0,
      currentPage: 1,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isPending, startTransition] = useTransition();

  // Evita race conditions em buscas
  const fetchAbortRef = useRef<AbortController | null>(null);

  // ÚNICA FONTE DA VERDADE: URL
  const { filters, page } = useMemo(() => {
      // usar .toString() como dependência é uma prática comum no App Router
      return parseFiltersFromSearchParams(searchParams);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Carga inicial: categorias + marcas (em paralelo)
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

  // Carrega produtos quando filtros/página mudam
  useEffect(() => {
      // Removida a condição que impedia o carregamento dos produtos
      // Os produtos podem ser carregados independentemente das categorias e marcas
      
      fetchAbortRef.current?.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      setList((s) => ({ ...s, isLoading: true }));
      (async () => {
          console.log('Carregando produtos com filtros:', filters);
          const data = await getPaginatedProducts(
              filters,
              { page, size: DEFAULT_LIMIT },
              controller.signal
          );
          console.log('Dados dos produtos recebidos:', data);
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
              router.replace(qs ? `/produtos${qs}` : "/produtos", { scroll: false });
          });
      },
      [router]
  );

  // Handlers
  const handleFiltersChange = useCallback(
      (nextFilters: Filters) => {
          replaceURL(nextFilters, 1);
      },
      [replaceURL]
  );

  const handlePageChange = useCallback(
      (_e: unknown, nextPage: number) => {
          replaceURL(filters, nextPage);
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
              }
          });
      },
      [addToCart]
  );

  // Função para controlar a abertura/fechamento do carrinho
  const handleCartToggle = useCallback((opened: boolean) => {
      setCartOpened(opened);
  }, []);

  const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = NoImage.src;
      },
      []
  );

  return (
      <>
          <ClientOnly>
              <Cart cartOpened={cartOpened} onCartToggle={handleCartToggle} />
              <Header cartOpened={cartOpened} onCartToggle={handleCartToggle} />
          </ClientOnly>

          <div className="container d-flex flex-wrap justify-content-center mt-3">
              <BreadCrumbsPage />

              <FiltersContainer
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  setFilters={handleFiltersChange}
              />

              <ProductsGrid
                  products={products}
                  isLoading={isLoading || isPending}
                  loadingProducts={loadingProducts}
                  handleAddToCart={handleAddToCart}
                  handleImageError={handleImageError}
              />

              {totalPages > 1 ? (
                  <div
                      style={{
                          width: "100%",
                          margin: 15,
                          display: "flex",
                          justifyContent: "center",
                      }}
                  >
                      <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          size="large"
                      />
                  </div>
              ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                      <Typography variant="h6">Nenhum produto encontrado</Typography>
                  </div>
              )}
          </div>

          <Footer />
      </>
  );
}

export default ProductsPage;