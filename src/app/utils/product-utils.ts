import { Product } from '../api/products/types/product';

/**
 * Normaliza um produto vindo do backend para compatibilidade com o frontend
 * Adiciona campos de compatibilidade baseados na nova estrutura
 */
export function normalizeProduct(product: Product): Product {
    if (!product) return product;

    const normalized = { ...product };

    // Adicionar campo 'name' como alias para 'title'
    if (product.title && !normalized.name) {
        normalized.name = product.title;
    }

    // Calcular preço de venda do primeiro SKU ativo
    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0 && !normalized.pro_precovenda) {
        const activeSku = product.skus.find(sku => sku.active) || product.skus[0];
        if (activeSku && activeSku.sellPrice) {
            normalized.pro_precovenda = activeSku.sellPrice;
        }
    }

    // Definir imagem principal
    if (product.images && Array.isArray(product.images) && product.images.length > 0 && !normalized.pro_imagem) {
        const mainImage = product.images.find(img => img.main) || product.images[0];
        if (mainImage) {
            normalized.pro_imagem = mainImage.standardUrl || mainImage.originalImage || mainImage.url;
        }
    }

    // Converter imagens para formato antigo para compatibilidade
    if (product.images && Array.isArray(product.images) && !normalized.imagens) {
        normalized.imagens = product.images.map(img => ({
            id: img.id,
            productId: img.productId,
            url: img.standardUrl || img.originalImage || img.url,
            isMain: img.main
        }));
    }

    return normalized;
}

/**
 * Normaliza uma lista de produtos
 */
export function normalizeProducts(products: Product[]): Product[] {
    if (!Array.isArray(products)) return products;
    
    return products.map(product => normalizeProduct(product));
}

/**
 * Obtém o preço de venda de um produto
 */
export function getProductSellPrice(product: Product): number {
    if (!product) return 0;

    // Nova estrutura: usar o preço do primeiro SKU ativo
    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        const activeSku = product.skus.find(sku => sku.active) || product.skus[0];
        if (activeSku && activeSku.sellPrice) {
            return Number(activeSku.sellPrice);
        }
    }

    // Compatibilidade: usar campos antigos
    if (product.pro_precovenda) {
        return Number(product.pro_precovenda);
    }

    return 0;
}

/**
 * Obtém a imagem principal de um produto
 */
export function getProductMainImage(product: Product): string {
    if (!product) return '';

    // Nova estrutura: usar a imagem principal ou a primeira imagem
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const mainImage = product.images.find(img => img.main) || product.images[0];
        if (mainImage) {
            return mainImage.standardUrl || mainImage.originalImage || mainImage.url;
        }
    }

    // Compatibilidade: estrutura antiga
    if (product.imagens && product.imagens.length > 0) {
        return product.imagens[0].url;
    }

    if (product.pro_imagem) {
        return product.pro_imagem;
    }

    return '';
}

/**
 * Obtém o nome/título de um produto
 */
export function getProductName(product: Product): string {
    if (!product) return '';
    
    return product.title || product.name || '';
}

/**
 * Verifica se um produto tem estoque disponível
 */
export function hasProductStock(product: Product): boolean {
    if (!product) return false;

    // Nova estrutura: verificar se há SKUs ativos com estoque
    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        return product.skus.some(sku => sku.active && sku.amount > 0);
    }

    // Compatibilidade: verificar campo antigo
    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        return product.skus.some(sku => sku.active && sku.amount > 0);
    }

    return false; // Assumir que não tem estoque se não houver informação
}
