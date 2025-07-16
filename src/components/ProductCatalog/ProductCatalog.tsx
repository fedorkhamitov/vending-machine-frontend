import React, { useState, useEffect } from 'react';
import { getBrands } from '../../api/brands';
import { getProducts, getPriceRange } from '../../api/products';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceFilter } from '../PriceFilter/PriceFilter';
import { ProductCard } from '../ProductCard/ProductCard';
import { Brand } from '../../types/brand';
import { Product, ProductFilter, PriceRange } from '../../types/product';
import './ProductCatalog.css';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prods = await getProducts(filter);
      setProducts(prods);
      
      const range = await getPriceRange(filter.brandId);
      setPriceRange(range);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch {
        setError('Ошибка загрузки брендов');
      }
    };
    
    loadBrands();
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [filter]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={loadCatalog}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Газированные напитки</h1>
      </div>

      <div className="filters">
        <BrandFilter
          brands={brands}
          selectedBrandId={filter.brandId}
          onBrandChange={(brandId) => setFilter((f) => ({ ...f, brandId }))}
        />

        <PriceFilter
          priceRange={priceRange}
          selectedMin={filter.minPrice}
          selectedMax={filter.maxPrice}
          onPriceChange={(minPrice, maxPrice) =>
            setFilter((f) => ({ ...f, minPrice, maxPrice }))
          }
        />
      </div>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
