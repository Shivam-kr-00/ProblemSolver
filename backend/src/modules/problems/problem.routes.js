import express from 'express';
import { protectRoute } from '../../middlewares/auth.middleware.js';
import isAdmin from '../../middlewares/role.middleware.js';
import {
  createProblem,
  getProblemById,
  getAllProblems,
  updateProblemStatus,
  addRepoToProblem,
  updateProblem
} from './problem.controller.js';

const router = express.Router();
router.post("/", protectRoute, createProblem);
router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);
router.patch("/:problemId/status", protectRoute, updateProblemStatus);
router.patch("/:problemId/repository", protectRoute, isAdmin, addRepoToProblem);
router.patch("/:problemId", protectRoute, isAdmin, updateProblem);

export default router;
