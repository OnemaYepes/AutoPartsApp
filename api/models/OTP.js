const mongoose = require('mongoose');
const { Schema } = mongoose;

const OTPSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' }, // El código expira en 5 minutos
});

const OTPModel = mongoose.model('OTP', OTPSchema);

module.exports = OTPModel;