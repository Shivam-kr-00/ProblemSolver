import express from 'express';
import { protectRoute } from '../../middlewares/auth.middleware.js';
import isAdmin from '../../middlewares/role.middleware.js';
import {
  createProblem,
  getProblemById,
  getAllProblems,
  updateProblemStatus,
  addRepoToProblem
} from './problem.controller.js';

const router = express.Router();
router.post("/", protectRoute, isAdmin, createProblem);
router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);
router.patch("/:problemId/status", protectRoute, updateProblemStatus);
router.patch("/:problemId/repository", protectRoute, isAdmin, addRepoToProblem);

export default router;
