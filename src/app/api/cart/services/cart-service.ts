import { get, post, patch, del } from "../../http";
import { Cart } from "../types/Cart";

export const getCartAPI = async (): Promise<Cart> => {
  return get<Cart>("/cart/items");
};

export const addItemAPI = async (skuId: number): Promise<Cart> => {
  return post<Cart>("/cart/items", { skuId, quantity: 1 });
};

export const updateItemQuantityAPI = async (skuId: number, quantity: number): Promise<Cart> => {
  return patch<Cart>("/cart/items/qty", { skuId, quantity });
};

// ATENÇÃO: se o servidor não aceitar DELETE com body, troque para /cart/items/:skuId
export const removeItemAPI = async (skuId: number): Promise<Cart> => {
  return del<Cart>("/cart/items", { skuId });
};

export const clearCartAPI = async (): Promise<Cart> => {
  return del<Cart>("/cart");
};
