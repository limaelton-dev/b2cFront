import { ReadonlyURLSearchParams } from "next/navigation";
import { Filters } from "../../types/filters";
import { Pagination } from "../../types/pagination";

export function toOffsetLimit(page: number, size: number): Pagination {
  const limit = Math.max(1, size);
  const offset = Math.max(0, (page - 1) * limit);

  return { offset, limit };
}
  
  export type PaginationState = {
    page: number;
    size: number;
  }
  
  export function parseFiltersFromSearchParams(searchParams: ReadonlyURLSearchParams): {
    filters: Filters;
    page: number;
  } {
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) ?? [];
    const term = searchParams.get('term') ?? '';
    const page = Number(searchParams.get('page') ?? '1') || 1;
  
    return {
      filters: { categories, brands, term },
      page,
    };
  }
  
  export function buildQueryString(filters: Filters, page = 1): string {
    const params = new URLSearchParams();
  
    if (filters.categories.length) params.set('categories', filters.categories.join(','));
    if (filters.brands.length) params.set('brands', filters.brands.join(','));
    if (filters.term) params.set('term', filters.term);
    if (page > 1) params.set('page', String(page));
  
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }
  