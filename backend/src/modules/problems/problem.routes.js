import express from 'express';
import { protectRoute } from '../../middlewares/auth.middleware.js';
import {
  createProblem,
  getProblemById,
  getAllProblems,
  updateProblemStatus
} from './problem.controller.js';
import { handleGithubWebhook } from './webhook.controller.js';



const router = express.Router();

router.post("/", protectRoute, createProblem);
router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);
router.patch("/:problemId/status", protectRoute, updateProblemStatus);
router.post('/gh-webhook', handleGithubWebhook);


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (TO BE IMPLEMENTED LATER)
|--------------------------------------------------------------------------
| These routes will be used by admins or mediators
| to manage the lifecycle of a problem.
| TODO: implement after Task & Contribution modules
*/

// TODO: Admin adds GitHub repository after approving problem
// router.patch("/:problemId/repo", addRepoToProblem);

// TODO: Admin changes problem status (OPEN → IN_PROGRESS → COMPLETED)
// router.patch("/:problemId/status", updateProblemStatus);

export default router;