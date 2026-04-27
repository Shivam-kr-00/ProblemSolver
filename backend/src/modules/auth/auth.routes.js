import express from 'express';
import { ROUTES } from '../../constants.js';
import { login, logout, signup, refreshTokenController, getprofile, verifyEmail, verifyLoginOtp } from './auth.controller.js';
import { protectRoute } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post(ROUTES.LOGIN, login);
router.post(ROUTES.REGISTER, signup);
router.post(ROUTES.LOGOUT, logout);
router.post("/refresh-token", refreshTokenController);
router.get("/profile", protectRoute, getprofile);
router.post("/verify-email", verifyEmail);
router.post("/verify-login-otp", verifyLoginOtp);

export default router;