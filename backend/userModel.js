// userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  merchantId: { type: String, default: '' },
  profileId: { type: String, default: '' },
  merchantOrderSupportContact: {
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' }
  },
  supportContact: {
    email: { type: String, default: '' }
  },
  merchantSalesChannel: { type: String, default: '' },
  merchantCustomerId: { type: String, default: '' }
});

// Middleware to generate userid before saving
userSchema.pre('save', function(next) {
  if (!this.userid) {
    this.userid = 'user_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
