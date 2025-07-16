import { useState, useEffect } from 'react';
import { getMachineStatus } from '../api/orders';

export function useMachineStatus(intervalMs: number = 5000) {
  const [isOccupied, setIsOccupied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getMachineStatus();
        setIsOccupied(status.isOccupied);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);
  
  return { isOccupied, loading, error };
}
