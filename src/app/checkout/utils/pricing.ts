/**
 * Funções utilitárias para cálculos de preço e descontos
 */

/**
 * Aplica descontos a um valor base
 * @param value - Valor base para aplicar desconto
 * @param couponPercentage - Percentual de desconto do cupom
 * @returns Valor com desconto aplicado
 */
export const applyDiscounts = (value: number, couponPercentage?: number): number => {
    if (!value || isNaN(value)) return 0;
    
    let result = value; 
    if (couponPercentage && couponPercentage > 0)
        result = value - ((couponPercentage / 100) * value);

    return result;
};

/**
 * Aplica desconto de cupom a um valor
 * @param value - Valor base para aplicar desconto
 * @param couponPercentage - Percentual de desconto do cupom
 * @returns Valor com desconto de cupom aplicado
 */
export const applyCouponDiscount = (value: number, couponPercentage?: number): number => {
    if (!value || isNaN(value)) return 0;
    
    if (couponPercentage && couponPercentage > 0)
        return value - ((couponPercentage / 100) * value);

    return value;
};

/**
 * Aplica desconto PIX a um valor (pode incluir desconto de cupom também)
 * @param value - Valor base para aplicar desconto
 * @param pixDiscount - Percentual de desconto para pagamento PIX
 * @param couponPercentage - Percentual de desconto do cupom
 * @returns Valor com desconto PIX (e cupom, se aplicável) aplicado
 */
export const applyPixDiscount = (value: number, pixDiscount: number, couponPercentage?: number): number => {
    if (!value || isNaN(value)) return 0;
    
    if (!pixDiscount) return value;

    if (couponPercentage && couponPercentage > 0)
        return (value - ((couponPercentage / 100) * value)) - ((pixDiscount / 100) * value);
    else
        return value - ((pixDiscount / 100) * value);
};

/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param price - Valor a ser formatado
 * @returns String formatada (ex: 10,50)
 */
export const formatPrice = (price: number): string => {
    if (isNaN(price) || price === null || price === undefined) {
        return '0,00';
    }
    return price.toFixed(2).replace('.', ',');
};

/**
 * Calcula o preço do produto com base na quantidade
 * @param product - Objeto do produto
 * @param item - Item do carrinho
 * @returns Preço total do item
 */
export const getProductPrice = (product: any, item: any): number => {
    if (!product || !item) return 0;
    
    const quantity = item.quantity || item.qty || 1;
    
    // Nova API - campo price
    if (product.price && !isNaN(parseFloat(product.price))) {
        return parseFloat(product.price) * quantity;
    }
    
    // API antiga - campo pro_precovenda
    if (product.pro_precovenda && !isNaN(product.pro_precovenda)) {
        return product.pro_precovenda * quantity;
    }
    
    // Se não tiver preço de venda, verificar se tem preço de última compra
    if (product.pro_valorultimacompra && !isNaN(product.pro_valorultimacompra)) {
        return product.pro_valorultimacompra * quantity;
    }
    
    // Se nenhum preço válido for encontrado, retornar 0
    return 0;
}; 