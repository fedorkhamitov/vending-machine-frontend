import React from "react";
import { Brand } from "../../types/brand";
import "./BrandFilter.css";

interface BrandFilterProps {
  brands: Brand[];
  selectedBrandId: string;
  onBrandChange: (id: string) => void;
}

export function BrandFilter({
  brands,
  selectedBrandId,
  onBrandChange,
}: BrandFilterProps) {
  return (
    <div className="brand-filter">
      <label htmlFor="brand-select">Выберите бренд</label>
      <select
        className="brand-select"
        value={selectedBrandId}
        onChange={(e) => onBrandChange(e.target.value)}
        size={1}
      >
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  );
}
