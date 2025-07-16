// src/components/ProductCatalog/ProductCatalog.tsx

import React, { useState, useEffect } from 'react';
import { useVendingMachine } from '../../services/VendingMachineContext';
import { useSessionGuard } from '../../hooks/useSessionGuard';
import { getProducts, getPriceRange } from '../../api/products';
import { getBrands } from '../../api/brands';
import { Product, ProductFilter, PriceRange } from '../../types/product';
import { Brand } from '../../types/brand';
import { ProductCard } from '../ProductCard/ProductCard';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceFilter } from '../PriceFilter/PriceFilter';
import { BusyModal } from '../BusyModal/BusyModal';
import './ProductCatalog.css';

export function ProductCatalog() {
  const {
    state: machineState,
    acquireLock,
    releaseLock,
    clearError,
  } = useVendingMachine();
  const {
    isLocked,
    isLoading: sessionLoading,
    error: sessionError,
  } = useSessionGuard();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({
    minPrice: 0,
    maxPrice: 0,
  });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) При монтировании — автоматич. захват и последующий релиз
  useEffect(() => {
    (async () => {
      const ok = await acquireLock();
      if (!ok) return;
    })();
    return () => {
      releaseLock();
    };
  }, [acquireLock, releaseLock]);

  // 2) Загрузка брендов один раз
  useEffect(() => {
    (async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch {
        setError('Ошибка загрузки брендов');
      }
    })();
  }, []);

  // 3) При успешном захвате или изменении фильтра — загрузка каталога
  useEffect(() => {
    if (isLocked && !sessionLoading) {
      loadProducts();
      loadPriceRange();
    }
  }, [isLocked, sessionLoading, filter]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(filter);
      setProducts(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'MACHINE_BUSY') {
        setError('Автомат занят другим пользователем');
      } else {
        setError('Ошибка загрузки товаров');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPriceRange = async () => {
    try {
      const range = await getPriceRange(filter.brandId);
      setPriceRange(range);
    } catch {
      console.error('Ошибка загрузки диапазона цен');
    }
  };

  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };

  // 4) Показ BusyModal при ошибке сессии (423)
  if (sessionError) {
    return (
      <BusyModal
        isOpen={true}
        message={sessionError}
        onClose={() => {
          clearError();
        }}
      />
    );
  }

  // 5) Индикатор подключения
  if (sessionLoading || !isLocked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Подключение к автомату...</p>
        </div>
      </div>
    );
  }

  // 6) Отдельные ошибки (фильтр/бренды)
  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  // 7) Рендер каталога
  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Газированные напитки</h1>
        <div className="session-indicator">
          <span className="session-status active">
            Подключен к автомату
          </span>
        </div>
      </div>

      <div className="filters">
        <BrandFilter
          brands={brands}
          selectedBrandId={filter.brandId}
          onBrandChange={(brandId) =>
            handleFilterChange({ ...filter, brandId })
          }
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
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}