const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderModel = require('./Actual_Collection'); // Ensure correct path to the model file
const userModel = require('./userModel'); // Assuming user model is defined in userModel.js

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/NEW_DATABASE_NAME', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Endpoint to get all orders
app.get('/api/orders', (req, res) => {
  orderModel.find()
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to create a new order
app.post('/api/orders', (req, res) => {
  const newOrder = new orderModel(req.body);
  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to register a new user
app.post('/api/register', (req, res) => {
  const { email, password, username } = req.body;
  const newUser = new userModel({ email, password, username });

  newUser.save()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to login a user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email, password })
    .then(user => {
      if (user) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
