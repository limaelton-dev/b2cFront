import { get } from '../../http';
import type { Order, OrderDetails, OrdersFilter } from '../types/order';

export async function fetchOrders(filter?: OrdersFilter): Promise<Order[]> {
    const params = new URLSearchParams();
    
    if (filter?.status) {
        params.set('status', filter.status);
    }
    if (filter?.marketplace) {
        params.set('marketplace', filter.marketplace);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    return get<Order[]>(url);
}

export async function fetchOrderById(orderId: number): Promise<OrderDetails> {
    return get<OrderDetails>(`/orders/${orderId}`);
}
