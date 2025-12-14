import HeadphoneImg from '@/assets/img/headphone.png';
import NoImage from '@/assets/img/noimage.png';
import { Product, ProductSkuNew } from '@/api/products/types/product';

// ============================================================================
// NORMALIZAÇÃO DE PRODUTOS
// ============================================================================

export function normalizeProduct(product: Product): Product {
    if (!product) return product;

    const normalized = { ...product };

    if (product.title && !normalized.name) {
        normalized.name = product.title;
    }

    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0 && !normalized.pro_precovenda) {
        const activeSku = getFirstAvailableSku(product);
        if (activeSku) {
            normalized.pro_precovenda = activeSku.finalPrice ?? activeSku.price;
        }
    }

    if (product.images && Array.isArray(product.images) && product.images.length > 0 && !normalized.pro_imagem) {
        const mainImage = product.images.find(img => img.main) || product.images[0];
        if (mainImage) {
            normalized.pro_imagem = mainImage.standardUrl || mainImage.originalImage || mainImage.url;
        }
    }

    if (product.images && Array.isArray(product.images) && !normalized.imagens) {
        normalized.imagens = product.images.map(img => ({
            id: img.id,
            productId: img.productId,
            url: img.standardUrl || img.originalImage || img.url,
            main: img.main,
            status: img.status ?? 'ACTIVE',
            standardWidth: img.standardWidth ?? null,
            standardHeight: img.standardHeight ?? null,
            originalWidth: img.originalWidth ?? null,
            originalHeight: img.originalHeight ?? null,
            originalImage: img.originalImage ?? null,
            standardUrl: img.standardUrl ?? null,
        }));
    }

    return normalized;
}

export function normalizeProducts(products: Product[]): Product[] {
    if (!Array.isArray(products)) return products;
    return products.map(product => normalizeProduct(product));
}

// ============================================================================
// FUNÇÕES DE IMAGEM
// ============================================================================

export function getProductImage(product: any): string {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        const mainImage = product.images.find((img: any) => img.main) || product.images[0];
        if (mainImage) {
            return mainImage.standardUrl || mainImage.originalImage || mainImage.url || NoImage.src;
        }
    }
    
    if (product?.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
        return product.imagens[0].url || NoImage.src;
    }

    if (product?.pro_imagem) {
        return product.pro_imagem;
    }
    
    return NoImage.src;
}

export function getCartItemImage(item: any): any {
    const sku = item?.sku;
    if (!sku) return HeadphoneImg;
    
    const product = sku.product;
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        const mainImage = product.images.find((img: any) => img.main) || product.images[0];
        return mainImage?.standardUrl || mainImage?.originalImage || mainImage?.url || HeadphoneImg;
    }
    
    return HeadphoneImg;
}

// ============================================================================
// FUNÇÕES DE NOME/TÍTULO
// ============================================================================

export function getProductName(product: any): string {
    return product?.title || product?.name || product?.pro_descricao || 'Produto';
}

export function getCartItemTitle(item: any): string {
    return item?.sku?.product?.title || item?.sku?.product?.name || item?.sku?.title || 'Produto';
}

// ============================================================================
// FUNÇÕES DE SKU E CATEGORIA
// ============================================================================

export function getProductSkuCode(item: any): string {
    return item?.sku?.marketplacePartnerId || item?.sku?.partnerId || item?.sku?.id || item?.sku?.ean || 'Sem referência';
}

export function getProductCategory(item: any): string | null {
    return item?.sku?.product?.category?.name || item?.category?.name || null;
}

function getFirstAvailableSku(product: Product): ProductSkuNew | null {
    if (!product?.skus || product.skus.length === 0) return null;
    
    const withStock = product.skus.find(sku => {
        const stock = sku.marketplaceStock ?? sku.amount ?? 0;
        return stock > 0;
    });
    
    return withStock || product.skus[0] || null;
}

export function getActiveSku(product: Product): ProductSkuNew | null {
    return getFirstAvailableSku(product);
}

export function getSkuById(product: Product, skuId: number | null): ProductSkuNew | null {
    if (!product?.skus || !skuId) return getActiveSku(product);
    return product.skus.find(sku => sku.id === skuId) || getActiveSku(product);
}

// ============================================================================
// FUNÇÕES DE PREÇO
// ============================================================================

