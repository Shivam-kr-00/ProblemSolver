import express from "express";
import {
  createTask,
  getTasksByProblem,
  getTaskById,
  handleTaskEvent,
} from "./task.controller.js";

import { protectRoute } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/problem/:problemId", getTasksByProblem);//Shows all tasks of a problem with status and assignedTo (masked) // show on problem detail page
router.get("/:taskId", getTaskById);//Shows status, assignedTo (masked), repo info
router.post("/", protectRoute, isAdmin, createTask);
router.patch("/:taskId/status", protectRoute, isAdmin, handleTaskEvent);

export default router;
