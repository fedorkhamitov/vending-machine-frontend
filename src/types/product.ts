export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  brandId: string;
  brandName: string;
  isInStock: boolean;
}

export interface ProductFilter {
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}
