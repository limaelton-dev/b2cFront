import { Product } from "./product";

export interface PaginatedProducts {
    items: Product[];
    offset: number;
    limit: number;
    total: number;
    page: number;
    lastPage: number;
}