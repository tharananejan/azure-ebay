const fs = require('fs');
const path = require('path');

const generateReceipt = (cart, detailedItems, totalBalance) => {
  const receiptsDir = path.join(__dirname, '../../receipts');
  
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `receipt_${cart.id}_${timestamp}.txt`;
  const filePath = path.join(receiptsDir, fileName);

  let receiptText = `========================================\n`;
  receiptText += `             E-COMZ RECEIPT             \n`;
  receiptText += `========================================\n`;
  receiptText += `Date: ${new Date().toLocaleString()}\n`;
  receiptText += `Cart ID: ${cart.id}\n`;
  receiptText += `Customer: ${cart.customerName}\n`;
  receiptText += `----------------------------------------\n`;
  receiptText += `ITEMS:\n`;

  detailedItems.forEach((item, index) => {
    const itemTotal = (item.price * item.qty).toFixed(2);
    receiptText += `${index + 1}. ${item.name} (SKU: ${item.sku})\n`;
    receiptText += `   Qty: ${item.qty} x $${item.price.toFixed(2)} = $${itemTotal}\n`;
  });

  receiptText += `----------------------------------------\n`;
  receiptText += `TOTAL BALANCE: $${totalBalance.toFixed(2)}\n`;
  receiptText += `========================================\n`;

  fs.writeFileSync(filePath, receiptText, 'utf8');

  return {
    filePath,
    fileName,
    receiptText
  };
};

module.exports = { generateReceipt };
