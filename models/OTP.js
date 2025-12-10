const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB auto delete after expiration
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  collection: 'otps'
});

module.exports = mongoose.model('OTP', otpSchema);
