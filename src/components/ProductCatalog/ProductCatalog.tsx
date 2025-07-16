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
  const { state: machineState, acquireLock, releaseLock } = useVendingMachine();
  const { isLocked, isLoading: sessionLoading, error: sessionError } = useSessionGuard();

  const [isBusyOpen, setBusyOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ minPrice: 0, maxPrice: 0 });
  const [filter, setFilter] = useState<ProductFilter>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) При монтировании – пытаемся захватить автомат
  useEffect(() => {
    (async () => {
      const ok = await acquireLock();
      if (!ok) setBusyOpen(true);
    })();
    // при анмаунте – освобождаем автомат
    return () => void releaseLock();
  }, []);

  // 2) Загружаем бренды один раз
  useEffect(() => {
    (async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch {
        setError('Ошибка загрузки брендов');
      }
    })();
  }, []);

  // 3) Когда блокировка установлена или фильтр изменился – загружаем товары и диапазон цен
  useEffect(() => {
    if (isLocked && !sessionLoading) {
      loadProducts();
      loadPriceRange();
    }
  }, [isLocked, sessionLoading, filter]);

  // Загрузка товаров
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(filter);
      setProducts(data);
    } catch (err) {
      if (err instanceof Error && err.message === 'MACHINE_BUSY') {
        setError('Автомат занят другим пользователем');
        setBusyOpen(true);
      } else {
        setError('Ошибка загрузки товаров');
      }
    } finally {
      setLoading(false);
    }
  };

  // Загрузка диапазона цен
  const loadPriceRange = async () => {
    try {
      const range = await getPriceRange(filter.brandId);
      setPriceRange(range);
    } catch {
      console.error('Ошибка загрузки диапазона цен');
    }
  };

  // Обновление фильтра
  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };

  // 4) Если автомат занят – показываем BusyModal
  if (isBusyOpen) {
    return (
      <BusyModal
        isOpen={true}
        message="Автомат занят другим пользователем"
        onClose={async () => {
          setBusyOpen(false);
          const ok = await acquireLock();
          if (!ok) setBusyOpen(true);
        }}
      />
    );
  }

  // 5) Если сессия ещё подключается – показываем индикатор
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

  // 6) Если есть общая ошибка – показываем её с кнопкой перезагрузки
  if (error && !isBusyOpen) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

  // 7) Основной рендер: каталог товаров
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
          onBrandChange={brandId => handleFilterChange({ ...filter, brandId })}
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
