import React from 'react';
import './PriceSlider.css';

interface PriceSliderProps {
  min: number;
  max: number;
  selectedMax: number;
  onChange: (maxPrice: number) => void;
}

export function PriceSlider({ min, max, selectedMax, onChange }: PriceSliderProps) {
  return (
    <div className="price-slider">
      <div className="price-slider__label">
        Стоимость
      </div>
      <div className="price-slider__values">
        <span>{min} ₽</span>
        <span>{selectedMax} ₽</span>
      </div>
      <div className="price-slider__container">
        <input
          type="range"
          className="price-slider__input"
          min={min}
          max={max}
          value={selectedMax}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
