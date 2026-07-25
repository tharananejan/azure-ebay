require('dotenv').config();
const express = require('express');
const connectDB = require('../config/db');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/carts', cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
