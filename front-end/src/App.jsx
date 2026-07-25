import React, { useState, useEffect } from 'react';
import CustomerModal from './components/CustomerModal';
import MainPage from './components/MainPage';
import CartPage from './components/CartPage';
import ReceiptModal from './components/ReceiptModal';

export default function App() {
  const [cart, setCart] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [receiptText, setReceiptText] = useState(null);

  // Check localStorage on load for active session
  useEffect(() => {
    const savedCart = localStorage.getItem('active_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('active_cart');
      }
    }
  }, []);

  const handleCreateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('active_cart', JSON.stringify(newCart));
  };

  const handleCheckoutSuccess = (text) => {
    // Save receipt text to trigger ReceiptModal
    setReceiptText(text);
  };

  const handleCloseReceipt = () => {
    // Clear state and localStorage to start a fresh session
    setReceiptText(null);
    setCart(null);
    setCurrentPage('home');
    localStorage.removeItem('active_cart');
  };

  return (
    <>
      {/* If no cart exists, prompt for name */}
      {!cart && <CustomerModal onCreateCart={handleCreateCart} />}

      {/* Main Pages */}
      {cart && currentPage === 'home' && (
        <MainPage
          cart={cart}
          onNavigateToCart={() => setCurrentPage('cart')}
        />
      )}

      {cart && currentPage === 'cart' && (
        <CartPage
          cart={cart}
          onNavigateHome={() => setCurrentPage('home')}
          onCheckoutSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Receipt view at end of flow */}
      {receiptText && (
        <ReceiptModal
          receiptText={receiptText}
          onClose={handleCloseReceipt}
        />
      )}
    </>
  );
}
