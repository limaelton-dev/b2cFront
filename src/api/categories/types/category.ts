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
  slug: string;
  
  level?: number;
  hasChildren?: boolean;
}

export type CategoriesApiResponse = Category[];