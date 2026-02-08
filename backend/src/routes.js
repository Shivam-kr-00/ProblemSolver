import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import problemRoutes from './modules/problems/problem.routes.js';

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);

export default router;
