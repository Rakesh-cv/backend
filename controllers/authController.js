import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import emailTransport from '../utils/emailService.js';


// Helper
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    await OTP.deleteMany({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    await emailTransport(
      email,
      "Email Verification OTP",
      `<p>Your OTP is <b>${otp}</b>. Valid for 10 minutes.</p>`
    );

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });
    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const validOtp = await bcrypt.compare(otp.toString(), record.otp);
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP" });

    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteMany({ email });

    res.json({ message: "Email verified successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!(await User.findOne({ email }))) {
      return res.status(404).json({ message: "User not found" });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await emailTransport(
      email,
      "Resend OTP",
      `<p>Your new OTP is <b>${otp}</b></p>`
    );

    res.json({ message: "OTP resent successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};



// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await OTP.create({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = await OTP.findOne({ email, otp });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    await OTP.deleteMany({ email });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

