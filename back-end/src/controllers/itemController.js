const Item = require('../models/Item');

// Add Item (Manager)
const addItem = async (req, res) => {
  try {
    const { name, sku, price } = req.body;

    if (!name || !sku || price === undefined) {
      return res.status(400).json({ message: 'Name, SKU, and price are required' });
    }

    const existingItem = await Item.findOne({ sku });
    if (existingItem) {
      return res.status(400).json({ message: `Item with SKU '${sku}' already exists` });
    }

    const item = await Item.create({ name, sku, price });
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Item by ID or SKU
const getItemByIdOrSku = async (req, res) => {
  try {
    const { identifier } = req.params;
    let item = await Item.findOne({ sku: identifier });

    if (!item && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Item.findById(identifier);
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Item (Manager)
const editItem = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { name, sku, price } = req.body;

    let item = await Item.findOne({ sku: identifier });

    if (!item && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Item.findById(identifier);
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (name !== undefined) item.name = name;
    if (price !== undefined) item.price = price;
    if (sku !== undefined && sku !== item.sku) {
      const existingSku = await Item.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ message: `Item with SKU '${sku}' already exists` });
      }
      item.sku = sku;
    }

    const updatedItem = await item.save();
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Item (Manager)
const removeItem = async (req, res) => {
  try {
    const { identifier } = req.params;

    let item = await Item.findOneAndDelete({ sku: identifier });

    if (!item && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Item.findByIdAndDelete(identifier);
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  getItems,
  getItemByIdOrSku,
  editItem,
  removeItem
};
