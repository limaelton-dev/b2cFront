import { get, post, patch, del } from "../../http";
import { Cart } from "../types/Cart";

/** Buscar carrinho básico (apenas IDs e quantidades) */
export const getCartAPI = async (): Promise<Cart> => {
  return get<Cart>("/cart");
};

/** Buscar carrinho com detalhes completos (enriquecido pelo backend) */
export const getCartDetailsAPI = async (): Promise<Cart> => {
  return get<Cart>("/cart/details");
};

/** Preview de carrinho sem autenticação (para carrinho local) */
export const previewCartDetailsAPI = async (items: { productId?: number; skuId: number; quantity: number }[]): Promise<Cart> => {
  return post<Cart>("/cart/details/preview", { items });
};

/** Adicionar item ao carrinho */
export const addItemAPI = async (skuId: number, productId?: number): Promise<Cart> => {
  return post<Cart>("/cart/items", { skuId, productId, quantity: 1 });
};

/** Atualizar quantidade de um item pelo itemId */
export const updateItemQuantityAPI = async (itemId: number, quantity: number): Promise<Cart> => {
  return patch<Cart>(`/cart/items/${itemId}`, { quantity });
};

/** Remover item específico pelo itemId */
export const removeItemAPI = async (itemId: number): Promise<Cart> => {
  return del<Cart>(`/cart/items/${itemId}`);
};

/** Limpar todos os itens do carrinho */
export const clearCartAPI = async (): Promise<Cart> => {
  return del<Cart>("/cart/items");
};
