export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  isMain: boolean;
}

export interface ProductBrand {
  id: number;
  oracleId: number | string;
  name: string;
  slug: string;
}

export interface ProductCategory {
  id: number;
  oracleId: number | string;
  name: string;
  sourceTable?: string;
  sourceColumn?: string;
  slug: string;
  level: number;
}

export interface Product {
  id: number;
  oracleId: number | string;
  reference: string;
  name: string;
  description: string;
  techDescription: string;
  packagingContent: string;
  model: string;
  price: string;
  stock: number;
  unit: string;
  barcode: string;
  sku: string;
  weight: string;
  height: string;
  width: string;
  length: string;
  slug: string;
  modelImage: string;
  brandImage: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  brand: ProductBrand;
  categoryLevel1?: ProductCategory;
  categoryLevel2?: ProductCategory;
  categoryLevel3?: ProductCategory;
}

export interface ProductResponse {
  brand: {
    id: number;
    name: string;
    slug: string;
    oracleId?: string | number;
  };
  categories?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 