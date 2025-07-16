import { useEffect } from 'react';
import { useVendingMachine } from '../services/VendingMachineContext';

export function useSessionGuard() {
  const { state, acquireLock, releaseLock } = useVendingMachine();
  
  useEffect(() => {
    const handleAcquire = async () => {
      if (!state.isLocked && !state.isLoading) {
        await acquireLock();
      }
    };
    
    handleAcquire();
    
    return () => {
      if (state.isLocked) {
        releaseLock();
      }
    };
  }, [state.isLocked, state.isLoading]);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.isLocked) {
        releaseLock();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.isLocked, releaseLock]);
  
  return {
    isLocked: state.isLocked,
    isLoading: state.isLoading,
    error: state.error,
  };
}
