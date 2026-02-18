import {
   verifyLoginUser,
   LoginUser,
   CreateUser


} from "../controllers/authController.js";

import express from 'express';

const router = express.Router();


// Auth Routes
router.post("/login",verifyLoginUser);

router.post("/verify", LoginUser);

router.post("/register", CreateUser);


export default router;