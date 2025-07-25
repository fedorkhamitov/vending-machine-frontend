import { ApiResponse } from '../types/api';
import { OrderResult, CreateOrderRequest } from '../types/order';

export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResult> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const data: ApiResponse<OrderResult> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ошибка создания заказа');
    }
    
    return data.data;
  } catch (error) {
    throw error;
  }
}
