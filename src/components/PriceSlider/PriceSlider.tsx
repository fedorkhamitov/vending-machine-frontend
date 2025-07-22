import React from "react";
import "./PriceSlider.css";

interface PriceSliderProps {
  min: number;
  max: number;
  selectedMax: number;
  onChangeTemp?: (value: number) => void;
  onFinalChange: (value: number) => void;
}

export function PriceSlider({
  min,
  max,
  selectedMax,
  onChangeTemp,
  onFinalChange,
}: PriceSliderProps) {
  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    onChangeTemp?.(newVal);
  };

  const handleRelease = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
    const newVal = Number((e.target as HTMLInputElement).value);
    onFinalChange(newVal);
  };
  return (
    <div className="price-slider">
      <div className="price-slider__label">Стоимость</div>
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
          onChange={handleTempChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
        />
      </div>
    </div>
  );
}
