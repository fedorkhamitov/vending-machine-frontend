import { apiClient } from '../api/apiClient';
import { Product, ProductFilter } from '../types/product';

export interface MachineStatus {
  isOccupied: boolean;
}

export class VendingMachineService {
  async acquireLock(filter?: ProductFilter): Promise<{ success: boolean; products?: Product[] }> {
    try {
      await apiClient.post('/api/products/acquire');

      const qs = filter
        ? '?' +
          Object.entries(filter)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';

      const products = await apiClient.get<Product[]>(`/api/products${qs}`);
      return { success: true, products };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'MACHINE_BUSY') {
        return { success: false };
      }
      throw error;
    }
  }

  async releaseLock(): Promise<void> {
    try {
      await apiClient.post('/api/products/release');
    } catch (error) {
      console.error('Не удалось освободить блокировку:', error);
    }
  }


  async getStatus(): Promise<MachineStatus> {
    return apiClient.get<MachineStatus>('/api/products/status');
  }
}

export const vendingMachineService = new VendingMachineService();
