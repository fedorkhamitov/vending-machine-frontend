import React from 'react';
import './PriceSlider.css';

interface PriceSliderProps {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
  onChange: (min: number, max: number) => void;
}

export function PriceSlider({ min, max, selectedMin, selectedMax, onChange }: PriceSliderProps) {
  return (
    <div className="price-slider">
      <input
        type="range"
        className="slider slider--min"
        min={min}
        max={max}
        value={selectedMin}
        onChange={(e) => onChange(Number(e.target.value), selectedMax)}
      />
      <input
        type="range"
        className="slider slider--max"
        min={min}
        max={max}
        value={selectedMax}
        onChange={(e) => onChange(selectedMin, Number(e.target.value))}
      />
      <div className="price-values">
        <span>{selectedMin} ₽</span>
        <span>{selectedMax} ₽</span>
      </div>
    </div>
  );
}
