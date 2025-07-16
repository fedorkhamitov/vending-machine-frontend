import React from 'react';
import { PriceRange } from '../../types/product';
import './PriceFilter.css';

interface PriceFilterProps {
  priceRange: PriceRange;
  selectedMin?: number;
  selectedMax?: number;
  onPriceChange: (minPrice?: number, maxPrice?: number) => void;
}

export function PriceFilter({ priceRange, selectedMin, selectedMax, onPriceChange }: PriceFilterProps) {
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onPriceChange(value, selectedMax);
  };
  
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onPriceChange(selectedMin, value);
  };
  
  return (
    <div className="price-filter">
      <label>Цена:</label>
      <div className="price-inputs">
        <div className="price-input">
          <label htmlFor="min-price">от</label>
          <input
            id="min-price"
            type="number"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            value={selectedMin || priceRange.minPrice}
            onChange={handleMinChange}
          />
        </div>
        
        <div className="price-input">
          <label htmlFor="max-price">до</label>
          <input
            id="max-price"
            type="number"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            value={selectedMax || priceRange.maxPrice}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
}
