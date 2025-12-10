export interface ShippingService {
    serviceName: string;
    price: number;
    deliveryTime: number;
}

export interface ShippingResponse {
    success: boolean;
    data?: {
        availableServices: ShippingService[];
    };
    message?: string;
}

export interface ShippingProductItem {
    id: number;
    produto_id: number;
    quantity: number;
}

