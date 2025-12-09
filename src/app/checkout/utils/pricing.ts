export const applyDiscounts = (value: number, couponPercentage?: number): number => {
    if (!value || isNaN(value)) return 0;
    
    if (couponPercentage && couponPercentage > 0) {
        return value * (1 - couponPercentage / 100);
    }
    return value;
};

export const applyPixDiscount = (value: number, pixDiscount: number, couponPercentage?: number): number => {
    if (!value || isNaN(value)) return 0;
    if (!pixDiscount) return value;

    const afterCoupon = couponPercentage && couponPercentage > 0
        ? value * (1 - couponPercentage / 100)
        : value;
    
    return afterCoupon * (1 - pixDiscount / 100);
};

export const formatPrice = (price: number): string => {
    if (isNaN(price) || price === null || price === undefined) return '0,00';
    return price.toFixed(2).replace('.', ',');
};

export const getProductPrice = (product: any, item: any): number => {
    if (!product || !item) return 0;
    
    const quantity = item.quantity || item.qty || 1;
    const price = product.price ?? product.pro_precovenda ?? product.pro_valorultimacompra ?? 0;
    
    return (typeof price === 'string' ? parseFloat(price) : price) * quantity;
};
