const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  merchantId: { type: String, required: true }, // Merchant ID is required
  fulfillerId: { type: String, required: true }, // Fulfiller ID is required
});

userSchema.pre('save', function(next) {
  if (!this.userid) {
    this.userid = 'user_' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
