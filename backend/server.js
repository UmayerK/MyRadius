const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderModel = require('./Actual_Collection'); // Ensure correct path to the model file
const userModel = require('./userModel'); // Ensure correct path to the user model

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
  const { email, password, username, merchantId } = req.body;
  console.log('Received registration data:', req.body);

  const newUser = new userModel({ email, password, username, merchantId });

  newUser.save()
    .then(() => res.json({ success: true, userId: newUser._id }))
    .catch(err => {
      if (err.code === 11000) { // Handle duplicate key errors
        if (err.keyPattern && err.keyPattern.email) {
          res.status(400).json('Email already exists.');
        } else if (err.keyPattern && err.keyPattern.username) {
          res.status(400).json('Username already exists.');
        } else if (err.keyPattern && err.keyPattern.merchantId) {
          res.status(400).json('Merchant ID already exists.');
        } else {
          res.status(400).json('Duplicate key error.');
        }
      } else {
        console.error('Error saving user:', err);
        res.status(400).json('Error: ' + err);
      }
    });
});

// Endpoint to login a user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email, password })
    .then(user => {
      if (user) {
        res.json({ success: true, userId: user._id });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to get user information
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  userModel.findById(userId)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to update user information
app.post('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  userModel.findByIdAndUpdate(userId, { $set: updatedData }, { new: true })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => {
      console.error('Error updating user:', err);
      res.status(400).json('Error: ' + err);
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
