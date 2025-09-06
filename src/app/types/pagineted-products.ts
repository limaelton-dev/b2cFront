import { Product } from "./product";

export interface PaginetedProducts {
    items: Product[];
    offset: number;
    limit: number;
    totalMatched: number;
    currentPage: number;
    lastPage: number;
}