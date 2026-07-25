import React from 'react';

export default function ReceiptModal({ receiptText, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px', borderColor: '#88ff88' }}>
        <h2 className="modal-title" style={{ color: '#88ff88' }}>&gt; CHECKOUT_RECEIPT_GENERATED</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <pre className="receipt-pre">{receiptText}</pre>
        </div>

        <div style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.85rem' }}>
          &gt; SESSION TERMINATED. CART DELETED FROM DATABASE.
        </div>

        <button
          id="close-receipt-btn"
          className="terminal-btn-action"
          style={{ width: '100%' }}
          onClick={onClose}
        >
          &gt; RESTART_NEW_SESSION
        </button>
      </div>
    </div>
  );
}
