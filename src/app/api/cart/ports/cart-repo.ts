import { Cart } from "../types/Cart";

export interface CartRepo {
  get(): Promise<Cart>;
  addItem(skuId: number): Promise<Cart>;
  setItemQuantity(skuId: number, quantity: number): Promise<Cart>;
  removeItem(skuId: number): Promise<Cart>;
  clear(): Promise<Cart>;
}
