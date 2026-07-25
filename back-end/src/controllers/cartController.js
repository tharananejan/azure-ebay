const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { generateReceipt } = require('../utils/receiptGenerator');

// Add cart with customer name (Actor)
const createCart = async (req, res) => {
  try {
    const { customerName, id } = req.body;

    if (!customerName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const cartId = id || `cart_${Date.now()}`;

    const existingCart = await Cart.findOne({ id: cartId });
    if (existingCart) {
      return res.status(400).json({ message: `Cart with ID '${cartId}' already exists` });
    }

    const cart = await Cart.create({
      id: cartId,
      customerName,
      items: []
    });

    res.status(201).json({ message: 'Cart created successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add items to cart (Actor)
const addItemToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, qty } = req.body;

    if (!sku) {
      return res.status(400).json({ message: 'SKU is required' });
    }

    const quantityToAdd = qty && qty > 0 ? Number(qty) : 1;

    // Check if item exists in store inventory
    const item = await Item.findOne({ sku });
    if (!item) {
      return res.status(404).json({ message: `Item with SKU '${sku}' not found in store inventory` });
    }

    const cart = await Cart.findOne({ id });
    if (!cart) {
      return res.status(404).json({ message: `Cart with ID '${id}' not found` });
    }

    // Check if item is already in cart
    const existingCartItem = cart.items.find(cartItem => cartItem.sku === sku);

    if (existingCartItem) {
      existingCartItem.qty += quantityToAdd;
    } else {
      cart.items.push({ sku, qty: quantityToAdd });
    }

    await cart.save();

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to compute cart detailed items and total balance
const calculateCartTotals = async (cart) => {
  let totalBalance = 0;
  const detailedItems = [];

  for (const cartItem of cart.items) {
    const item = await Item.findOne({ sku: cartItem.sku });
    const price = item ? item.price : 0;
    const name = item ? item.name : 'Unknown Item';
    const subtotal = price * cartItem.qty;

    totalBalance += subtotal;

    detailedItems.push({
      sku: cartItem.sku,
      name,
      price,
      qty: cartItem.qty,
      subtotal
    });
  }

  return { detailedItems, totalBalance };
};

// See total balance (Actor)
const getCartBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ id });
    if (!cart) {
      return res.status(404).json({ message: `Cart with ID '${id}' not found` });
    }

    const { detailedItems, totalBalance } = await calculateCartTotals(cart);

    res.status(200).json({
      cartId: cart.id,
      customerName: cart.customerName,
      itemsCount: cart.items.length,
      detailedItems,
      totalBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cart details
const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ id });
    if (!cart) {
      return res.status(404).json({ message: `Cart with ID '${id}' not found` });
    }

    const { detailedItems, totalBalance } = await calculateCartTotals(cart);

    res.status(200).json({
      cart,
      detailedItems,
      totalBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Checkout & generate .txt receipt (Actor)
const checkout = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ id });
    if (!cart) {
      return res.status(404).json({ message: `Cart with ID '${id}' not found` });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot perform checkout.' });
    }

    const { detailedItems, totalBalance } = await calculateCartTotals(cart);

    // Generate .txt receipt
    const receiptInfo = generateReceipt(cart, detailedItems, totalBalance);

    res.status(200).json({
      message: 'Checkout successful. Receipt generated.',
      cartId: cart.id,
      customerName: cart.customerName,
      totalBalance,
      receiptFileName: receiptInfo.fileName,
      receiptFilePath: receiptInfo.filePath,
      receiptText: receiptInfo.receiptText
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCart,
  addItemToCart,
  getCartBalance,
  getCart,
  checkout
};
