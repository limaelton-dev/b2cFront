// src/app/types/category.ts
export interface CategoryParent { 
  id: number; 
  partnerId?: string; 
}

export interface Category {
  id: number;
  name: string;
  path: string;
  partnerId?: string;
  priceFactor: number;
  totalProducts: number;
  parent?: CategoryParent;
  children?: Category[];
  
  level?: number;
  hasChildren?: boolean;
  slug?: string;
}

export type CategoriesApiResponse = Category[];