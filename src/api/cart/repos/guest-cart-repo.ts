import { CartRepo } from "../ports/cart-repo";
import { Cart, CartItem } from "../types/Cart";
import { loadGuestCart, saveGuestCart, clearGuestCart } from "../../../utils/cart-storage";
import { previewCartDetailsAPI } from "../services/cart-service";

const empty: Cart = { id: "guest", items: [], subtotal: 0 };

/** Carrinho básico salvo no localStorage (apenas IDs e quantidades) */
interface LocalCart {
    items: { skuId: number; productId?: number; quantity: number }[];
}

export class GuestCartRepo implements CartRepo {
    private getLocalSnapshot(): LocalCart {
        const saved = loadGuestCart();
        if (!saved?.items) return { items: [] };
        
        // Extrair apenas os campos necessários para o localStorage
        return {
            items: saved.items.map(item => ({
                skuId: item.skuId,
                productId: item.productId,
                quantity: item.quantity
            }))
        };
    }

    private saveLocal(items: { skuId: number; productId?: number; quantity: number }[]): void {
        saveGuestCart({ id: "guest", items, subtotal: 0 } as Cart);
    }

    /** Busca detalhes enriquecidos via API preview */
    private async getEnriched(items: { skuId: number; productId?: number; quantity: number }[]): Promise<Cart> {
        if (items.length === 0) {
            return { ...empty };
        }
        
        try {
            return await previewCartDetailsAPI(items);
        } catch (error) {
            console.error("Erro ao buscar preview do carrinho:", error);
            // Fallback: retorna carrinho básico sem enriquecimento
            return { 
                id: "guest", 
                items: items.map(item => ({ ...item, id: `guest-${item.skuId}` })), 
                subtotal: 0 
            };
        }
    }

    async get(): Promise<Cart> {
        const local = this.getLocalSnapshot();
        return await this.getEnriched(local.items);
    }

    async addItem(skuId: number, productId?: number): Promise<Cart> {
        const local = this.getLocalSnapshot();
        const item = local.items.find(i => i.skuId === skuId);

        if (item) {
            item.quantity += 1;
        } else {
            local.items.push({ skuId, productId, quantity: 1 });
        }

        this.saveLocal(local.items);
        return await this.getEnriched(local.items);
    }

    async setItemQuantity(skuId: number, quantity: number): Promise<Cart> {
        const local = this.getLocalSnapshot();
        const item = local.items.find(i => i.skuId === skuId);

        if (!item) {
            return await this.getEnriched(local.items);
        }

        if (quantity <= 0) {
            local.items = local.items.filter(i => i.skuId !== skuId);
        } else {
            item.quantity = quantity;
        }

        this.saveLocal(local.items);
        return await this.getEnriched(local.items);
    }

    async removeItem(skuId: number): Promise<Cart> {
        const local = this.getLocalSnapshot();
        local.items = local.items.filter(i => i.skuId !== skuId);

        this.saveLocal(local.items);
        return await this.getEnriched(local.items);
    }

    async clear(): Promise<Cart> {
        clearGuestCart();
        return { ...empty };
    }
}
