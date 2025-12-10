import { get } from '../../http';
import { Category } from '../types/category';
import { processCategories } from '../../../utils/category-utils';

// Cache em memória
let categoryCache: { 
  data: Category[]; 
  timestamp: number; 
  version?: string;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * Busca todas as categorias (raiz)
 */
export async function fetchRootCategories(): Promise<Category[]> {
  try {
    const response = await get<any>('/categories');
    
    // A resposta pode vir como array diretamente ou dentro de um objeto
    if (Array.isArray(response)) {
      return response;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response?.categories && Array.isArray(response.categories)) {
      return response.categories;
    }
    
    console.warn('Formato de resposta de categorias inesperado:', response);
    return [];
  } catch (error) {
    console.error('Erro ao buscar categorias raiz:', error);
    return [];
  }
}

/**
 * Busca o menu de categorias (árvore completa)
 */
export async function fetchCategoriesMenu(signal?: AbortSignal): Promise<Category[]> {
  try {
    const response = await get<any>('/categories/tree', { signal });
    
    // A resposta pode vir como array diretamente ou dentro de um objeto
    let rawData: any;
    if (Array.isArray(response)) {
      rawData = response;
    } else if (response?.data && Array.isArray(response.data)) {
      rawData = response.data;
    } else if (response?.categories && Array.isArray(response.categories)) {
      rawData = response.categories;
    } else {
      console.warn('Formato de resposta de categorias menu inesperado:', response);
      return [];
    }
    
    // Processa e enriquece as categorias
    return processCategories(rawData);
  } catch (error) {
    console.error('Erro ao buscar menu de categorias:', error);
    
    // Fallback para cache se disponível
    if (categoryCache) {
      console.warn('Usando cache de categorias devido a erro na API');
      return categoryCache.data;
    }
    
    return [];
  }
}

/**
 * Busca o menu de categorias com cache
 */
export async function fetchCategoriesMenuWithCache(signal?: AbortSignal): Promise<Category[]> {
  const now = Date.now();
  
  // Verifica se o cache ainda é válido
  if (categoryCache && (now - categoryCache.timestamp) < CACHE_DURATION) {
    return categoryCache.data;
  }
  
  try {
    const data = await fetchCategoriesMenu(signal);
    
    // Atualiza o cache
    categoryCache = { 
      data, 
      timestamp: now,
      version: '1.0'
    };
    
    return data;
  } catch (error) {
    // Se falhou e temos cache, usa o cache expirado
    if (categoryCache) {
      console.warn('Usando cache expirado de categorias');
      return categoryCache.data;
    }
    return [];
  }
}

/**
 * Busca produtos de uma categoria específica
 */
export async function fetchCategoryProducts(
  categoryId: number, 
  page: number = 1, 
  limit: number = 12,
  signal?: AbortSignal
) {
  return get(`/products/categories/${categoryId}?page=${page}&limit=${limit}`, { signal });
}