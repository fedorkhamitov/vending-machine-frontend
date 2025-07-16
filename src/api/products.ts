import { apiClient } from './apiClient';
import { Product, ProductFilter, PriceRange } from '../types/product';

export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  return apiClient.get<Product[]>(`/api/products${buildQuery(filter)}`);
}

export async function getPriceRange(brandId?: string): Promise<PriceRange> {
  const query = brandId ? `?brandId=${brandId}` : '';
  return apiClient.get<PriceRange>(`/api/products/price-range${query}`);
}

function buildQuery(filter?: ProductFilter): string {
  if (!filter) return '';
  
  const params = new URLSearchParams();
  if (filter.brandId) params.append('brandId', filter.brandId);
  if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
  if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
  
  return params.toString() ? `?${params.toString()}` : '';
}