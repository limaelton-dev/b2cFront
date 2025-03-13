import { DiscountProduct } from "./discount";

export interface Product {
    id: number;
    pro_codigo: string;
    //aqui teremos informações trazidas da api do produto(oracle)
    discount?: DiscountProduct;
}

