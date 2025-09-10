import { ProductSku } from "./product-sku";
import { ProductImage } from "./produto";

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
    id: number;
    description: string;
}

export interface Origin {
    id: number;
    descruption: string;
}

export interface Characteristics {
    index: number;
    name: string;
    value: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    category: Category;
    brand: Brand;
    nbm: Nbm;
    origin: Origin;
    model: string;
    gender: string;
    warrantyTime: number;
    warrantyText: string;
    height: number;
    width: number;
    weight: number;
    length: number;
    priceFactor: number;
    calculatedPrice: boolean;
    definitionPriceScope: string; //ENUM
    hasVariantions: boolean;
    isProductActive: boolean;
    characteristics: Characteristics[];
    images: ProductImage[];
    skus: ProductSku;
    allowAutomaticSkuMarketplaceCreation: boolean;
    type: string;
}

