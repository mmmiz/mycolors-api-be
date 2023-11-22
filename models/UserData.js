  const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpires: Date,

  });

  const User = mongoose.model('User', userSchema);
  module.exports = User;
