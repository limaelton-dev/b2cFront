import { get, post } from '../../http';

const ORIGIN_ZIP_CODE = "85010100";

export interface ShippingCalculationResult {
    serviceName: string;
    price: number;
    deliveryTime: number;
}

export interface ShippingResponse {
    success: boolean;
    data?: {
        availableServices?: ShippingCalculationResult[];
        totalPreco?: number;
        maiorPrazo?: number;
    };
    message?: string;
}

export interface ShippingProduct {
    productId: number;
    quantity: number;
}

export async function calculateShippingForAuthenticatedUser(zipCode: string): Promise<ShippingResponse> {
    try {
        const cleanZipCode = zipCode.replace(/\D/g, '');
        const response = await get<ShippingResponse>(`/cart/shipping?zipCode=${cleanZipCode}&shippingType=ALL`);
        return response;
    } catch (error) {
        console.error('Error calculating shipping for authenticated user:', error);
        return { success: false, message: 'Erro ao calcular frete' };
    }
}

export async function calculateShippingForGuest(zipCode: string, products: ShippingProduct[]): Promise<ShippingResponse> {
    try {
        const cleanZipCode = zipCode.replace(/\D/g, '');
        
        const requestBody = {
            originZipCode: ORIGIN_ZIP_CODE,
            destinationZipCode: cleanZipCode,
            products: products.map(p => ({
                productId: Number(p.productId),
                quantity: Number(p.quantity)
            })),
            shippingType: "ALL"
        };
        
        const response = await post<ShippingResponse>('/shipping/calculate-by-ids', requestBody);
        return response;
    } catch (error) {
        console.error('Error calculating shipping for guest:', error);
        return { success: false, message: 'Erro ao calcular frete' };
    }
}

