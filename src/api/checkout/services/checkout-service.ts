import { get, post, HttpOptions } from '../../http';
import type { 
    GuestCheckoutRequest,
    GuestCheckoutResponse,
    RegisteredCheckoutRequest,
    RegisteredCheckoutResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    PixPaymentRequest,
    CreditCardPaymentRequest,
    DebitCardPaymentRequest,
    PaymentResponse,
    PaymentGateway
} from '../types';

const DEFAULT_GATEWAY: PaymentGateway = 'mercado-pago';

function withIdempotencyKey(idempotencyKey: string): HttpOptions {
    return {
        headers: {
            'X-Idempotency-Key': idempotencyKey
        }
    };
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
