import React, { useState, useEffect } from 'react';

export default function MainPage({ cart, onNavigateToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addingSku, setAddingSku] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchItems = async () => {
    try {
      setError('');
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
      
      // Initialize default quantities of "01"
      const defaultQtys = {};
      data.forEach(item => {
        defaultQtys[item.sku] = '01';
      });
      setQuantities(defaultQtys);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleQtyChange = (sku, val) => {
    // Keep quantity as string for clean display, e.g. "01" or "02"
    // Only allow positive numbers
    const cleanVal = val.replace(/[^0-9]/g, '');
    setQuantities(prev => ({
      ...prev,
      [sku]: cleanVal
    }));
  };

  const handleQtyBlur = (sku) => {
    // Format to double digit on blur
    let val = parseInt(quantities[sku], 10);
    if (isNaN(val) || val < 0) val = 0;
    const formatted = val < 10 ? `0${val}` : `${val}`;
    setQuantities(prev => ({
      ...prev,
      [sku]: formatted
    }));
  };

  const handleAddToCart = async (sku) => {
    const qtyVal = parseInt(quantities[sku], 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setError('Please select a valid quantity greater than 0.');
      return;
    }

    setAddingSku(sku);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`/api/carts/${cart.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, qty: qtyVal })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      setSuccessMsg(`SUCCESS: Added ${qtyVal} item(s) to cart.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingSku(null);
    }
  };

  // Seed default inventory items if empty
  const handleSeedInventory = async () => {
    setLoading(true);
    setError('');
    const sampleItems = [
      { name: 'SYSTEM_UNIT_01', sku: 'SYSTEM_UNIT_01', price: 1299.00 },
      { name: 'MECH_KEYBOARD_RED', sku: 'MECH_KEYBOARD_RED', price: 129.50 },
      { name: 'MONITOR_CRT_20', sku: 'MONITOR_CRT_20', price: 250.00 }
    ];

    try {
      for (const item of sampleItems) {
        await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      await fetchItems();
    } catch (err) {
      setError('Error seeding inventory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-container">
      {/* Header */}
      <header className="terminal-header">
        <h1 className="terminal-title">Azure-Ebay</h1>
        <button 
          id="cart-nav-btn"
          className="terminal-btn-link"
          onClick={onNavigateToCart}
        >
          [ CART ]
        </button>
      </header>

      {/* Main Section */}
      <main style={{ flex: 1 }}>
        <h2 className="terminal-section-title">&gt; LIST_PRODUCTS --all</h2>
        <div className="terminal-divider"></div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem' }}>
            &gt; ERROR: {error}
          </div>
        )}

        {successMsg && (
          <div style={{ color: '#88ff88', marginBottom: '20px', fontSize: '0.9rem' }}>
            &gt; {successMsg}
          </div>
        )}

        {loading ? (
          <div style={{ color: '#88ff88', fontSize: '1rem' }}>&gt; LOADING INVENTORY...</div>
        ) : items.length === 0 ? (
          <div style={{ marginTop: '20px' }}>
            <p style={{ color: '#9ca3af', marginBottom: '15px' }}>&gt; INVENTORY IS EMPTY. SEED INITIAL SAMPLE DATA?</p>
            <button 
              id="seed-btn"
              className="terminal-btn-action" 
              onClick={handleSeedInventory}
            >
              &gt; SEED_STORE_DATA
            </button>
          </div>
        ) : (
          <div className="product-list">
            {items.map((item) => (
              <div className="product-row" key={item.sku}>
                <span className="product-name">{item.name}</span>
                <div className="product-actions">
                  <span className="product-price">
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  <div className="qty-controls">
                    <span className="qty-label">QTY:</span>
                    <input
                      type="text"
                      className="qty-input-box"
                      value={quantities[item.sku] || '01'}
                      onChange={(e) => handleQtyChange(item.sku, e.target.value)}
                      onBlur={() => handleQtyBlur(item.sku)}
                    />
                  </div>

                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(item.sku)}
                    disabled={addingSku === item.sku}
                  >
                    {addingSku === item.sku ? '[...]' : '[+]'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '40px', borderTop: '1px solid #1f2937', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.8rem' }}>
        <span>OPERATOR: {cart?.customerName}</span>
        <span>SESSION_ID: {cart?.id}</span>
      </footer>
    </div>
  );
}
