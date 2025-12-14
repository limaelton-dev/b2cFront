import { get, post } from '../../http';

export interface ShippingCartItem {
    skuId: number;
    partnerId: string;
    quantity: number;
}

export interface ShippingService {
    serviceName: string;
    carrierName: string;
    price: number;
    deliveryDays: number;
    estimatedDeliveryDate: string;
}

export interface ShippingResponse {
    success: boolean;
    zipCode?: string;
    services?: ShippingService[];
    message?: string;
}

export async function calculateShippingForCart(
    destinationZipCode: string,
    items: ShippingCartItem[]
): Promise<ShippingResponse> {
    try {
        const cleanZipCode = destinationZipCode.replace(/\D/g, '');
        
        if (cleanZipCode.length !== 8) {
            return { success: false, message: 'CEP inválido. Deve conter 8 dígitos.' };
        }

        return await post<ShippingResponse>('/shipping/cart', {
            destinationZipCode: cleanZipCode,
            items
        });
    } catch (error) {
        console.error('Erro ao calcular frete para carrinho:', error);
        return { success: false, message: 'Erro ao calcular frete' };
    }
}

export async function calculateShippingForProduct(
    skuId: number,
    destinationZipCode: string,
    partnerId?: string
): Promise<ShippingResponse> {
    try {
        const cleanZipCode = destinationZipCode.replace(/\D/g, '');
        
        if (cleanZipCode.length !== 8) {
            return { success: false, message: 'CEP inválido. Deve conter 8 dígitos.' };
        }

        const params = new URLSearchParams({ destinationZipCode: cleanZipCode });
        if (partnerId) {
            params.append('partnerId', partnerId);
        }

        return await get<ShippingResponse>(`/shipping/product/${skuId}?${params.toString()}`);
    } catch (error) {
        console.error('Erro ao calcular frete para produto:', error);
        return { success: false, message: 'Erro ao calcular frete' };
    }
}
