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
  imageUrl: string;
}

export interface ProductFilter {
  brandId?: string | null;
  minPrice?: number;
  maxPrice?: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}
