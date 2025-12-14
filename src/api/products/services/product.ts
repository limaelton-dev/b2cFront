import { get } from "../../http";
import { Filters } from "../../../types/filters";
import { normalizeProduct, normalizeProducts } from "@/utils/product";
import { Product } from "../types/product";
import { PaginatedProducts } from "../types/paginetad-products";

interface Pagination {
  offset: number;
  limit: number;
}

interface ProductsApiResponse {
  items: Product[];
  offset: number;
  limit: number;
  total: number;
  page: number;
  lastPage: number;
}

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
    const response = await get<ProductsApiResponse>(url, { signal });

    const products = normalizeProducts(response.items || []);

    return {
      items: products,
      offset: response.offset ?? pagination.offset,
      limit: response.limit ?? pagination.limit,
      total: response.total ?? products.length,
      page: response.page ?? Math.floor(pagination.offset / pagination.limit) + 1,
      lastPage: response.lastPage ?? 1,
    };
  } catch (err) {
    console.error("Erro ao obter produtos:", err);
    return {
      items: [],
      offset: pagination.offset,
      limit: pagination.limit,
      total: 0,
      page: 1,
      lastPage: 1,
    };
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const data = await get<Product>(`/products/slug/${slug}`);
    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.error("Erro ao obter produto por slug:", err);
    return null;
  }
};

export const fetchProductsByTerm = async (term: string): Promise<PaginatedProducts> => {
  try {
    const response = await get<ProductsApiResponse>(`/products?offset=0&limit=12&term=${encodeURIComponent(term)}`);

    const products = normalizeProducts(response.items || []);

    return {
      items: products,
      offset: response.offset ?? 0,
      limit: response.limit ?? 12,
      total: response.total ?? products.length,
      page: response.page ?? 1,
      lastPage: response.lastPage ?? 1,
    };
  } catch (err) {
    console.error("Erro ao buscar produtos por termo:", err);
    return {
      items: [],
      offset: 0,
      limit: 12,
      total: 0,
      page: 1,
      lastPage: 1,
    };
  }
};

export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const data = await get<Product>(`/products/${id}`);
    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.error("Erro ao obter produto por ID:", err);
    return null;
  }
};

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
