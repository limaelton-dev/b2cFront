import { get } from "../../http";
import { Filters } from "../../../types/filters";
import { normalizeProduct, normalizeProducts } from "../../../utils/product-utils";
import { Product } from "../types/product";
import { PaginatedProducts } from "../types/paginetad-products";

interface Pagination {
  offset: number;
  limit: number;
}

interface ProductsResponse {
  data?: Product[];
  items?: Product[];
}

/**
 * Busca produtos com filtros e paginação
 */
export const fetchAllProducts = async (
  filters: Filters,
  pagination: Pagination,
  signal?: AbortSignal
): Promise<PaginatedProducts> => {
  try {
    const params = new URLSearchParams();
    params.set("offset", pagination.offset.toString());
    params.set("limit", pagination.limit.toString());

    if (filters.term) params.set("term", filters.term);
    if (filters.categories && filters.categories.length > 0) {
      params.set("categories", filters.categories.join(","));
    }
    if (filters.brands && filters.brands.length > 0) {
      params.set("brands", filters.brands.join(","));
    }

    const url = `/products?${params.toString()}`;
    const response = await get<ProductsResponse>(url, { signal });

    // Normalizar produtos para compatibilidade
    let products: Product[] = [];
    if (response.data && Array.isArray(response.data)) {
      products = normalizeProducts(response.data);
    } else if (response.items && Array.isArray(response.items)) {
      products = normalizeProducts(response.items);
    }

    return {
      items: products,
      offset: pagination.offset,
      limit: pagination.limit,
      totalMatched: products.length,
      currentPage: Math.floor(pagination.offset / pagination.limit) + 1,
      lastPage: 1,
    };
  } catch (err) {
    console.error("Erro ao obter produtos:", err);
    return {
      items: [],
      offset: pagination.offset,
      limit: pagination.limit,
      totalMatched: 0,
      currentPage: 1,
      lastPage: 1,
    };
  }
};

/**
 * Busca produto por slug
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const data = await get<Product>(`/products/slug/${slug}`);
    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.error("Erro ao obter produto por slug:", err);
    return null;
  }
};

/**
 * Busca produtos por termo de pesquisa
 */
export const fetchProductsByTerm = async (term: string): Promise<PaginatedProducts> => {
  try {
    const response = await get<ProductsResponse>(`/products?offset=0&limit=12&term=${term}`);

    let products: Product[] = [];
    if (response.data && Array.isArray(response.data)) {
      products = normalizeProducts(response.data);
    } else if (response.items && Array.isArray(response.items)) {
      products = normalizeProducts(response.items);
    }

    return {
      items: products,
      offset: 0,
      limit: 12,
      totalMatched: products.length,
      currentPage: 1,
      lastPage: 1,
    };
  } catch (err) {
    console.error("Erro ao buscar produtos por termo:", err);
    return {
      items: [],
      offset: 0,
      limit: 12,
      totalMatched: 0,
      currentPage: 1,
      lastPage: 1,
    };
  }
};

/**
 * Busca produto por ID
 */
export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const data = await get<Product>(`/products/${id}`);
    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.error("Erro ao obter produto por ID:", err);
    return null;
  }
};

/**
 * Busca múltiplos produtos por IDs
 */
export const fetchProductsByIds = async (ids: number[]): Promise<Product[]> => {
  try {
    if (!ids || ids.length === 0) return [];

    const promises = ids.map((id) => fetchProductById(id));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<Product> => 
        result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);
  } catch (err) {
    console.error("Erro ao obter produtos por IDs:", err);
    return [];
  }
};