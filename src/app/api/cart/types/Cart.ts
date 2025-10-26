import { ProductSku } from '../../products/types/product-sku';

export interface CartItem {
  skuId: number;
  productId?: number;
  quantity: number;
  sku?: ProductSku;
}
  
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}