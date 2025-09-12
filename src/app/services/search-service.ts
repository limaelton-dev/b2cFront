import { http } from './http';
import { SearchResult } from '../types/search';

export async function search(term: string, signal?: AbortSignal) {
  return http<SearchResult[]>(`/api/search?s=${encodeURIComponent(term)}`, { signal });
}
