import express from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import { getMessageController } from "./message.controller.js";
const router = express.Router();

/**
 * /api/message/:problemId
 */
router.get("/:problemId", protectRoute, getMessageController);

export default router;