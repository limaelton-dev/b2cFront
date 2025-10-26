// src/utils/cartStorage.ts
import { Cart } from '../api/cart/types/Cart';

const STORAGE_KEY = 'guest_cart';

/**
 * [UTILITY SERVICE] Salva o carrinho no Local Storage.
 * @param cart O objeto de carrinho a ser salvo.
 */
export function saveGuestCart(cart: Cart): void {
    try {
        const serializedCart = JSON.stringify(cart);
        // Em um projeto real, você usaria 'js-cookie' se precisasse de persistência
        // entre sessões de navegador, mas Local Storage é mais simples para o exemplo.
        localStorage.setItem(STORAGE_KEY, serializedCart);
    } catch (e) {
        console.error("Falha ao salvar carrinho no storage.", e);
    }
}

/**
 * [UTILITY SERVICE] Carrega o carrinho do Local Storage.
 * @returns O objeto de carrinho ou null.
 */
export function loadGuestCart(): Cart | null {
    try {
        const serializedCart = localStorage.getItem(STORAGE_KEY);
        if (serializedCart === null) {
            return null;
        }
        return JSON.parse(serializedCart) as Cart;
    } catch (e) {
        console.error("Falha ao carregar carrinho do storage.", e);
        return null;
    }
}

/**
 * [UTILITY SERVICE] Limpa o carrinho no Local Storage.
 */
export function clearGuestCart(): void {
    localStorage.removeItem(STORAGE_KEY);
}