import { ProductImage } from "./product-image";

export interface Category {
    id: number;
    name: string;
    path: string;
}

export interface Brand {
    id: number;
    name: string;
    reducedName: string;
    partnerId: string; //skuId
}

export interface Nbm {
    id: number | string;
    description: string;
}

export interface Origin {
    id: number;
    description: string;
}

export interface Characteristics {
    index: number;
    name: string;
    value: string;
}

// Interface para tipo de variação
export interface VariationType {
    id: number;
    name: string;
    visualVariation: boolean;
}

// Interface para variação de SKU
export interface SkuVariation {
    id: number;
    description: string;
    type: VariationType;
}

// Nova interface para as imagens do backend
export interface ProductImageNew {
    id: number;
    index: number;
    main: boolean;
    url: string;
    thumbnailUrl: string;
    lowResolutionUrl: string;
    standardUrl: string;
    originalImage: string;
    variation?: string; // Ex: "Preto", "Branco"
    status: string;
    standardWidth: number;
    standardHeight: number;
    originalWidth: number;
    originalHeight: number;
    productId: number;
    idVariation?: number;
}

// Nova interface para SKUs do backend
export interface ProductSkuNew {
    id: number;
    title: string;
    partnerId: string;
    ean: string;
    price: number;
    amount: number;
    additionalTime: number;
    variations?: SkuVariation[]; // Variações do SKU (ex: cor, tamanho)
    stockLocalId: number;
    active: boolean;
    volumes: number;
}

export interface Product {
    id: number;
    slug?: string;
    title: string;
    description: string;
    category: Category;
    brand: Brand;
    nbm: Nbm;
    origin: Origin;
    model: string;
    gender: string;
    videoUrl?: string;
    warrantyTime: number;
    warrantyText: string;
    height: number;
    width: number;
    weight: number;
    length: number;
    priceFactor: number;
    calculatedPrice: boolean;
    definitionPriceScope: string;
    hasVariations: boolean;
    isProductActive: boolean;
    characteristics: Characteristics[];
    images: ProductImageNew[];
    skus: ProductSkuNew[]; 
    allowAutomaticSkuMarketplaceCreation: boolean;
    type: string;

    name?: string; 
    pro_precovenda?: number;
    pro_imagem?: string; 
    imagens?: ProductImage[];
}

