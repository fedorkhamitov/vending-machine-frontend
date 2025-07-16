import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import { InsertedCoins } from '../../types/coin';
import { CoinSelector } from '../CoinSelector/CoinSelector';
import { formatCurrency } from '../../utils/formatCurrency';
import './Payment.css';

interface PaymentProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export function Payment({ onSuccess, onError, onBack }: PaymentProps) {
  const { cart, clearCart } = useCart();
  const [insertedCoins, setInsertedCoins] = useState<InsertedCoins>({});
  const [processing, setProcessing] = useState(false);
  
  const totalInserted = Object.entries(insertedCoins).reduce(
    (sum, [denomination, count]) => sum + (Number(denomination) * count),
    0
  );
  
  const isEnoughMoney = totalInserted >= cart.totalAmount;
  const change = totalInserted - cart.totalAmount;
  
  const handleCoinChange = (denomination: number, count: number) => {
    setInsertedCoins(prev => ({
      ...prev,
      [denomination]: count
    }));
  };
  
  const handlePayment = async () => {
    if (!isEnoughMoney) {
      onError('Недостаточно средств для оплаты');
      return;
    }
    
    setProcessing(true);
    
    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        insertedCoins
      };
      
      const result = await createOrder(orderData);
      clearCart();
      onSuccess(result.message);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Ошибка оплаты');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="payment">
      <h2>Оплата</h2>
      
      <div className="payment-info">
        <div className="order-summary">
          <h3>Ваш заказ:</h3>
          {cart.items.map(item => (
            <div key={item.product.id} className="order-item">
              <span>{item.product.name}</span>
              <span>{item.quantity} шт.</span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Итого: {formatCurrency(cart.totalAmount)}</strong>
          </div>
        </div>
        
        <div className="coin-selection">
          <h3>Внесите монеты:</h3>
          <CoinSelector
            onCoinChange={handleCoinChange}
            insertedCoins={insertedCoins}
          />
        </div>
        
        <div className="payment-summary">
          <div className="payment-row">
            <span>К оплате:</span>
            <span>{formatCurrency(cart.totalAmount)}</span>
          </div>
          
          <div className="payment-row">
            <span>Внесено:</span>
            <span className={isEnoughMoney ? 'enough' : 'not-enough'}>
              {formatCurrency(totalInserted)}
            </span>
          </div>
          
          {isEnoughMoney && change > 0 && (
            <div className="payment-row">
              <span>Сдача:</span>
              <span>{formatCurrency(change)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="payment-actions">
        <button className="back-button" onClick={onBack}>
          Назад
        </button>
        
        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={!isEnoughMoney || processing}
        >
          {processing ? 'Обработка...' : 'Оплатить'}
        </button>
      </div>
    </div>
  );
}
