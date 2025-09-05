import { Product } from "./product";

export interface ProductsPagineted {
    items: Product[];
    offset: number;
    limit: number;
    totalMatched: number;
    currentPage: number;
    lastPage: number;
}