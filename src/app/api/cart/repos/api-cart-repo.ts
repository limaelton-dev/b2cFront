import { CartRepo } from "../ports/cart-repo";
import { getCartAPI, getCartDetailsAPI, addItemAPI, updateItemQuantityAPI, removeItemAPI, clearCartAPI } from "../services/cart-service";
import { Cart } from "../types/Cart";

export class ApiCartRepo implements CartRepo {
  async get(): Promise<Cart> {
    return await getCartDetailsAPI();
  }

  async addItem(skuId: number, productId?: number): Promise<Cart> {
    await addItemAPI(skuId, productId);
    // Retorna carrinho enriquecido após adicionar
    return await getCartDetailsAPI();
  }

  async setItemQuantity(skuId: number, quantity: number): Promise<Cart> {
    // Buscar carrinho básico para obter o itemId
    const basicCart = await getCartAPI();
    const item = basicCart.items.find(i => i.skuId === skuId);
    
    if (!item) {
      console.error('Item com skuId', skuId, 'não encontrado. Itens disponíveis:', basicCart.items.map(i => ({ id: i.id, skuId: i.skuId })));
      throw new Error("Item não encontrado no carrinho");
    }

    if (!item.id) {
      console.error('Item encontrado mas sem ID:', item);
      throw new Error("Item não possui ID válido");
    }

    const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
    console.log('Atualizando quantidade:', { skuId, itemId, quantity });
    
    await updateItemQuantityAPI(itemId, quantity);
    
    // Retorna carrinho enriquecido após atualizar
    return await getCartDetailsAPI();
  }

  async removeItem(skuId: number): Promise<Cart> {
    // Buscar carrinho básico para obter o itemId
    const basicCart = await getCartAPI();
    const item = basicCart.items.find(i => i.skuId === skuId);
    
    if (!item) {
      console.error('Item com skuId', skuId, 'não encontrado. Itens disponíveis:', basicCart.items.map(i => ({ id: i.id, skuId: i.skuId })));
      throw new Error("Item não encontrado no carrinho");
    }

    if (!item.id) {
      console.error('Item encontrado mas sem ID:', item);
      throw new Error("Item não possui ID válido");
    }

    const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
    console.log('Removendo item:', { skuId, itemId });
    
    await removeItemAPI(itemId);
    
    // Retorna carrinho enriquecido após remover
    return await getCartDetailsAPI();
  }

  async clear(): Promise<Cart> {
    await clearCartAPI();
    // Retorna carrinho enriquecido (vazio) após limpar
    return await getCartDetailsAPI();
  }
}