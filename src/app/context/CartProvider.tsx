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
  const { isAuthenticated } = useAuth();
  const cartRepo: CartRepo = useMemo(() => makeCartRepo(isAuthenticated), [isAuthenticated]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
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
      throw e; // Relançar erro para que o componente possa tratá-lo
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

  // Buscar carrinho ao montar ou quando mudar a autenticação
  useEffect(() => { 
    fetchCart(); 
    setHasMigrated(false); // Reset flag ao trocar de repo
  }, [fetchCart]);

  // Migrar carrinho local para servidor após login
  useEffect(() => {
    if (!isAuthenticated || hasMigrated) return;

    const migrateGuestCart = async () => {
      try {
        const guestCart = loadGuestCart();
        if (!guestCart?.items?.length) {
          setHasMigrated(true);
          return;
        }

        setLoading(true);
        
        // Adicionar cada item do carrinho local ao servidor
        for (const item of guestCart.items) {
          try {
            await cartRepo.addItem(item.skuId, item.productId);
          } catch (itemError) {
            console.warn(`Erro ao migrar item ${item.skuId}:`, itemError);
            // Continua com os próximos itens mesmo se um falhar
          }
        }

        // Limpar carrinho local após migração
        clearGuestCart();
        setHasMigrated(true);
        
        // Recarregar carrinho do servidor (já enriquecido)
        await fetchCart();
      } catch (e) {
        console.error("Erro ao migrar carrinho local:", e);
        setHasMigrated(true); // Evitar loop infinito
      } finally {
        setLoading(false);
      }
    };

    migrateGuestCart();
  }, [isAuthenticated, hasMigrated, cartRepo, fetchCart]);

  const value: CartContextType = { cart, loading, error, fetchCart, changeItemQuantity, addItem, removeItem, clearItems };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
