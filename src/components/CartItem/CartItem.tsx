import React from 'react';
import { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item.product.id, newQuantity);
    }
  };
  
  const handleIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.product.id);
  };
  
  const totalPrice = item.product.price * item.quantity;
  
  return (
    <div className="cart-item">
      <div className="item-info">
        <h3>{item.product.name}</h3>
        <p className="item-brand">{item.product.brandName}</p>
        <p className="item-price">{formatCurrency(item.product.price)} за шт.</p>
      </div>
      
      <div className="item-quantity">
        <button 
          className="quantity-btn"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          max={item.product.stockQuantity}
          className="quantity-input"
        />
        
        <button 
          className="quantity-btn"
          onClick={handleIncrease}
          disabled={item.quantity >= item.product.stockQuantity}
        >
          +
        </button>
      </div>
      
      <div className="item-total">
        <strong>{formatCurrency(totalPrice)}</strong>
      </div>
      
      <button className="remove-btn" onClick={handleRemove}>
        ✕
      </button>
    </div>
  );
}
