import { apiClient } from '../api/apiClient';

export interface MachineStatus {
  isOccupied: boolean;
}

export class VendingMachineService {
  async acquireLock(): Promise<boolean> {
    try {
      await apiClient.post('/api/vending-machine/acquire');
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'MACHINE_BUSY') {
        return false;
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