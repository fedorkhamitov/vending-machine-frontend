import React, { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductCatalog } from "./components/ProductCatalog/ProductCatalog";
import { Cart } from "./components/Cart/Cart";
import { Payment } from "./components/Payment/Payment";
import { OrderResult } from "./components/OrderResult/OrderResult";
import "./App.css";

type Page = "catalog" | "cart" | "payment" | "result";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("catalog");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePaymentSuccess = (message: string) => {
    setResultMessage(message);
    setErrorMessage("");
    setCurrentPage("result");
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
  };

  const renderContent = () => {
    if (errorMessage && currentPage === "payment") {
      return (
        <div className="error-message">
          <h2>Ошибка оплаты</h2>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Попробовать снова</button>
        </div>
      );
    }
    switch (currentPage) {
      case "catalog":
        return <ProductCatalog onCheckout={() => setCurrentPage("cart")} />;
      case "cart":
        return <Cart onCheckout={() => setCurrentPage("payment")} />;
      case "payment":
        return (
          <Payment
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onBack={() => setCurrentPage("cart")}
          />
        );
      case "result":
        return (
          <OrderResult
            message={resultMessage}
            onBackToCatalog={() => setCurrentPage("catalog")}
          />
        );
    }
  };

  return <CartProvider>{renderContent()}</CartProvider>;
}

export default App;
