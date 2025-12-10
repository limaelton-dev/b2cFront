export interface CreditCardPaymentRequest {
    cardNumber: string;
    holder: string;
    expirationDate: string;
    securityCode: string;
    brand: string;
    description: string;
    installments: number;
    address: string;
    customerData: {
        name: string;
        email: string;
    };
}

export interface PixPaymentRequest {
    amount: number;
    description: string;
    address: string;
    customerData: {
        name: string;
        email: string;
    };
}

export interface PaymentResponse {
    success: boolean;
    message?: string;
    transactionId?: string;
    order?: {
        orderId: string;
    };
    qrCode?: string;
    pixKey?: string;
}

