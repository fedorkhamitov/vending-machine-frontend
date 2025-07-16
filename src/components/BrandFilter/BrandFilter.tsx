import React from 'react';
import { Brand } from '../../types/brand';
import './BrandFilter.css';

interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId?: string;
  onBrandChange: (brandId?: string) => void;
}

export function BrandFilter({ brands, selectedBrandId, onBrandChange }: BrandFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onBrandChange(value === '' ? undefined : value);
  };
  
  return (
    <div className="brand-filter">
      <label htmlFor="brand-select">Бренд:</label>
      <select
        id="brand-select"
        value={selectedBrandId || ''}
        onChange={handleChange}
        className="brand-select"
      >
        <option value="">Все бренды</option>
        {brands.map(brand => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}
