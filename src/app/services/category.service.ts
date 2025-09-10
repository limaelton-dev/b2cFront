// src/app/services/category.service.ts
import { http } from './http';
import { CategoriesApiResponse, Category } from '../types/category';
import { processCategories } from '../utils/category-utils';

// Cache em memória
let categoryCache: { 
  data: Category[]; 
  timestamp: number; 
  version?: string;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export async function fetchCategoryMenu(signal?: AbortSignal): Promise<Category[]> {
  try {
    const rawData = await http<CategoriesApiResponse>('/category/tree', { 
      signal,
      cache: 'default',
      next: { revalidate: 1800 } // 30 minutos
    });
    
    // Processa e enriquece as categorias
    return processCategories(rawData);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    
    // Fallback para cache se disponível
    if (categoryCache) {
      console.warn('Usando cache de categorias devido a erro na API');
      return categoryCache.data;
    }
    
    throw error;
  }
}

export async function fetchCategoryMenuWithCache(signal?: AbortSignal): Promise<Category[]> {
  const now = Date.now();
  
  // Verifica se o cache ainda é válido
  if (categoryCache && (now - categoryCache.timestamp) < CACHE_DURATION) {
    return categoryCache.data;
  }
  
  try {
    const data = await fetchCategoryMenu(signal);
    
    // Atualiza o cache
    categoryCache = { 
      data, 
      timestamp: now,
      version: '1.0' // Para versionamento futuro
    };
    
    return data;
  } catch (error) {
    // Se falhou e temos cache, usa o cache expirado
    if (categoryCache) {
      console.warn('Usando cache expirado de categorias');
      return categoryCache.data;
    }
    throw error;
  }
}

// Função para pré-carregar categorias populares
export function preloadPopularCategories(categories: Category[]) {
  // Pré-carrega categorias com mais produtos
  const popularCategories = categories
    .filter(cat => cat.totalProducts > 10)
    .sort((a, b) => b.totalProducts - a.totalProducts)
    .slice(0, 5);
    
  // Aqui você pode implementar pré-carregamento de produtos dessas categorias
  console.log('Categorias populares para pré-carregamento:', popularCategories.map(c => c.name));
}

// Função para buscar produtos de uma categoria
export async function fetchCategoryProducts(
  categoryId: number, 
  page: number = 1, 
  limit: number = 12,
  signal?: AbortSignal
) {
  return http(`/product/category/${categoryId}?page=${page}&limit=${limit}`, {
    signal,
    cache: 'default',
    next: { revalidate: 300 } // 5 minutos para produtos
  });
}