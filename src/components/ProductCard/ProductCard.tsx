import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { apiClient } from "../../api/apiClient";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart } = useCart();
  const isInCart = cart.items.some((item) => item.product.id === product.id);
  const isOutOfStock = product.stockQuantity === 0;
  const imageSrc = apiClient.getAssetUrl(product.imageUrl);

  const handleAddToCart = () => {
    if (!isOutOfStock && !isInCart) {
      addToCart(product);
    }
  };

  const buttonClass = `product-button ${
    isOutOfStock
      ? "product-button--disabled"
      : isInCart
      ? "product-button--selected"
      : "product-button--default"
  }`;

  const buttonText = isOutOfStock
    ? "Закончился"
    : isInCart
    ? "Выбрано"
    : "Выбрать";

  return (
    <div className="product-card">
      <img
        className="product-image"
        src={imageSrc}
        alt={product.name}
        width={250}
        height={250}
        loading="lazy"
      />
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
