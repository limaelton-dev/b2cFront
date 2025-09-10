// src/app/hooks/useCategoriesMenu.ts
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { fetchCategoryMenuWithCache, preloadPopularCategories } from '../services/category.service';
import { Category } from '../types/category';
import { findCategoryById, flattenCategories } from '../utils/category-utils';

interface UseCategoriesMenuOptions {
  preloadPopular?: boolean;
  maxDepth?: number;
}

interface UseCategoriesMenuReturn {
  tree: Category[];
  flatCategories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isEmpty: boolean;
  findCategory: (id: number) => Category | null;
  getCategoriesByLevel: (level: number) => Category[];
}

export function useCategoriesMenu(options: UseCategoriesMenuOptions = {}): UseCategoriesMenuReturn {
  const { preloadPopular = true, maxDepth = 3 } = options;
  
  const [tree, setTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    
    setLoading(true);
    setError(null);
    
    try {
      const categories = await fetchCategoryMenuWithCache(c.signal);
      
      // Filtra por profundidade se especificado
      const filteredCategories = maxDepth 
        ? filterByDepth(categories, maxDepth)
        : categories;
      
      setTree(filteredCategories);
      
      // Pré-carrega categorias populares se habilitado
      if (preloadPopular) {
        preloadPopularCategories(filteredCategories);
      }
      
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Erro ao carregar categorias:', e);
        setError('Erro ao carregar categorias. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  }, [maxDepth, preloadPopular]);

  useEffect(() => {
    fetchCategories();
    
    return () => {
      ctrl.current?.abort();
    };
  }, [fetchCategories]);

  // Memoiza cálculos pesados
  const flatCategories = useMemo(() => flattenCategories(tree), [tree]);
  
  const findCategory = useCallback((id: number) => 
    findCategoryById(tree, id), [tree]);
  
  const getCategoriesByLevel = useCallback((level: number) => 
    flatCategories.filter(cat => cat.level === level), [flatCategories]);

  return { 
    tree, 
    flatCategories,
    loading, 
    error,
    refetch: fetchCategories,
    isEmpty: !loading && tree.length === 0,
    findCategory,
    getCategoriesByLevel
  };
}

function filterByDepth(categories: Category[], maxDepth: number): Category[] {
  return categories.map(category => {
    const filtered = { ...category };
    
    if (category.level && category.level >= maxDepth) {
      delete filtered.children;
    } else if (category.children) {
      filtered.children = filterByDepth(category.children, maxDepth);
    }
    
    return filtered;
  });
}