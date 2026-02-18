import userModel from '../models/User.js';
import Otp from '../models/OTP.js';
import sendEmail from '../utils/emailService.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Step 1: Send OTP to email
export const verifyLoginUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        let otpRecord = await Otp.findOne({ email });
        if (!otpRecord) otpRecord = new Otp({ email });

        const otp = crypto.randomInt(100000, 999999);
        otpRecord.resetOtp = otp;
        otpRecord.otpExpires = Date.now() + 10 * 60 * 1000;
        await otpRecord.save();

        await sendEmail(
            email,
            'OTP Verification - JewelPix',
            `Hello,

            You requested to login on JewelPix. Please use the OTP below to verify:

            🔹 OTP: ${otp}

            This OTP is valid for 10 minutes.

            Regards,  
            JewelPix Team`
        );
        // console.log(otp)
        res.status(201).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
    }
};

// Step 2: Verify OTP and login user
export const LoginUser = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.resetOtp !== parseInt(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > otpRecord.otpExpires) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Otp.deleteOne({ email });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.json({ success: true, message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'OTP verification failed', error: err.message });
    }
};




export const CreateUser = async (req, res) => {
    const { name, email } = req.body;

    try {
      
        const newUser = new userModel({
            name,
            email,
        });

        await newUser.save();
  

        res.json({ success: true, message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
    }
};
