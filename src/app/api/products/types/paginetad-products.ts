import { Product } from "./product";

export interface PaginatedProducts {
    items: Product[];
    offset: number;
    limit: number;
    totalMatched: number;
    currentPage: number;
    lastPage: number;
}