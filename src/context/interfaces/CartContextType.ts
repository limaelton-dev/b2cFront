import { Cart } from "../../api/cart/types/Cart";

export interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error?: string;
  fetchCart: () => void;
  changeItemQuantity: (skuId: number, newQuantity: number) => void;
  addItem: (skuId: number, productId?: number) => void;
  removeItem: (skuId: number) => void;
  clearItems: () => void;
}
