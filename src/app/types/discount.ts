export type DiscountUnitEnum = 'percentage' | 'fixed' | 'free_shipping';

export type DiscountScopeEnum = 'product' | 'order' | 'shipping';

export interface Discount {
    id: number;
    name: string;
    code?: string;
    unit: DiscountUnitEnum;
    value: number | null;
    scope: DiscountScopeEnum;
    combinable: boolean;
    min_quantity?: number | null;
    first_purchase_only: boolean;
    start_date: string;
    end_date: string;
}

export interface DiscountProduct extends Discount {
    product_id: number;
}

export interface DiscountOrder extends Discount {
    minimumOrderValue?: number;
}
