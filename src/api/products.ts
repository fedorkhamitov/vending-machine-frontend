import { ApiResponse } from '../types/api';
import { Product, ProductFilter, PriceRange } from '../types/product';

export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    
    if (filter?.brandId) params.append('brandId', filter.brandId);
    if (filter?.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
    if (filter?.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
    
    const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (response.status === 423) {
      throw new Error('Автомат занят, попробуйте позже');
    }
    
    const data: ApiResponse<Product[]> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ошибка получения товаров');
    }
    
    return data.data;
  } catch (error) {
    throw error;
  }
}

export async function getPriceRange(brandId?: string): Promise<PriceRange> {
  try {
    const params = brandId ? `?brandId=${brandId}` : '';
    const response = await fetch(`/api/products/price-range${params}`);
    const data: ApiResponse<PriceRange> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ошибка получения диапазона цен');
    }
    
    return data.data;
  } catch (error) {
    throw new Error('Не удалось загрузить диапазон цен');
  }
}
