import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import { InsertedCoins } from '../../types/coin';
import { formatCurrency } from '../../utils/formatCurrency';
import './Payment.css';
import { CoinSelector } from '../CoinSelector/CoinSelector';

interface PaymentProps {
  onSuccess: (msg: string) => void;
  onError: (err: string) => void;
  onBack: () => void;
}

export function Payment({ onSuccess, onError, onBack }: PaymentProps) {
  const { cart, clearCart } = useCart();
  const [insertedCoins, setInsertedCoins] = useState<InsertedCoins>({});
  const [processing, setProcessing] = useState(false);

  const totalInserted = Object.entries(insertedCoins)
    .reduce((sum, [denom, cnt]) => sum + Number(denom) * cnt, 0);
  const isEnoughMoney = totalInserted >= cart.totalAmount;
  const change = totalInserted - cart.totalAmount;

  const handleCoinChange = (denom: number, cnt: number) => {
    setInsertedCoins(prev => ({ ...prev, [denom]: cnt }));
  };

  const pay = async () => {
    if (!isEnoughMoney) {
      onError('Недостаточно средств');
      return;
    }
    setProcessing(true);
    try {
      await createOrder({
        items: cart.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        insertedCoins
      });
      clearCart();
      onSuccess('Спасибо за покупку!');
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment">
      <div className="payment-header">
        <h2>Оплата</h2>
      </div>

      <div className="payment-coins-selector">
        <CoinSelector
          insertedCoins={insertedCoins}
          onCoinChange={handleCoinChange}
        />
      </div>

      <div className="payment-summary">
        
          <span>Итоговая сумма:</span>
          <span className="amount">{formatCurrency(cart.totalAmount)}</span>
       
        
          <span>Вы внесли:</span>
          <span className={`amount ${isEnoughMoney ? 'enough' : 'not-enough'}`}>
            {formatCurrency(totalInserted)}
          </span>
       
        {isEnoughMoney && change > 0 && (
          <div className="payment-row">
            <span>Сдача:</span>
            <span className="amount change">{formatCurrency(change)}</span>
          </div>
        )}
      </div>

      <div className="payment-footer">
        <button className="btn btn--secondary" onClick={onBack}>
          Вернуться
        </button>
        <button
          className="btn btn--primary"
          onClick={pay}
          disabled={!isEnoughMoney || processing}
        >
          {processing ? 'Обработка…' : 'Оплатить'}
        </button>
      </div>
    </div>
  );
}