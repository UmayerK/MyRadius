const mongoose = require('mongoose');

const Schema = new mongoose.Schema({ 
    name: String,
    price: Number,
    weight: Number,
    quantity: Number,
    urgency: Number,
    verdict: Number, // This should be present to store the status
    pallet_fullness: Number
});

const model = mongoose.model('Actual_collection', Schema);
module.exports = model;
