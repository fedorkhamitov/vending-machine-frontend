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
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  // Загрузка брендов и начального диапазона
  useEffect(() => {
    (async () => {
      try {
        const allBrands = await getBrands();
        setBrands([{ id: null, name: 'Все бренды' }, ...allBrands]);
        const initialRange = await getPriceRange();
        setPriceRange({ min: initialRange.minPrice, max: initialRange.maxPrice });
      } catch {
        setError('Ошибка загрузки данных');
      }
    })();
  }, []);

  // Загрузка товаров при фильтре
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const prods = await getProducts(filter);
        setProducts(prods);
        const range = await getPriceRange(filter.brandId);
        setPriceRange({ min: range.minPrice, max: range.maxPrice });
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
          selectedBrandId={filter.brandId ?? null}
          onBrandChange={(brandId) => setFilter((f) => ({ ...f, brandId }))}
        />
        <PriceSlider
          min={priceRange.min}
          max={priceRange.max}
          selectedMin={filter.minPrice ?? priceRange.min}
          selectedMax={filter.maxPrice ?? priceRange.max}
          onChange={(minPrice, maxPrice) =>
            setFilter((f) => ({ ...f, minPrice, maxPrice }))
          }
        />
      </section>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <section className="products-grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={() => setSelectedCount((c) => c + 1)}
            />
          ))}
        </section>
      )}

      <footer className="catalog-footer">
        <button
          className="btn btn--primary"
          disabled={selectedCount === 0}
          onClick={() => {/* переход к оформлению */}}
        >
          Выбрано: {selectedCount}
        </button>
      </footer>
    </div>
  );
}
