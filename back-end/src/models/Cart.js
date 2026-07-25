const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Cart ID is required'],
      unique: true,
      trim: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    items: [cartItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cart', cartSchema);
