import { get, post, HttpOptions } from '../../http';
import type { 
    GuestCheckoutRequest,
    GuestCheckoutResponse,
    RegisteredCheckoutRequest,
    RegisteredCheckoutResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    ShippingResponse,
    ShippingProductItem,
    PixPaymentRequest,
    CreditCardPaymentRequest,
    DebitCardPaymentRequest,
    PaymentResponse,
    PaymentGateway
} from '../types';

const ORIGIN_ZIP_CODE = "85010100";
const DEFAULT_GATEWAY: PaymentGateway = 'mercado-pago';

function withIdempotencyKey(idempotencyKey: string): HttpOptions {
    return {
        headers: {
            'X-Idempotency-Key': idempotencyKey
        }
    };
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

export async function processGuestCheckout(data: GuestCheckoutRequest): Promise<GuestCheckoutResponse> {
    return post<GuestCheckoutResponse>('/checkout/guest', data);
}

export async function processRegisteredCheckout(data: RegisteredCheckoutRequest): Promise<RegisteredCheckoutResponse> {
    return post<RegisteredCheckoutResponse>('/checkout/registered', data);
}

export async function createOrder(
    data: CreateOrderRequest, 
    idempotencyKey: string
): Promise<CreateOrderResponse> {
    return post<CreateOrderResponse>('/checkout/order', data, withIdempotencyKey(idempotencyKey));
}

export async function processPixPaymentWithGateway(
    data: PixPaymentRequest,
    idempotencyKey: string,
    gateway: PaymentGateway = DEFAULT_GATEWAY
): Promise<PaymentResponse> {
    return post<PaymentResponse>(
        `/checkout/payment/pix/gateway/${gateway}`,
        data,
        withIdempotencyKey(idempotencyKey)
    );
}

export async function processCreditCardPaymentWithGateway(
    data: CreditCardPaymentRequest,
    idempotencyKey: string,
    gateway: PaymentGateway = DEFAULT_GATEWAY
): Promise<PaymentResponse> {
    return post<PaymentResponse>(
        `/checkout/payment/credit-card/gateway/${gateway}`,
        data,
        withIdempotencyKey(idempotencyKey)
    );
}

export async function processDebitCardPaymentWithGateway(
    data: DebitCardPaymentRequest,
    idempotencyKey: string,
    gateway: PaymentGateway = DEFAULT_GATEWAY
): Promise<PaymentResponse> {
    return post<PaymentResponse>(
        `/checkout/payment/debit-card/gateway/${gateway}`,
        data,
        withIdempotencyKey(idempotencyKey)
    );
}

export async function fetchAvailableGateways(): Promise<string[]> {
    return get<string[]>('/checkout/gateways');
}

export interface GatewayInfo {
    name: string;
    supportedMethods: string[];
}

export async function fetchGatewaysInfo(): Promise<GatewayInfo[]> {
    return get<GatewayInfo[]>('/checkout/gateways/info');
}
