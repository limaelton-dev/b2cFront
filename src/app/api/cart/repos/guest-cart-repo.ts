
import { CartRepo } from "../ports/cart-repo";
import { Cart } from "../types/Cart";
import { loadGuestCart, saveGuestCart, clearGuestCart } from "../../../utils/cart-storage";

const empty: Cart = { id: "guest", items: [], subtotal: 0, total: 0 };

export class GuestCartRepo implements CartRepo {
    private getSnapshot(): Cart {
        return loadGuestCart() ?? { ...empty };
    }

    async get(): Promise<Cart> {
        return this.getSnapshot();
    }

    async addItem(skuId: number): Promise<Cart> {
        const cart = this.getSnapshot();
        const item = cart.items.find(i => i.skuId === skuId);

        if (item) {
            item.quantity += 1;
        } else {
            cart.items.push({ skuId, quantity: 1 });
        }

        saveGuestCart(cart);
        return cart;
    }

    async setItemQuantity(skuId: number, quantity: number): Promise<Cart> {
        const cart = this.getSnapshot();
        const item = cart.items.find(i => i.skuId === skuId);

        if (!item) {
            return cart;
        }
        if (quantity <= 0) {
            cart.items = cart.items.filter(i => i.skuId !== skuId);
        } else {
            item.quantity = quantity;
        }

        saveGuestCart(cart);
        return cart;
    }

    async removeItem(skuId: number): Promise<Cart> {
        const cart = this.getSnapshot();
        cart.items = cart.items.filter(i => i.skuId !== skuId);

        saveGuestCart(cart);
        return cart;
    }

    async clear(): Promise<Cart> {
        clearGuestCart();
        return { ...empty };
    }
}
