import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductCatalog } from './components/ProductCatalog/ProductCatalog';
import { Cart } from './components/Cart/Cart';
import { Payment } from './components/Payment/Payment';
import { OrderResult } from './components/OrderResult/OrderResult';
import { BusyModal } from './components/BusyModal/BusyModal';
import { useMachineStatus } from './hooks/useMachineStatus';
import './App.css';

type Page = 'catalog' | 'cart' | 'payment' | 'result';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showBusyModal, setShowBusyModal] = useState(false);
  
  const { isOccupied, error: statusError } = useMachineStatus();
  
  useEffect(() => {
    if (isOccupied && currentPage !== 'result') {
      setShowBusyModal(true);
    }
  }, [isOccupied, currentPage]);
  
  const handleCheckout = () => {
    if (isOccupied) {
      setShowBusyModal(true);
      return;
    }
    setCurrentPage('payment');
  };
  
  const handlePaymentSuccess = (message: string) => {
    setResultMessage(message);
    setCurrentPage('result');
  };
  
  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    // Остаемся на странице оплаты
  };
  
  const handleBackToCatalog = () => {
    setCurrentPage('catalog');
    setResultMessage('');
    setErrorMessage('');
  };
  
  const handleBackToCart = () => {
    setCurrentPage('cart');
    setErrorMessage('');
  };
  
  const renderNavigation = () => {
    if (currentPage === 'result') return null;
    
    return (
      <nav className="app-nav">
        <button
          className={`nav-btn ${currentPage === 'catalog' ? 'active' : ''}`}
          onClick={handleBackToCatalog}
        >
          Каталог
        </button>
        <button
          className={`nav-btn ${currentPage === 'cart' ? 'active' : ''}`}
          onClick={() => setCurrentPage('cart')}
        >
          Корзина
        </button>
      </nav>
    );
  };
  
  const renderContent = () => {
    if (errorMessage) {
      return (
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Закрыть</button>
        </div>
      );
    }
    
    switch (currentPage) {
      case 'catalog':
        return <ProductCatalog />;
      
      case 'cart':
        return <Cart onCheckout={handleCheckout} />;
      
      case 'payment':
        return (
          <Payment
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onBack={handleBackToCart}
          />
        );
      
      case 'result':
        return (
          <OrderResult
            message={resultMessage}
            onBackToCatalog={handleBackToCatalog}
          />
        );
      
      default:
        return <ProductCatalog />;
    }
  };
  
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <h1>Автомат с газированными напитками</h1>
          {renderNavigation()}
        </header>
        
        <main className="app-main">
          {renderContent()}
        </main>
        
        <BusyModal
          isOpen={showBusyModal}
          onClose={() => setShowBusyModal(false)}
        />
      </div>
    </CartProvider>
  );
}

export default App;
