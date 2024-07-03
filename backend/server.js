const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const model = require('./Actual_Collection');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://umayer:umayer@cluster0.cs4vu4j.mongodb.net/NEW_DATABASE_NAME', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/api/orders', (req, res) => {
  model.find()
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/api/orders', (req, res) => {
  const newOrder = new model(req.body);
  newOrder.save()
    .then(() => res.json('Order added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
