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

  // Start background process after connecting to MongoDB
  setInterval(updateVerdicts, 1000);
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Middleware to authenticate requests and attach merchantId, userId, and admin status
app.use(async (req, res, next) => {
  const userId = req.headers['x-user-id']; // Assuming userId is sent in the request headers
  req.userId = userId;

  if (userId) {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        req.merchantId = user.merchantId; // Attach merchantId to the request
        req.isAdmin = user.email === 'admin@admin.com'; // Determine if the user is an admin
        console.log(`User logged in: ${user.email}, isAdmin: ${req.isAdmin}`);
      } else {
        return res.status(400).json('User not found.');
      }
    } catch (err) {
      console.error('Error fetching user information:', err);
      return res.status(500).json('Error fetching user information.');
    }
  } else {
    console.log('No userId in headers');
  }

  next();
});

// Update the endpoint to get orders based on admin status
app.get('/api/orders/history', (req, res) => {
  const query = req.isAdmin ? {} : { merchantId: req.merchantId };  // Fetch all orders if admin, else filter by merchantId
  console.log(`Fetching orders with query:`, query);
  orderModel.find(query)
    .then(orders => {
      console.log(`Orders fetched: ${orders.length}`);
      res.json(orders);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to create a new order
app.post('/api/orders', (req, res) => {
  const { ...restOfBody } = req.body;
  const newOrder = new orderModel({
    ...restOfBody,
    merchantId: req.merchantId, // Associate with logged-in user's merchantId
    fulfillerId: null // Set fulfillerId to null
  });
  
  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to update fulfillerId for selected orders
app.patch('/api/orders', (req, res) => {
  const { ids, fulfillerId } = req.body;
  orderModel.updateMany({ _id: { $in: ids } }, { $set: { fulfillerId } })
    .then(() => res.json('Orders updated!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint to move an order to a new status and update the verdict
app.patch('/api/orders/move', (req, res) => {
  const { workItemId, newStatus } = req.body;

  // Determine the verdict based on the new status
  let verdict;
  switch (newStatus) {
    case 'accepted':
      verdict = 0;
      break;
    case 'inprogress':
      verdict = 1;
      break;
    case 'waitlisted':
      verdict = 2;
      break;
    case 'finished':
      verdict = 3;
      break;
    default:
      return res.status(400).json('Invalid status provided.');
  }

  // Update the order with the new status and verdict
  orderModel.findByIdAndUpdate(workItemId, { status: newStatus, verdict: verdict }, { new: true })
    .then(updatedOrder => res.json(updatedOrder))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Background process to check for TTL expiry and update verdicts
async function updateVerdicts() {
  const now = new Date();

  try {
    // Find orders where TTL is close to expiration (e.g., within the next second)
    const orders = await orderModel.find({
      ttl: { $lte: new Date(now.getTime() + 1000) },
      verdict: { $ne: 3 } // Only update if verdict is not already 3
    });

    orders.forEach(async (order) => {
      order.verdict = 3;
      await order.save();
    });
  } catch (err) {
    console.error('Error updating verdicts:', err);
  }
}

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
