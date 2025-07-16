import React from 'react';
import './BrandFilter.css';

interface BrandFilterProps {
  brands: { id: number | null; name: string }[];
  selectedBrandId: number | null;
  onBrandChange: (id: number | null) => void;
}

export function BrandFilter({ brands, selectedBrandId, onBrandChange }: BrandFilterProps) {
  return (
    <select
      className="brand-select"
      value={selectedBrandId ?? ''}
      onChange={(e) =>
        onBrandChange(e.target.value === '' ? null : Number(e.target.value))
      }
    >
      {brands.map((b) => (
        <option key={b.id ?? 'all'} value={b.id ?? ''}>
          {b.name}
        </option>
      ))}
    </select>
  );
}
