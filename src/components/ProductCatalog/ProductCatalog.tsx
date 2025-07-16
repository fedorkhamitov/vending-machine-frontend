// src/components/ProductCatalog/ProductCatalog.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useVendingMachine } from '../../services/VendingMachineContext';
import { useSessionGuard } from '../../hooks/useSessionGuard';
import { getBrands } from '../../api/brands';
import { getProducts, getPriceRange } from '../../api/products';
import { BrandFilter } from '../BrandFilter/BrandFilter';
import { PriceFilter } from '../PriceFilter/PriceFilter';
import { ProductCard } from '../ProductCard/ProductCard';
import { BusyModal } from '../BusyModal/BusyModal';
import { Brand } from '../../types/brand';
import { Product, ProductFilter, PriceRange } from '../../types/product';
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
  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) При монтировании — захват блокировки и автоматический релиз
  useEffect(() => {
    (async () => {
      const ok = await acquireLock();
      if (!ok) return;
      // сразу подгружаем данные без фильтра (filter пуст)
      try {
        const prods = await getProducts(filter);
        setProducts(prods);
        const range = await getPriceRange();
        setPriceRange(range);
      } catch (err) {
        console.error(err);
      }
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

  // 3) При успешном захвате и изменении фильтра — обновление каталога
  const reloadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    const ok = await acquireLock();
    if (!ok) {
      setError('Автомат занят другим пользователем');
      setLoading(false);
      return;
    }

    try {
      const prods = await getProducts(filter);
      setProducts(prods);
    } catch (err) {
      setError('Ошибка загрузки товаров');
    }

    try {
      const range = await getPriceRange(filter.brandId);
      setPriceRange(range);
    } catch {
      console.error('Ошибка загрузки диапазона цен');
    } finally {
      setLoading(false);
    }
  }, [acquireLock, filter]);

  useEffect(() => {
    if (isLocked && !sessionLoading) {
      reloadCatalog();
    }
  }, [isLocked, sessionLoading, filter, reloadCatalog]);

  // 4) Показываем BusyModal, если сессия не захвачена
  if (sessionError) {
    return (
      <BusyModal
        isOpen={true}
        message={sessionError}
        onClose={clearError}
      />
    );
  }

  // 5) Индикатор подключения или загрузки сессии
  if (sessionLoading || !isLocked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Подключение к автомату...</p>
        </div>
      </div>
    );
  }

  // 6) Ошибки фильтрации/загрузки
  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={reloadCatalog}>Попробовать снова</button>
      </div>
    );
  }

  // 7) Рендер каталога
  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Газированные напитки</h1>
        <div className="session-indicator">
          <span className="session-status active">Подключен к автомату</span>
        </div>
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
