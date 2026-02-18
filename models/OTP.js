import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true},
  resetOtp: { type: Number, required: true },
  otpExpires: { type: Date, required: true }
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
