export interface CreditCardPaymentRequest {
    // Opção 1: Pagamento com token (cartão novo)
    token?: string;
    // Opção 2: Pagamento com cartão salvo
    savedCardId?: number;
    // Dados do cartão (apenas para fallback se backend não suportar token)
    cardNumber?: string;
    holder: string;
    expirationDate?: string;
    securityCode?: string;
    brand: string;
    description: string;
    installments: number;
    address: string;
    customerData: {
        name: string;
        email: string;
        cpf: string;
    };
}

export interface PixPaymentRequest {
    amount: number;
    description: string;
    address: string;
    customerData: {
        name: string;
        email: string;
        cpf: string;
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

