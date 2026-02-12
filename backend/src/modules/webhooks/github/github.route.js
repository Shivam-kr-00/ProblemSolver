import express from "express";
import { handleGithubWebhook } from "./github.controller.js";

const router = express.Router();

router.post("/", handleGithubWebhook);

export default router;
