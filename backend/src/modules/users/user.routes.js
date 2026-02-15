import express from "express";
import { protectRoute } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/role.middleware.js";
import {
  getMyProfile,
  updateMyProfile,
  getMyTasks,
  getMyContributions,
  getUserById,
  getUserContributions,
  getLeaderboard,
  getAllUsers,
  deactivateUser,
  changeUserRole
} from "./user.controller.js";

const router = express.Router();

// Protected Routes for logged-in users

router.get("/me", protectRoute, getMyProfile);
router.patch("/me", protectRoute, updateMyProfile);
router.get("/me/tasks", protectRoute, getMyTasks);
router.get("/me/contributions", protectRoute, getMyContributions);



  // Public Routes
router.get("/leaderboard", getLeaderboard);
router.get("/:userId", getUserById);
router.get("/:userId/contributions", getUserContributions);



  // Admin Routes
router.get("/", protectRoute, isAdmin, getAllUsers);
router.patch("/:userId/deactivate", protectRoute, isAdmin, deactivateUser);
router.patch("/:userId/role", protectRoute, isAdmin, changeUserRole);

export default router;
