import React, { useState, useEffect, useRef } from 'react';
import { getBrands } from '../../api/brands';
import { getProducts, getPriceRange, importExcel } from '../../api/products';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceSlider } from '../PriceSlider/PriceSlider';
import { ProductCard } from '../ProductCard/ProductCard';
import { Brand } from '../../types/brand';
import { Product, ProductFilter, PriceRange } from '../../types/product';
import { useCart } from '../../context/CartContext';
import './ProductCatalog.css';

interface ProductCatalogProps {
  onCheckout: () => void;
}

export function ProductCatalog({ onCheckout }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cart } = useCart();
  const selectedCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    (async () => {
      try {
        const allBrands = await getBrands();
        setBrands([{ id: '', name: 'Все бренды', description: '' }, ...allBrands]);
        const initRange = await getPriceRange();
        setPriceRange({ minPrice: initRange.minPrice, maxPrice: initRange.maxPrice });
      } catch {
        setError('Ошибка загрузки данных');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const prods = await getProducts(filter);
        setProducts(prods);
        const rng = await getPriceRange(filter.brandId);
        setPriceRange({ minPrice: rng.minPrice, maxPrice: rng.maxPrice });
      } catch {
        setError('Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError(null);
    try {
      const result = await importExcel(file);
      await new Promise(r => setTimeout(r, 500));
      setFilter({}); // сброс фильтра
    } catch {
      setError('Ошибка импорта файла');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
        <div className="catalog-header__actions">
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className="btn btn--secondary"
            onClick={handleImportClick}
            disabled={importing}
          >
            {importing ? 'Импорт...' : 'Импорт'}
          </button>
          <button
            className="btn btn--primary"
            disabled={selectedCount === 0}
            onClick={onCheckout}
          >
            Выбрано: {selectedCount}
          </button>
        </div>
      </header>

      <section className="filters">
        <BrandFilter
          brands={brands}
          selectedBrandId={filter.brandId ?? ''}
          onBrandChange={brandId =>
            setFilter(f => ({ ...f, brandId: brandId || undefined }))
          }
        />

        <PriceSlider
          min={priceRange.minPrice}
          max={priceRange.maxPrice}
          selectedMin={filter.minPrice ?? priceRange.minPrice}
          selectedMax={filter.maxPrice ?? priceRange.maxPrice}
          onChange={(minPrice, maxPrice) =>
            setFilter(f => ({ ...f, minPrice, maxPrice }))
          }
        />
      </section>

      {loading ? (
        <div className="loading">Загрузка товаров...</div>
      ) : (
        <section className="products-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </div>
  );
}