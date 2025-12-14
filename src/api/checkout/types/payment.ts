export type PaymentType = 'pix' | 'credit-card' | 'debit-card';
export type PaymentGateway = 'mercado-pago' | 'cielo';

export interface PayerIdentification {
    type: 'CPF' | 'CNPJ';
    number: string;
}

export interface PaymentCard {
    token: string;
    brand: string;
}

export interface PixPaymentRequest {
    orderId: number;
    description?: string;
    payerIdentification: PayerIdentification;
}

export interface CreditCardPaymentRequest {
    orderId: number;
    description?: string;
    card: PaymentCard;
    installments: number;
    payerIdentification: PayerIdentification;
}

export interface DebitCardPaymentRequest {
    orderId: number;
    card: PaymentCard;
}

export interface PixData {
    qrCode: string;
    qrCodeBase64: string;
    expirationDate: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    status: 'pending' | 'approved' | 'rejected' | 'in_process';
    paymentMethod: 'pix' | 'credit_card' | 'debit_card';
    amount: number;
    message?: string;
    pixData?: PixData;
    installments?: number;
    installmentAmount?: number;
}

/** @deprecated usar PixPaymentRequest, CreditCardPaymentRequest ou DebitCardPaymentRequest */
export interface LegacyCreditCardPaymentRequest {
    token?: string;
    savedCardId?: number;
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

/** @deprecated usar PixPaymentRequest */
export interface LegacyPixPaymentRequest {
    amount: number;
    description: string;
    address: string;
    customerData: {
        name: string;
        email: string;
        cpf: string;
    };
}

/** @deprecated usar PaymentResponse */
export interface LegacyPaymentResponse {
    success: boolean;
    message?: string;
    transactionId?: string;
    order?: {
        orderId: string;
    };
    qrCode?: string;
    pixKey?: string;
}
