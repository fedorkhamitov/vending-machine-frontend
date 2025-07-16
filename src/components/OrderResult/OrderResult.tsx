import React from 'react';
import './OrderResult.css';

interface OrderResultProps {
  message: string;
  onBackToCatalog: () => void;
}

export function OrderResult({ message, onBackToCatalog }: OrderResultProps) {
  return (
    <div className="order-result">
      <div className="result-icon">✓</div>
      <h2>Спасибо за покупку!</h2>
      <p className="result-message">{message}</p>
      <button className="back-to-catalog-btn" onClick={onBackToCatalog}>
        Вернуться в каталог
      </button>
    </div>
  );
}
