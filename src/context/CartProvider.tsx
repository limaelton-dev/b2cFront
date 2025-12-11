// src/context/cart.tsx
'use client';
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Cart } from "../api/cart/types/Cart";
import { CartContextType } from "./interfaces/CartContextType";
import { makeCartRepo } from "../api/cart/cart-repo-factory";
import type { CartRepo } from "../api/cart/ports/cart-repo";
import { useAuth } from "./AuthProvider";
import { loadGuestCart, clearGuestCart } from "../utils/cart-storage";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error("useCart must be used within a CartProvider");
  return cartContext;
};

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const cartRepo: CartRepo = useMemo(() => makeCartRepo(isAuthenticated), [isAuthenticated]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [hasMigrated, setHasMigrated] = useState(false);

  const wrap = useCallback(async (fn: () => Promise<Cart>) => {
    setLoading(true); 
    setError(undefined);
    try { 
      const cart = await fn();
      setCart(cart);
      return cart;
    }
    catch (e: any) { 
      setError(e?.message ?? "Erro de comunicação");
      throw e;
    }
    finally { 
      setLoading(false); 
    }
  }, []);

  const fetchCart = useCallback(() => wrap(() => cartRepo.get()), [wrap, cartRepo]);
  const addItem = useCallback((skuId: number, productId?: number) => wrap(() => cartRepo.addItem(skuId, productId)), [wrap, cartRepo]);
  const changeItemQuantity = useCallback((skuId: number, q: number) => wrap(() => cartRepo.setItemQuantity(skuId, q)), [wrap, cartRepo]);
  const removeItem = useCallback((skuId: number) => wrap(() => cartRepo.removeItem(skuId)), [wrap, cartRepo]);
  const clearItems = useCallback(() => wrap(() => cartRepo.clear()), [wrap, cartRepo]);

  useEffect(() => { 
    if (authLoading) {
      return;
    }
    
    fetchCart(); 
    setHasMigrated(false);
  }, [fetchCart, authLoading]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || hasMigrated) return;

    const migrateGuestCart = async () => {
      try {
        const guestCart = loadGuestCart();
        if (!guestCart?.items?.length) {
          setHasMigrated(true);
          return;
        }

        setLoading(true);
        
        for (const item of guestCart.items) {
          try {
            await cartRepo.addItem(item.skuId, item.productId);
          } catch (itemError) {
            console.warn(`Erro ao migrar item ${item.skuId}:`, itemError);
          }
        }

        clearGuestCart();
        setHasMigrated(true);
        
        await fetchCart();
      } catch (e) {
        console.error("Erro ao migrar carrinho local:", e);
        setHasMigrated(true);
      } finally {
        setLoading(false);
      }
    };

    migrateGuestCart();
  }, [isAuthenticated, authLoading, hasMigrated, cartRepo, fetchCart]);

  const value: CartContextType = { 
    cart, 
    loading: loading || authLoading,
    error, 
    fetchCart, 
    changeItemQuantity, 
    addItem, 
    removeItem, 
    clearItems 
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};