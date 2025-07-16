// src/components/ProductCatalog/ProductCatalog.tsx

import React, { useState, useEffect } from 'react';
import { getBrands } from '../../api/brands';
import { getProducts, getPriceRange } from '../../api/products';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceSlider } from '../PriceSlider/PriceSlider';
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
  const [selectedCount, setSelectedCount] = useState(0);

  // Загрузка брендов и начального диапазона цен
  useEffect(() => {
    (async () => {
      try {
        const allBrands = await getBrands();
        // prepend "Все бренды" с пустым id
        setBrands([{ id: '', name: 'Все бренды' }, ...allBrands]);
        const initialRange = await getPriceRange();
        setPriceRange({ minPrice: initialRange.minPrice, maxPrice: initialRange.maxPrice });
      } catch {
        setError('Ошибка загрузки данных');
      }
    })();
  }, []);

  // Загрузка товаров при изменении фильтра
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const prods = await getProducts(filter);
        setProducts(prods);
        const range = await getPriceRange(filter.brandId);
        setPriceRange({ minPrice: range.minPrice, maxPrice: range.maxPrice });
      } catch {
        setError('Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button className="btn btn--primary" onClick={() => setFilter({})}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <header className="catalog-header">
        <h1>Газированные напитки</h1>
      </header>

      <section className="filters">
        <BrandFilter
          brands={brands}
          selectedBrandId={filter.brandId ?? ''}
          onBrandChange={(brandId) =>
            setFilter((f) => ({
              ...f,
              brandId: brandId || undefined,
            }))
          }
        />
        <PriceSlider
          min={priceRange.minPrice}
          max={priceRange.maxPrice}
          selectedMin={filter.minPrice ?? priceRange.minPrice}
          selectedMax={filter.maxPrice ?? priceRange.maxPrice}
          onChange={(minPrice, maxPrice) =>
            setFilter((f) => ({
              ...f,
              minPrice,
              maxPrice,
            }))
          }
        />
      </section>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <section className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}

      <footer className="catalog-footer">
        <button
          className="btn btn--primary"
          disabled={selectedCount === 0}
          onClick={() => {
            /* TODO: переход к оформлению */
          }}
        >
          Выбрано: {selectedCount}
        </button>
      </footer>
    </div>
  );
}
