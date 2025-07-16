import { ApiResponse } from '../types/api';
import { Brand } from '../types/brand';

export async function getBrands(): Promise<Brand[]> {
  try {
    const response = await fetch('/api/brands');
    const data: ApiResponse<Brand[]> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ошибка получения брендов');
    }
    
    return data.data;
  } catch (error) {
    throw new Error('Не удалось загрузить список брендов');
  }
}
