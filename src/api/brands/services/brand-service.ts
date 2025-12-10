import { get } from '../../http';
import { Brand } from '../types/brand';

/**
 * Busca todas as marcas
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await get<any>('/brands');
    
    // A resposta pode vir como array diretamente ou dentro de um objeto
    if (Array.isArray(response)) {
      return response;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response?.brands && Array.isArray(response.brands)) {
      return response.brands;
    }
    
    console.warn('Formato de resposta de marcas inesperado:', response);
    return [];
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    return [];
  }
}

/**
 * Busca uma marca específica por ID
 */
export async function fetchBrandById(id: number): Promise<Brand | null> {
  try {
    const data = await get<Brand>(`/brands/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar marca ${id}:`, error);
    return null;
  }
}

