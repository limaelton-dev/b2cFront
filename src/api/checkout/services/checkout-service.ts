import { get, post } from '../../http';
import { 
    CheckoutRequest,
    CheckoutResponse,
    CreditCardPaymentRequest, 
    PixPaymentRequest, 
    PaymentResponse,
    ShippingResponse,
    ShippingProductItem
} from '../types';

const ORIGIN_ZIP_CODE = "85010100";

export async function validateCpf(cpf: string) {
    return post<{ status: number }>('/checkout/validacpf', { cpf });
}

export async function validateEmail(email: string) {
    return post<{ status: number }>('/checkout/validaEmail', { email });
}

export async function calculateShippingAuthenticated(zipCode: string): Promise<ShippingResponse> {
    const cleanZip = zipCode.replace(/\D/g, '');
    return get<ShippingResponse>(`/cart/shipping?zipCode=${cleanZip}&shippingType=ALL`);
}

export async function calculateShippingGuest(zipCode: string, products: ShippingProductItem[]): Promise<ShippingResponse> {
    const cleanZip = zipCode.replace(/\D/g, '');
    return post<ShippingResponse>('/shipping/calculate-by-ids', {
        originZipCode: ORIGIN_ZIP_CODE,
        destinationZipCode: cleanZip,
        products: products.map(p => ({
            productId: Number(p.id || p.produto_id),
            quantity: Number(p.quantity)
        })),
        shippingType: "ALL"
    });
}

export async function processCreditCardPayment(data: CreditCardPaymentRequest): Promise<PaymentResponse> {
    try {
        return await post<PaymentResponse>('/payment/credit-card', data);
    } catch (error: any) {
        return { success: false, message: error?.message || 'Erro ao processar pagamento' };
    }
}

export async function processPixPayment(data: PixPaymentRequest): Promise<PaymentResponse> {
    try {
        return await post<PaymentResponse>('/payment/pix', data);
    } catch (error: any) {
        return { success: false, message: error?.message || 'Erro ao gerar PIX' };
    }
}

export async function processCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return post<CheckoutResponse>('/checkout', data);
}

