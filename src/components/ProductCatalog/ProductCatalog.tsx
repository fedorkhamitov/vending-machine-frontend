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
  const { state: machineState } = useVendingMachine();
  const { isLocked, isLoading: sessionLoading, error: sessionError } = useSessionGuard();
  
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
    if (isLocked && !sessionLoading) {
      loadProducts();
      loadPriceRange();
    }
  }, [isLocked, sessionLoading, filter]);
  
  const loadBrands = async () => {
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
    } catch (err) {
      setError('Ошибка загрузки брендов');
    }
  };
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts(filter);
      setProducts(productsData);
      setError(null);
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
    } catch (err) {
      console.error('Ошибка загрузки диапазона цен:', err);
    }
  };
  
  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };
  
  if (machineState.isOccupied || sessionError) {
    return (
      <BusyModal 
        isOpen={true}
        message={sessionError || 'Автомат занят другим пользователем'}
        onClose={() => window.location.reload()}
      />
    );
  }
  
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
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }
  
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