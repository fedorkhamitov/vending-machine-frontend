import React, { useEffect, useState } from 'react';
import { useVendingMachine } from '../../services/VendingMachineContext'; 
import './BusyModal.css';

interface BusyModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function BusyModal({ isOpen, message, onClose }: BusyModalProps) {
  const { checkStatus } = useVendingMachine();
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          checkStatus();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, checkStatus]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" className="busy-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 17l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
          </svg>
        </div>
        <h2>Автомат занят</h2>
        <p>{message}</p>
        <p>Повторная проверка через {countdown} секунд</p>
        <div className="modal-actions">
          <button onClick={onClose} className="primary-btn">
            Вернуться в каталог
          </button>
        </div>
      </div>
    </div>
  );
}
