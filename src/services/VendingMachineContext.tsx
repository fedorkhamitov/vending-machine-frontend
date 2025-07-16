// src/services/VendingMachineContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { vendingMachineService, MachineStatus } from './VendingMachineService';
import { ProductFilter } from '../types/product';

interface VendingMachineState {
  isLocked: boolean;
  isOccupied: boolean;
  isLoading: boolean;
  error: string | null;
  lastStatusCheck: number;
}

type VendingMachineAction =
  | { type: 'LOCK_ACQUIRED' }
  | { type: 'LOCK_RELEASED' }
  | { type: 'STATUS_UPDATED'; payload: { isOccupied: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: VendingMachineState = {
  isLocked: false,
  isOccupied: false,
  isLoading: false,
  error: null,
  lastStatusCheck: 0,
};

function vendingMachineReducer(
  state: VendingMachineState,
  action: VendingMachineAction
): VendingMachineState {
  switch (action.type) {
    case 'LOCK_ACQUIRED':
      return { ...state, isLocked: true, error: null };
    case 'LOCK_RELEASED':
      return { ...state, isLocked: false, error: null };
    case 'STATUS_UPDATED':
      return {
        ...state,
        isOccupied: action.payload.isOccupied,
        lastStatusCheck: Date.now(),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface VendingMachineContextType {
  state: VendingMachineState;
  acquireLock: () => Promise<boolean>;
  releaseLock: () => Promise<void>;
  checkStatus: () => Promise<MachineStatus>;
  clearError: () => void;
}

const VendingMachineContext = createContext<VendingMachineContextType | undefined>(
  undefined
);

export function VendingMachineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    vendingMachineReducer,
    initialState
  );

  // Периодическая проверка занятости автомата
  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const status = await vendingMachineService.getStatus();
        dispatch({ type: 'STATUS_UPDATED', payload: status });
      } catch {
        console.error('Status check failed');
      }
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const acquireLock = async (): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const result = await vendingMachineService.acquireLock();
      if (result.success) {
        dispatch({ type: 'LOCK_ACQUIRED' });
        return true;
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Автомат занят другим пользователем',
        });
        return false;
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка захвата автомата' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const releaseLock = async (): Promise<void> => {
    try {
      await vendingMachineService.releaseLock();
      dispatch({ type: 'LOCK_RELEASED' });
    } catch {
      console.error('Release lock failed');
    }
  };

  const checkStatus = async (): Promise<MachineStatus> => {
    const status = await vendingMachineService.getStatus();
    dispatch({ type: 'STATUS_UPDATED', payload: status });
    return status;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <VendingMachineContext.Provider
      value={{ state, acquireLock, releaseLock, checkStatus, clearError }}
    >
      {children}
    </VendingMachineContext.Provider>
  );
}

export function useVendingMachine() {
  const context = useContext(VendingMachineContext);
  if (!context) {
    throw new Error(
      'useVendingMachine must be used within VendingMachineProvider'
    );
  }
  return context;
}
