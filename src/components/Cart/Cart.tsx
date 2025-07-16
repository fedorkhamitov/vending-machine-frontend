import React from 'react';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../CartItem/CartItem';
import { formatCurrency } from '../../utils/formatCurrency';
import './Cart.css';

interface CartProps {
  onCheckout: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { cart } = useCart();
  
  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>У вас нет ни одного товара, вернитесь на страницу каталога</p>
      </div>
    );
  }
  
  return (
    <div className="cart">
      <h2>Корзина</h2>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Итого: {formatCurrency(cart.totalAmount)}</strong>
        </div>
        
        <button className="checkout-button" onClick={onCheckout}>
          Оплата
        </button>
      </div>
    </div>
  );
}
