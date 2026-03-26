import express from 'express';
import { ROUTES } from '../../constants.js';
import { login, logout, signup, refreshTokenController, getprofile } from './auth.controller.js';
import { protectRoute } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post(ROUTES.LOGIN, login);
router.post(ROUTES.REGISTER, signup);
router.post(ROUTES.LOGOUT, logout);
router.post("/refresh-token", refreshTokenController);
router.get("/profile", protectRoute, getprofile)

export default router;