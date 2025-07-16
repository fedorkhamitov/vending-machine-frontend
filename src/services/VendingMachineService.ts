import { apiClient } from '../api/apiClient';
import { Product, ProductFilter } from '../types/product';

export interface MachineStatus {
  isOccupied: boolean;
}

export class VendingMachineService {
  async acquireLock(filter?: ProductFilter): Promise<{ success: boolean; products?: Product[] }> {
    try {
      const qs = filter
        ? '?' +
          Object.entries(filter)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      const products = (await apiClient.get<Product[]>(`/api/products${qs}`));
      return { success: true, products };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'MACHINE_BUSY') {
        return { success: false };
      }
      throw error;
    }
  }

  async releaseLock(): Promise<void> {
    await apiClient.post('/api/products/release');
  }

  async getStatus(): Promise<MachineStatus> {
    return apiClient.get<MachineStatus>('/api/orders/status');
  }
}

export const vendingMachineService = new VendingMachineService();
