import React from 'react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart } = useCart();

  const isInCart = cart.items.some(item => item.product.id === product.id);
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock && !isInCart) {
      addToCart(product);
    }
  };

  let buttonClass = 'product-button';
  let buttonText = 'Выбрать';

  if (isOutOfStock) {
    buttonClass += ' product-button--disabled';
    buttonText = 'Закончился';
  } else if (isInCart) {
    buttonClass += ' product-button--selected';
    buttonText = 'Выбрано';
  } else {
  buttonClass += ' product-button--default';
}

  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>

      {product.description && (
        <p className="product-description">{product.description}</p>
      )}

      <div className="product-brand">{product.brandName}</div>
      <div className="product-price">{formatCurrency(product.price)}</div>
      <div className="product-stock">В наличии: {product.stockQuantity}</div>

      <button
        className={buttonClass}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {buttonText}
      </button>
    </div>
  );
}