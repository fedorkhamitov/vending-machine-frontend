import React from 'react';
import './BusyModal.css';

interface BusyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusyModal({ isOpen, onClose }: BusyModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Автомат занят</h2>
        <p>Извините, в данный момент автомат занят. Пожалуйста, попробуйте позже.</p>
        <button className="modal-close-btn" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
}
