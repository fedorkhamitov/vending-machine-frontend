import React from "react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Cart.css";

interface CartProps {
  onCheckout: () => void;
  onBack: () => void;
}

export function Cart({ onCheckout, onBack }: CartProps) {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>У вас нет ни одного товара, вернитесь на страницу каталога</p>
        <button className="btn btn--primary" onClick={onBack}>
          Вернуться к каталогу
        </button>
      </div>
    );
  }

  const handleIncreaseQuantity = (productId: string) => {
    const item = cart.items.find((item) => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    const item = cart.items.find((item) => item.product.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Оформление заказа</h2>
      </div>

      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th className="th-product">Товар</th>
              <th className="th-quantity">Количество</th>
              <th className="th-price">Цена</th>
              <th className="th-remove">Удаление</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.product.id} className="cart-row">
                <td className="td-product">
                  <div className="product-info">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <div className="product-name">{item.product.name}</div>
                      <div className="product-brand">
                        {item.product.brandName}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="td-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn quantity-btn--decrease"
                      onClick={() => handleDecreaseQuantity(item.product.id)}
                      disabled={item.quantity <= 1}
                      aria-label="Уменьшить количество"
                    >
                      <img
                        src={require("../../assets/icons/minus.svg")}
                        alt="Уменьшить"
                        className="btn-icon"
                      />
                    </button>

                    <span className="quantity-value">{item.quantity}</span>

                    <button
                      className="quantity-btn quantity-btn--increase"
                      onClick={() => handleIncreaseQuantity(item.product.id)}
                      aria-label="Увеличить количество"
                    >
                      <img
                        src={require("../../assets/icons/plus.svg")}
                        alt="Увеличить"
                        className="btn-icon"
                      />
                    </button>
                  </div>
                </td>

                <td>
                  <div className="total-price">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </td>

                <td className="td-remove">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Удалить ${item.product.name} из корзины`}
                  >
                    <img
                      src={require("../../assets/icons/delete.svg")}
                      alt="Удалить"
                      className="btn-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cart-total">
        <strong>Итоговая сумма: {formatCurrency(cart.totalAmount)}</strong>
      </div>
      <div className="cart-footer">
        <button className="btn btn--secondary cart-back" onClick={onBack}>
          Вернуться
        </button>
        <button className="btn btn--primary cart-pay" onClick={onCheckout}>
          Оплата
        </button>
      </div>
    </div>
  );
}
