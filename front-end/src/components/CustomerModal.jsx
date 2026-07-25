import React, { useState } from 'react';

export default function CustomerModal({ onCreateCart }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create cart');
      }
      onCreateCart(data.cart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: '#88ff88' }}>
        <h2 className="modal-title" style={{ color: '#88ff88' }}>&gt; IDENTITY_VERIFICATION</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name-input" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              ENTER CUSTOMER NAME:
            </label>
            <input
              id="name-input"
              type="text"
              className="terminal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus
              disabled={loading}
            />
          </div>
          {error && (
            <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '0.85rem' }}>
              &gt; ERROR: {error}
            </div>
          )}
          <button
            id="submit-name-btn"
            type="submit"
            className="terminal-btn-action"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'INITIALIZING...' : '> ESTABLISH_SESSION'}
          </button>
        </form>
      </div>
    </div>
  );
}
