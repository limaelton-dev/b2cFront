import { http } from './http';
import { CategoriesApiResponse } from '../types/category';

export async function fetchCategoryMenu(signal?: AbortSignal) {
  return http<CategoriesApiResponse>('/api/categories/menu', { signal });
}
