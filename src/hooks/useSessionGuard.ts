// src/hooks/useSessionGuard.ts

import { useEffect } from 'react';
import { useVendingMachine } from '../services/VendingMachineContext';

export function useSessionGuard() {
  const {
    state,
    checkStatus,
    acquireLock,
    releaseLock,
    clearError,
  } = useVendingMachine();

  useEffect(() => {
    let mounted = true;
    let timerId: number;

    (async () => {
      // 1) Ждём, пока автомат не будет занят
      timerId = window.setInterval(async () => {
        const status = await checkStatus();
        if (!status.isOccupied && mounted) {
          clearInterval(timerId);
          // 2) Захватываем автомат
          const ok = await acquireLock();
          if (ok) clearError();
        }
      }, 1000);
    })();

    return () => {
      mounted = false;
      clearInterval(timerId);
      if (state.isLocked) {
        releaseLock();
      }
    };
  }, [
    checkStatus,
    acquireLock,
    releaseLock,
    clearError,
    state.isLocked,
  ]);

  return {
    isLocked: state.isLocked,
    isLoading: state.isLoading,
    error: state.error,
  };
}
