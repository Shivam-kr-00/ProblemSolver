import express from 'express';
import { ROUTES } from '../../constants.js';
import {login ,logout, signup} from './auth.controller.js';

const router = express.Router();

router.post(ROUTES.LOGIN, login);
router.post(ROUTES.REGISTER, signup);
router.post(ROUTES.LOGOUT, logout);

export default router;