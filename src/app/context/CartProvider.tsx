// src/context/cart.tsx
'use client';
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Cart } from "../api/cart/types/Cart";
import { CartContextType } from "./interfaces/CartContextType";
import { makeCartRepo } from "../api/cart/cart-repo-factory";
import type { CartRepo } from "../api/cart/ports/cart-repo";
import { fetchSkusByIds } from "../api/products/services/product";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error("useCart must be used within a CartProvider");
  return cartContext;
};

/**
 * Enriquece o carrinho com dados dos SKUs
 */
async function enrichCart(cart: Cart): Promise<Cart> {
  if (!cart.items || cart.items.length === 0) return cart;

  const skuIds = cart.items.map(item => item.skuId);
  const skuMap = await fetchSkusByIds(skuIds);

  return {
    ...cart,
    items: cart.items.map(item => ({
      ...item,
      sku: skuMap.get(item.skuId) || item.sku,
    })),
  };
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const cartRepo: CartRepo = useMemo(() => makeCartRepo(), []); // se tiver um estado global de auth, coloque-o nas deps
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const wrap = useCallback(async (fn: () => Promise<Cart>) => {
    setLoading(true); 
    setError(undefined);
    try { 
      const rawCart = await fn();
      const enrichedCart = await enrichCart(rawCart);
      setCart(enrichedCart);
    }
    catch (e: any) { 
      setError(e?.message ?? "Erro de comunicação"); 
    }
    finally { 
      setLoading(false); 
    }
  }, []);

  const fetchCart = useCallback(() => wrap(() => cartRepo.get()), [wrap, cartRepo]);
  const addItem = useCallback((skuId: number) => wrap(() => cartRepo.addItem(skuId)), [wrap, cartRepo]);
  const changeItemQuantity = useCallback((skuId: number, q: number) => wrap(() => cartRepo.setItemQuantity(skuId, q)), [wrap, cartRepo]);
  const removeItem = useCallback((skuId: number) => wrap(() => cartRepo.removeItem(skuId)), [wrap, cartRepo]);
  const clearItems = useCallback(() => wrap(() => cartRepo.clear()), [wrap, cartRepo]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const value: CartContextType = { cart, loading, error, fetchCart, changeItemQuantity, addItem, removeItem, clearItems };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
