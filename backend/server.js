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

// Middleware to authenticate requests and attach merchantId, fulfillerId, and admin status
app.use(async (req, res, next) => {
  const userId = req.headers['x-user-id']; // Assuming userId is sent in the request headers
  req.userId = userId;

  if (userId) {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        req.merchantId = user.merchantId; // Attach merchantId to the request
        req.fulfillerId = user.fulfillerId; // Attach fulfillerId to the request
        req.isAdmin = user.merchantId === '0' && user.fulfillerId === '0'; // Determine if the user is an admin
      } else {
        return res.status(400).json('User not found.');
      }
    } catch (err) {
      return res.status(500).json('Error fetching user information.');
    }
  }

  next();
});

// Endpoint to get all orders with fulfillerId set to null (Accept Work Tab)
app.get('/api/orders', (req, res) => {
  if (req.isAdmin) {
    orderModel.find({ fulfillerId: { $ne: null } }) // Admin sees only orders that are accepted (i.e., in someone's backlog)
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
  } else {
    orderModel.find({ fulfillerId: null })
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
  }
});

// Endpoint to get orders where fulfillerId matches the logged-in user (History Tab)
app.get('/api/orders/history', (req, res) => {
  if (req.isAdmin) {
    orderModel.find({ fulfillerId: { $ne: null } }) // Admin sees only orders that are accepted (i.e., in someone's backlog)
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
  } else {
    orderModel.find({ fulfillerId: req.userId })
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
  }
});

// Endpoint to create a new order
app.post('/api/orders', (req, res) => {
  const { ttl, ...restOfBody } = req.body; // Get TTL from the request body
  const newOrder = new orderModel({
    ...restOfBody,
    ttl, // Set TTL from the form input
    merchantId: req.merchantId, // Associate with logged-in user's merchantId
    fulfillerId: null, // Set fulfillerId to null
    verdict: 0, // Set the initial verdict to 0 when the order is created
    status: 'accepted', // Set the initial status to 'accepted'
  });
  
  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to update fulfillerId for selected orders
app.patch('/api/orders', (req, res) => {
  if (req.isAdmin) {
    return res.status(403).json('Admins cannot modify orders.');
  }

  const { ids, fulfillerId } = req.body;
  orderModel.updateMany({ _id: { $in: ids } }, { $set: { fulfillerId } })
    .then(() => res.json('Orders updated!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to move an order to a new status and update the verdict
app.patch('/api/orders/move', async (req, res) => {
  if (req.isAdmin) {
    return res.status(403).json('Admins cannot move orders.');
  }

  const { workItemId, newStatus } = req.body;

  try {
    const order = await orderModel.findById(workItemId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = newStatus;

    // Set verdict based on new status
    switch (newStatus) {
      case 'accepted':
        order.verdict = 0;
        break;
      case 'inprogress':
        order.verdict = 1;
        order.startTTLCountdown(); // Start the TTL countdown when moving to 'inprogress'
        break;
      case 'waitlisted':
        order.verdict = 2;
        break;
      case 'finished':
        order.verdict = 3;
        break;
      default:
        return res.status(400).json({ message: 'Invalid status' });
    }

    await order.save(); // Save the order after updating status and verdict

    res.json(order);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Endpoint to get all registered emails
app.get('/api/users/emails', (req, res) => {
  userModel.find({}, 'email') // Fetch only the 'email' field from all users
    .then(users => {
      const emails = users.map(user => user.email);
      res.json(emails);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to get orders by email (in backlog)
app.get('/api/orders/by-email', (req, res) => {
  const { email } = req.query;
  orderModel.find({ fulfillerId: { $ne: null }, 'supportContact.email': email })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to get all orders for admin view
app.get('/api/admin/orders/all', (req, res) => {
  orderModel.find({ fulfillerId: { $ne: null } }) // Admin sees only orders that are accepted (i.e., in someone's backlog)
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to register a new user
app.post('/api/register', (req, res) => {
  const { email, password, username, merchantId, fulfillerId } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !username || !merchantId || !fulfillerId) {
    return res.status(400).json('All fields are required.');
  }

  const newUser = new userModel({
    email,
    password,
    username,
    merchantId,
    fulfillerId
  });

  newUser.save()
    .then(() => res.json({ success: true, userId: newUser._id }))
    .catch(err => {
      if (err.code === 11000) {
        if (err.keyPattern.email) {
          res.status(400).json('Email already exists.');
        } else if (err.keyPattern.username) {
          res.status(400).json('Username already exists.');
        } else {
          res.status(400).json('Duplicate key error.');
        }
      } else {
        console.error('Error saving user:', err); // Log error
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
      console.error('Error updating user:', err); // Log error
      res.status(400).json('Error: ' + err);
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
