import React from 'react';
import { InsertedCoins } from '../../types/coin';
import './CoinSelector.css';

interface CoinSelectorProps {
  onCoinChange: (denomination: number, count: number) => void;
  insertedCoins: InsertedCoins;
}

const COIN_DENOMINATIONS = [1, 2, 5, 10];

export function CoinSelector({ onCoinChange, insertedCoins }: CoinSelectorProps) {
  const handleCoinIncrease = (denomination: number) => {
    const currentCount = insertedCoins[denomination] || 0;
    onCoinChange(denomination, currentCount + 1);
  };
  
  const handleCoinDecrease = (denomination: number) => {
    const currentCount = insertedCoins[denomination] || 0;
    if (currentCount > 0) {
      onCoinChange(denomination, currentCount - 1);
    }
  };
  
  const handleCoinInput = (denomination: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value, 10);
    if (!isNaN(count) && count >= 0) {
      onCoinChange(denomination, count);
    }
  };
  
  return (
    <div className="coin-selector">
      {COIN_DENOMINATIONS.map(denomination => (
        <div key={denomination} className="coin-item">
          <div className="coin-icon">
            {denomination}₽
          </div>
          
          <div className="coin-controls">
            <button
              className="coin-btn"
              onClick={() => handleCoinDecrease(denomination)}
              disabled={!insertedCoins[denomination]}
            >
              -
            </button>
            
            <input
              type="number"
              value={insertedCoins[denomination] || 0}
              onChange={(e) => handleCoinInput(denomination, e)}
              min="0"
              className="coin-input"
            />
            
            <button
              className="coin-btn"
              onClick={() => handleCoinIncrease(denomination)}
            >
              +
            </button>
          </div>
          
          <div className="coin-total">
            {(insertedCoins[denomination] || 0) * denomination}₽
          </div>
        </div>
      ))}
    </div>
  );
}
