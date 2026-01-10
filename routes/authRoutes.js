import {
   register,
   verifyEmail,
   resendOtp,
   forgotPassword,
   resetPassword,

} from "../controllers/authController.js";

import express from 'express';

const router = express.Router();


// Auth Routes
router.post("/register",register);

router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;