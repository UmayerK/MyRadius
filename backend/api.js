const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/NEW_DATABASE_NAME";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const orderSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  weight: Number,
  urgency: Number,
  pallette_fullness: Number,
  verdict: Number
});

const Order = mongoose.model('Actual_Collection', orderSchema);

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orders/:id/verdict', async (req, res) => {
  try {
    const { id } = req.params;
    const { verdict } = req.body;
    const order = await Order.findByIdAndUpdate(id, { verdict: verdict }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
