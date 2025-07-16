import React from 'react';
import { Brand } from '../../types/brand';
import './BrandFilter.css';

interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId: string;
  onBrandChange: (id: string) => void;
}

export function BrandFilter({ brands, selectedBrandId, onBrandChange }: BrandFilterProps) {
  return (
    <select
      className="brand-select"
      value={selectedBrandId}
      onChange={e => onBrandChange(e.target.value)}
    >
      {brands.map(b => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
}
