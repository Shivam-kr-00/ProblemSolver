import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import problemRoutes from './modules/problems/problem.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';
import githubWebhookRoutes from './modules/webhooks/github/github.route.js';
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);
router.use('/tasks', taskRoutes);
router.use('/webhooks/github', githubWebhookRoutes);

export default router;
