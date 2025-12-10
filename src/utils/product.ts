import HeadphoneImg from '@/assets/img/headphone.png';
import NoImage from '@/assets/img/noimage.png';
import { Product } from '@/api/products/types/product';

// ============================================================================
// NORMALIZAÇÃO DE PRODUTOS
// ============================================================================

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
        if (activeSku && activeSku.price) {
            normalized.pro_precovenda = activeSku.price;
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

/**
 * Normaliza uma lista de produtos
 */
export function normalizeProducts(products: Product[]): Product[] {
    if (!Array.isArray(products)) return products;
    
    return products.map(product => normalizeProduct(product));
}

// ============================================================================
// FUNÇÕES DE IMAGEM
// ============================================================================

/**
 * Obtém a URL da imagem principal do produto
 * Suporta tanto a estrutura nova quanto a antiga da API
 */
export function getProductImage(product: any): string {
    // Nova estrutura: usar a imagem principal ou a primeira imagem
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        const mainImage = product.images.find((img: any) => img.main) || product.images[0];
        if (mainImage) {
            return mainImage.standardUrl || mainImage.originalImage || mainImage.url || NoImage.src;
        }
    }
    
    // Compatibilidade: estrutura antiga
    if (product?.imagens && Array.isArray(product.imagens) && product.imagens.length > 0) {
        return product.imagens[0].url || NoImage.src;
    }

    if (product?.pro_imagem) {
        return product.pro_imagem;
    }
    
    return NoImage.src;
}

/**
 * Obtém a imagem de um item do carrinho (que tem estrutura item.sku.product)
 */
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

/**
 * Obtém o nome/título do produto
 */
export function getProductName(product: any): string {
    return product?.title || product?.name || product?.pro_descricao || 'Produto';
}

/**
 * Obtém o título de um item do carrinho
 */
export function getCartItemTitle(item: any): string {
    return item?.sku?.product?.title || item?.sku?.product?.name || 'Produto';
}

// ============================================================================
// FUNÇÕES DE SKU E CATEGORIA
// ============================================================================

/**
 * Obtém o SKU/código do produto
 */
export function getProductSkuCode(item: any): string {
    return item?.sku?.partnerId || item?.sku?.id || item?.sku?.ean || 'Sem referência';
}

/**
 * Obtém a categoria do produto
 */
export function getProductCategory(item: any): string | null {
    return item?.sku?.product?.category?.name || item?.category?.name || null;
}

/**
 * Obtém o primeiro SKU ativo de um produto
 */
export function getActiveSku(product: Product): any | null {
    if (!product?.skus || product.skus.length === 0) return null;
    return product.skus.find(sku => sku.active) || product.skus[0] || null;
}

// ============================================================================
// FUNÇÕES DE PREÇO
// ============================================================================

/**
 * Obtém o preço formatado do produto
 * Suporta tanto a estrutura nova (com SKUs) quanto a antiga
 */
export function getProductPrice(product: any): string {
    // Nova estrutura: usar o preço do primeiro SKU ativo
    if (product?.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        const activeSku = product.skus.find((sku: any) => sku.active) || product.skus[0];
        if (activeSku?.price && !isNaN(Number(activeSku.price))) {
            return `R$ ${formatPrice(Number(activeSku.price))}`;
        }
    }
    
    // Compatibilidade: usar campos antigos
    if (product?.pro_precovenda && !isNaN(Number(product.pro_precovenda))) {
        return `R$ ${formatPrice(Number(product.pro_precovenda))}`;
    }
    
    return 'Preço não disponível';
}

/**
 * Obtém o preço de um item do carrinho (SKU específico)
 */
export function getCartItemPrice(item: any): number {
    const price = item?.sku?.price || 0;
    return price * (item?.quantity || 1);
}

/**
 * Formata um número como preço brasileiro (0,00)
 */
export function formatPrice(price: number): string {
    if (isNaN(price) || price === null || price === undefined) {
        return '0,00';
    }
    return price.toFixed(2).replace('.', ',');
}

// ============================================================================
// FUNÇÕES DE ESTOQUE
// ============================================================================

/**
 * Verifica se o produto tem estoque disponível
 */
export function hasStock(product: any): boolean {
    const sku = getActiveSku(product);
    return sku && sku.amount > 0;
}

/**
 * Verifica se um produto tem estoque disponível (mais robusto)
 */
export function hasProductStock(product: Product): boolean {
    if (!product) return false;

    // Verificar se há SKUs ativos com estoque
    if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
        return product.skus.some(sku => sku.active && sku.amount > 0);
    }

    return false;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Limita o texto a um número máximo de caracteres
 */
export function truncateText(text: string | undefined, maxLength: number = 36): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
