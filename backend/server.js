const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Your Atlas connection string
const mongoURI = 'mongodb+srv://umayer:umayer@cluster.udu9ph7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

async function connect() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

connect();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});