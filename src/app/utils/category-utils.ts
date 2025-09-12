// src/app/utils/category-utils.ts
import { Category } from '../types/category';

export function processCategories(categories: Category[]): Category[] {
  return categories.map(category => enrichCategory(category));
}

function enrichCategory(category: Category, level: number = 1): Category {
  const enriched: Category = {
    ...category,
    level,
    hasChildren: !!(category.children && category.children.length > 0)
  };

  if (enriched.children) {
    enriched.children = enriched.children.map(child => 
      enrichCategory(child, level + 1)
    );
  }

  return enriched;
}

export function findCategoryById(categories: Category[], id: number): Category | null {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];
  
  function flatten(cats: Category[]) {
    for (const cat of cats) {
      result.push(cat);
      if (cat.children) {
        flatten(cat.children);
      }
    }
  }
  
  flatten(categories);
  return result;
}

export function getCategoryBreadcrumb(categories: Category[], categoryId: number): Category[] {
  const category = findCategoryById(categories, categoryId);
  if (!category) return [];
  
  return category.path.split('/').map((pathPart, index, parts) => {
    const partialPath = parts.slice(0, index + 1).join('/');
    return flattenCategories(categories).find(cat => cat.path === partialPath)!;
  }).filter(Boolean);
}

// Função para obter todas as categorias que não possuem subcategorias (categorias folha)
export function getLeafCategories(categories: Category[]): Category[] {
  const leafCategories: Category[] = [];
  
  function findLeaves(cats: Category[]) {
    for (const cat of cats) {
      // Se não tem children ou children está vazio, é uma categoria folha
      if (!cat.children || cat.children.length === 0) {
        leafCategories.push(cat);
      } else {
        // Se tem children, busca recursivamente
        findLeaves(cat.children);
      }
    }
  }
  
  findLeaves(categories);
  return leafCategories;
}

// Função para obter as últimas N categorias folha
export function getLastLeafCategories(categories: Category[], count: number = 4): Category[] {
  const leafCategories = getLeafCategories(categories);
  return leafCategories.slice(-count);
}

// Função para obter as primeiras N categorias folha
export function getFirstLeafCategories(categories: Category[], count: number = 4): Category[] {
  const leafCategories = getLeafCategories(categories);
  return leafCategories.slice(0, count);
}