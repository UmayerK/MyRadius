const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: String, unique: true },  // New field added
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
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