export function getSkuFinalPrice(sku: ProductSkuNew | null): number | null {
    if (!sku) return null;
    return sku.finalPrice ?? sku.price ?? null;
}

export function getSkuOriginalPrice(sku: ProductSkuNew | null): number | null {
    if (!sku) return null;
    return sku.originalPrice ?? sku.finalPrice ?? sku.price ?? null;
}

export function getSkuDiscount(sku: ProductSkuNew | null): { hasDiscount: boolean; percentage: number } {
    if (!sku) return { hasDiscount: false, percentage: 0 };
    
    if (sku.hasDiscount) {
        const original = sku.originalPrice ?? 0;
        const final = sku.finalPrice ?? 0;
        if (original > 0 && final < original) {
            const percentage = Math.round(((original - final) / original) * 100);
            return { hasDiscount: true, percentage };
        }
    }
    
    return { hasDiscount: false, percentage: 0 };
}

/** @deprecated usar getSkuFinalPrice */
export function getSkuPrice(sku: any): number | null {
    if (!sku) return null;
    return sku?.finalPrice ?? sku?.price ?? null;
}

export function getFirstSkuPrice(product?: Product): number | null {
    if (!product) return null;
    const sku = getActiveSku(product);
    return getSkuFinalPrice(sku);
}

export function getProductFinalPrice(product: any): number | null {
    if (product?.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        const activeSku = getFirstAvailableSku(product);
        if (activeSku) {
            return activeSku.finalPrice ?? activeSku.price ?? null;
        }
    }
    return product?.pro_precovenda ?? null;
}

export function getProductOriginalPrice(product: any): number | null {
    if (product?.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        const activeSku = getFirstAvailableSku(product);
        if (activeSku) {
            return activeSku.originalPrice ?? activeSku.finalPrice ?? activeSku.price ?? null;
        }
    }
    return product?.pro_precovenda ?? null;
}

export function getProductDiscountInfo(product: any): { hasDiscount: boolean; percentage: number } {
    if (product?.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        const activeSku = getFirstAvailableSku(product);
        return getSkuDiscount(activeSku);
    }
    return { hasDiscount: false, percentage: 0 };
}

export function getProductPrice(product: any): string {
    const finalPrice = getProductFinalPrice(product);
    if (finalPrice !== null && !isNaN(finalPrice)) {
        return `R$ ${formatPrice(finalPrice)}`;
    }
    return 'Preço não disponível';
}

export function getProductPriceWithDiscount(product: any): { 
    finalPrice: string; 
    originalPrice: string | null; 
    hasDiscount: boolean;
    discountPercentage: number;
} {
    const final = getProductFinalPrice(product);
    const original = getProductOriginalPrice(product);
    const discountInfo = getProductDiscountInfo(product);
    
    return {
        finalPrice: final !== null ? `R$ ${formatPrice(final)}` : 'Preço não disponível',
        originalPrice: discountInfo.hasDiscount && original !== null ? `R$ ${formatPrice(original)}` : null,
        hasDiscount: discountInfo.hasDiscount,
        discountPercentage: discountInfo.percentage
    };
}

export function getCartItemPrice(item: any): number {
    const sku = item?.sku;
    const price = sku?.finalPrice ?? sku?.price ?? 0;
    return price * (item?.quantity || 1);
}

export function getCartItemUnitPrice(item: any): number {
    const sku = item?.sku;
    return sku?.finalPrice ?? sku?.price ?? 0;
}

export function formatPrice(price: number): string {
    if (isNaN(price) || price === null || price === undefined) {
        return '0,00';
    }
    return price.toFixed(2).replace('.', ',');
}

export function formatPriceBRL(price: number): string {
    if (isNaN(price) || price === null || price === undefined) {
        return 'R$ 0,00';
    }
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// ============================================================================
// FUNÇÕES DE ESTOQUE
// ============================================================================

export function getSkuStock(sku: ProductSkuNew | null): number {
    if (!sku) return 0;
    return sku.marketplaceStock ?? sku.amount ?? 0;
}

export function hasStock(product: any): boolean {
    const sku = getActiveSku(product);
    return getSkuStock(sku) > 0;
}

export function hasProductStock(product: Product): boolean {
    if (!product) return false;

    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        return product.skus.some(sku => getSkuStock(sku) > 0);
    }

    return false;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

export function truncateText(text: string | undefined, maxLength: number = 36): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
