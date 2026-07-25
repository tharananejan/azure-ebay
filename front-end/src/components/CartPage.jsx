import React, { useState, useEffect } from 'react';

export default function CartPage({ cart, onNavigateHome, onCheckoutSuccess }) {
  const [detailedItems, setDetailedItems] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAppliedMsg, setDiscountAppliedMsg] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCartDetails = async () => {
    try {
      setError('');
      const response = await fetch(`/api/carts/${cart.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart details');
      }
      const data = await response.json();
      setDetailedItems(data.detailedItems || []);
      setTotalBalance(data.totalBalance || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, [cart.id]);

  const handleUpdateQty = async (sku, currentQty, change) => {
    const targetQty = currentQty + change;
    try {
      setError('');
      const response = await fetch(`/api/carts/${cart.id}/items/${sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: targetQty })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update item quantity');
      }
      setDetailedItems(data.detailedItems || []);
      setTotalBalance(data.totalBalance || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItem = async (sku) => {
    try {
      setError('');
      const response = await fetch(`/api/carts/${cart.id}/items/${sku}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item');
      }
      setDetailedItems(data.detailedItems || []);
      setTotalBalance(data.totalBalance || 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === 'CYBER10' || code === 'SAVE10') {
      setDiscountPercent(10);
      setDiscountAppliedMsg('CYBER10 APPLIED (10% DISCOUNT)');
    } else if (code === 'CYBER20' || code === 'SAVE20') {
      setDiscountPercent(20);
      setDiscountAppliedMsg('CYBER20 APPLIED (20% DISCOUNT)');
    } else if (code) {
      setError('INVALID DISCOUNT CODE');
      setDiscountPercent(0);
      setDiscountAppliedMsg('');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCheckout = async () => {
    if (detailedItems.length === 0) {
      setError('Cart is empty. Cannot initiate checkout.');
      return;
    }

    setCheckoutLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/carts/${cart.id}/checkout`, {
        method: 'POST'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }
      
      // Pass receipt text and completed info up
      onCheckoutSuccess(data.receiptText || 'Checkout Successful!');
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Compute calculated subtotal/total
  const totalItemsCount = detailedItems.reduce((acc, item) => acc + item.qty, 0);
  const discountAmount = totalBalance * (discountPercent / 100);
  const finalTotal = totalBalance - discountAmount;

  return (
    <div className="terminal-container">
      {/* Header */}
      <header className="terminal-header">
        <h1 className="terminal-title">Azure-Ebay</h1>
        <button 
          id="home-nav-btn"
          className="terminal-btn-link"
          onClick={onNavigateHome}
        >
          [ BACK_TO_HOME ]
        </button>
      </header>

      {/* Main Section */}
      <main style={{ flex: 1 }}>
        <h2 className="terminal-section-title">&gt; SHOPPING_CART</h2>
        <div className="terminal-divider"></div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem' }}>
            &gt; ERROR: {error}
          </div>
        )}

        {loading ? (
          <div style={{ color: '#88ff88', fontSize: '1rem' }}>&gt; LOADING CART DETAILS...</div>
        ) : detailedItems.length === 0 ? (
          <div style={{ color: '#9ca3af', textAlign: 'center', marginTop: '40px' }}>
            &gt; CART IS EMPTY. RETURNING TO MAIN TO ADD ITEMS.
          </div>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th style={{ textAlign: 'right' }}>UNIT_PRICE</th>
                    <th style={{ textAlign: 'center' }}>QTY</th>
                    <th style={{ textAlign: 'right' }}>SUBTOTAL</th>
                    <th style={{ textAlign: 'center' }}>REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedItems.map((item) => (
                    <tr key={item.sku}>
                      <td>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-sku">SKU: {item.sku}</div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="cart-item-price">
                        {item.price.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleUpdateQty(item.sku, item.qty, -1)}
                          >
                            [-]
                          </button>
                          <span>{item.qty < 10 ? `0${item.qty}` : item.qty}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => handleUpdateQty(item.sku, item.qty, 1)}
                          >
                            [+]
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="cart-item-subtotal">
                        {item.subtotal.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveItem(item.sku)}
                        >
                          <span>[x]</span>
                          <span>REMOVE</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Discount Section */}
            <div className="discount-section">
              <span className="discount-label">&gt; DISCOUNT_CODE:</span>
              <form onSubmit={handleApplyDiscount} className="discount-input-group">
                <input
                  id="discount-input"
                  type="text"
                  className="terminal-input"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="e.g. CYBER10"
                  style={{ flex: 1, padding: '4px 8px', fontSize: '0.9rem' }}
                />
                <button 
                  id="apply-discount-btn"
                  type="submit" 
                  className="terminal-btn-action"
                  style={{ padding: '4px 12px', fontSize: '0.9rem' }}
                >
                  APPLY
                </button>
              </form>
              {discountAppliedMsg && (
                <div style={{ color: '#88ff88', fontSize: '0.8rem', marginTop: '4px' }}>
                  &gt; {discountAppliedMsg}
                </div>
              )}
            </div>

            {/* Summary & Checkout */}
            <div className="cart-summary-container">
              <div className="order-summary-box">
                <div className="order-summary-title">ORDER_SUMMARY</div>
                <div className="order-summary-details">
                  <div>
                    ITEMS: <span className="order-summary-val">{totalItemsCount < 10 ? `0${totalItemsCount}` : totalItemsCount}</span>
                  </div>
                  <div>
                    SUBTOTAL: <span className="order-summary-val">{totalBalance.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div>
                      DISCOUNT: <span className="order-summary-val">-{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="total-checkout-box">
                <div className="total-label-value">
                  <span className="total-label">TOTAL:</span>
                  <span className="total-value">{finalTotal.toFixed(2)}</span>
                </div>

                <button
                  id="checkout-btn"
                  className="btn-checkout"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? '> PROCESSING...' : '> INITIATE_CHECKOUT'}
                </button>
                <div className="secure-connection-tag">
                  SECURE_CONNECTION: ESTABLISHED
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
