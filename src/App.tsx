import React, { useState } from 'react';
import { VendingMachineProvider } from './services/VendingMachineContext';
import { CartProvider } from './context/CartContext';
import { ProductCatalog } from './components/ProductCatalog/ProductCatalog';
import { Cart } from './components/Cart/Cart';
import { Payment } from './components/Payment/Payment';
import { OrderResult } from './components/OrderResult/OrderResult';
import './App.css';

type Page = 'catalog' | 'cart' | 'payment' | 'result';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showBusyModal, setShowBusyModal] = useState(false);

  const handlePaymentSuccess = (message: string) => {
    setResultMessage(message);
    setErrorMessage('');
    setCurrentPage('result');
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
  };

  const handleBackToCatalog = () => {
    setCurrentPage('catalog');
    setResultMessage('');
  };

  const handleBackToCart = () => {
    setCurrentPage('cart');
    setErrorMessage('');
  };

  const renderContent = () => {
    if (errorMessage) {
      return (
        <div className="error-message">
          <h2>Ошибка оплаты</h2>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Попробовать снова</button>
        </div>
      );
    }
    switch (currentPage) {
      case 'catalog':
        return <ProductCatalog />;
      case 'cart':
        return <Cart onCheckout={() => setCurrentPage('payment')} />;
      case 'payment':
        return (
          <Payment
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onBack={() => setCurrentPage('cart')}
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
    <VendingMachineProvider>
      <CartProvider>
        <div className="app">
          <header className="app-header">
            <h1>Автомат с газированными напитками</h1>
            {currentPage !== 'result' && (
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
            )}
          </header>
          
          <main className="app-main">
            {renderContent()}
          </main>
        </div>
      </CartProvider>
    </VendingMachineProvider>
  );
}

export default App;