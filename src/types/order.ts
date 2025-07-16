export interface OrderItem {
  productId: string;
  productName: string;
  brandId: string;
  brandName: string;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
}

export interface OrderResult {
  order: Order;
  change: Record<number, number>;
  message: string;
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  insertedCoins: Record<number, number>;
}
