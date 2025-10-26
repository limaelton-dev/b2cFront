export type OrderStatusEnum = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderType {
    id: number;
    profile_id: number;
    total_price: number;
    status: OrderStatusEnum;
    full_address: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    discount?: number;
    coupon_id?: number;
    total_price: number;
}

export interface OrderPayment {
}


