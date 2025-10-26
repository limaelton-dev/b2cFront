export interface ProductSku {
    id: number;
    title: string;
    partnerId: string;
    ean: string;
    price: number;
    sellPrice: number;
    amount: number;
    additionalTime: number;
    stockLocalId: number;
    active: boolean;
    volumes: number;
    // Informações adicionais do produto (quando enriquecido)
    product?: {
        id: number;
        title: string;
        images?: Array<{
            url?: string;
            standardUrl?: string;
            originalImage?: string;
            main?: boolean;
        }>;
        brand?: {
            name: string;
        };
    };
}