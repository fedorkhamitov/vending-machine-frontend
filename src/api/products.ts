import { apiClient } from './apiClient';
import { Product, ProductFilter, PriceRange } from '../types/product';

export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  return apiClient.get<Product[]>(`/api/products${buildQuery(filter)}`);
}

export async function getPriceRange(brandId?: string | null): Promise<PriceRange> {
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

export async function importExcel(file: File): Promise<{ imported: number }> {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch('/api/products/import-excel', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}`);
  }
  const result = await response.json() as { imported: number };
  return result;
}