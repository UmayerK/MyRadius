const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  merchantId: { type: String, required: true, unique: true }, // Required merchantId
}, {
  timestamps: true,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
