import { CartRepo } from "../ports/cart-repo";
import { getCartAPI, addItemAPI, updateItemQuantityAPI, removeItemAPI, clearCartAPI } from "../services/cart-service";
import { Cart } from "../types/Cart";
export class ApiCartRepo implements CartRepo {
  async get(): Promise<Cart> {
    return await getCartAPI();
  }

  async addItem(skuId: number): Promise<Cart> {
    return await addItemAPI(skuId);
  }

  async setItemQuantity(skuId: number, quantity: number): Promise<Cart> {
    return await updateItemQuantityAPI(skuId, quantity);
  }

  async removeItem(skuId: number): Promise<Cart> {
    return await removeItemAPI(skuId);
  }

  async clear(): Promise<Cart> {
    return await clearCartAPI();
  }
}