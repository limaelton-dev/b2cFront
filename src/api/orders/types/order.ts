export enum OrderStatus {
    INCOMPLETE = 'INCOMPLETE',
    PENDING = 'PENDING',
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    PAID_WAITING_SHIP = 'PAID_WAITING_SHIP',
    INVOICED = 'INVOICED',
    PAID_WAITING_DELIVERY = 'PAID_WAITING_DELIVERY',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERY_ISSUE = 'DELIVERY_ISSUE',
    CONCLUDED = 'CONCLUDED',
    CANCELED = 'CANCELED'
}

export enum PaymentMethod {
    PENDING = 'PENDING',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PIX = 'PIX'
}

export interface OrderItem {
    id: number;
    productId: number;
    skuId: number;
    title: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    total: string;
}

export interface Order {
    id: number;
    partnerOrderId: string;
    status: OrderStatus;
    marketplace: string;
    paymentMethod: PaymentMethod;
    itemsTotal: string;
    shippingTotal: string;
    discountTotal: string;
    grandTotal: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface OrderDetails extends Order {
    profileId: number;
    anymarketOrderId: number | null;
    checkoutKey: string;
    marketplaceOrderId: string | null;
    installments: number | null;
    shippingCarrier: string | null;
    shippingService: string | null;
    shippingEstimatedDeliveryDate: string | null;
    shippingTrackingCode: string | null;
}

export interface OrdersFilter {
    status?: OrderStatus;
    marketplace?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.INCOMPLETE]: 'Incompleto',
    [OrderStatus.PENDING]: 'Pendente',
    [OrderStatus.WAITING_PAYMENT]: 'Aguardando Pagamento',
    [OrderStatus.PAID_WAITING_SHIP]: 'Pago - Aguardando Envio',
    [OrderStatus.INVOICED]: 'Faturado',
    [OrderStatus.PAID_WAITING_DELIVERY]: 'Aguardando Entrega',
    [OrderStatus.IN_TRANSIT]: 'Em Trânsito',
    [OrderStatus.DELIVERY_ISSUE]: 'Problema na Entrega',
    [OrderStatus.CONCLUDED]: 'Entregue',
    [OrderStatus.CANCELED]: 'Cancelado'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    [PaymentMethod.PENDING]: 'Pendente',
    [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
    [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
    [PaymentMethod.PIX]: 'PIX'
};
