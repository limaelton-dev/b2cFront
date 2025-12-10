import { ProductSku } from '../../products/types/product-sku';

export interface CartItem {
  id?: number | string;
  skuId: number;
  productId?: number;
  quantity: number;
  available?: boolean;
  sku?: ProductSku;
  createdAt?: string;
  updatedAt?: string;
}
  
export interface Cart {
  id: number | string;
  profileId?: number;
  items: CartItem[];
  subtotal: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}