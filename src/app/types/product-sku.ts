export interface ProductSku {
    id: number;
    title: string;
    partnerId: string;
    ean: string;
    price: number;
    amount: number;
    additionalTime: number;
    stockLocalId: number;
    active: boolean;
    volumes: number;
}