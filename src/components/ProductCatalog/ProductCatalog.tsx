import React, { useState, useEffect } from 'react';
import { Product, ProductFilter, PriceRange } from '../../types/product';
import { Brand } from '../../types/brand';
import { getProducts, getPriceRange } from '../../api/products';
import { getBrands } from '../../api/brands';
import { ProductCard } from '../ProductCard/ProductCard';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceFilter } from '../PriceFilter/PriceFilter';
import './ProductCatalog.css';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadBrands();
  }, []);
  
  useEffect(() => {
    loadProducts();
    loadPriceRange();
  }, [filter]);
  
  const loadBrands = async () => {
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки брендов');
    }
  };
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts(filter);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };
  
  const loadPriceRange = async () => {
    try {
      const range = await getPriceRange(filter.brandId);
      setPriceRange(range);
    } catch (err) {
      console.error('Ошибка загрузки диапазона цен:', err);
    }
  };
  
  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };
  
  if (error) {
    return (
      <div className="catalog-error">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={loadProducts}>Попробовать снова</button>
      </div>
    );
  }
  
  return (
    <div className="product-catalog">
      <h1>Газированные напитки</h1>
      
      <div className="filters">
        <BrandFilter
          brands={brands}
          selectedBrandId={filter.brandId}
          onBrandChange={(brandId) => handleFilterChange({ ...filter, brandId })}
        />
        
        <PriceFilter
          priceRange={priceRange}
          selectedMin={filter.minPrice}
          selectedMax={filter.maxPrice}
          onPriceChange={(minPrice, maxPrice) => 
            handleFilterChange({ ...filter, minPrice, maxPrice })
          }
        />
      </div>
      
      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
