import mongoose from "mongoose";
import Task from "./task.model.js";
import Problem from "../problems/problem.model.js";
import User from "../auth/auth.model.js";
import { TASK_STATUS, ROLES } from "../../constants.js";
import { updateProblemStatusService } from "../problems/problem.service.js";
import apiError from "../../utils/apiError.js";
import { validatePRExists } from "../../utils/github.js";

export const getTasksByProblemService = async (problemId) => {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new apiError("Invalid problem ID", 400);
  }

  const tasks = await Task.find({ problemId })
    .populate("assignedTo", "name")
    .select("title description status difficulty assignedTo githubPRUrl createdAt updatedAt");

  return tasks;
};

export const getTaskByIdService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new apiError("Invalid task ID", 400);
  }

  const task = await Task.findById(taskId)
    .select(
      "title description status type repositoryUrl githubIssueUrl branchName githubPRUrl assignedTo createdBy createdAt"
    )
    .populate("assignedTo", "name")
    .populate("createdBy", "name");

  if (!task) {
    throw new apiError("Task not found", 404);
  }

  return task;
};

export const createTaskService = async (
  problemId,
  title,
  description,
  difficulty,
  createdBy
) => {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new apiError("Invalid problem ID", 400);
  }

  if (!title) {
    throw new apiError("Task title is required", 400);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new apiError("Problem not found", 404);
  }

  const task = await Task.create({
    problemId,
    title,
    description,
    difficulty: difficulty || "MEDIUM",
    repositoryUrl: problem.repositoryUrl,
    status: TASK_STATUS.OPEN,
    assignedTo: null,
    createdBy,
  });

  return task;
};

export const updateTaskService = async (taskId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new apiError("Invalid task ID", 400);
  }

  // allow ONLY specific fields to be updated
  const allowedUpdates = {};
  if (updateData.title !== undefined) allowedUpdates.title = updateData.title;
  if (updateData.description !== undefined) allowedUpdates.description = updateData.description;
  if (updateData.difficulty !== undefined) allowedUpdates.difficulty = updateData.difficulty;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new apiError("Task not found", 404);
  }
  return task;
};

export const handleTaskEventService = async (
  taskId,
  event,
  user,
  metadata = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new apiError("Invalid task ID", 400);
  }

  const task = await Task.findById(taskId);
  if (!task) throw new apiError("Task not found", 404);

  const isAdmin = user.role === ROLES.ADMIN;
  const isAssignee =
    task.assignedTo?.toString() === user._id.toString();
  switch (event) {
    case "CLAIM_TASK": {
      if (task.status !== TASK_STATUS.OPEN) {
        throw new apiError("Task is not open", 400);
      }
      // Limit active tasks to 2
      const activeTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: {
          $in: [
            TASK_STATUS.ASSIGNED,
            TASK_STATUS.IN_PROGRESS
          ]
        }
      });

      if (activeTasks >= 2) {
        throw new apiError(
          "You already have maximum active tasks",
          400
        );
      }

      task.assignedTo = user._id;
      task.status = TASK_STATUS.ASSIGNED;
      break;
    }
    //start task (move from assigned to in_progress)
    case "START_TASK": {
      if (!isAssignee) {
        throw new apiError("Only assignee can start task", 403);
      }

      if (task.status !== TASK_STATUS.ASSIGNED) {
        throw new apiError("Task must be assigned first", 400);
      }

      task.status = TASK_STATUS.IN_PROGRESS;
      break;
    }
    //submit PR (move from in_progress to in_review)
    case "SUBMIT_PR": {
      if (!isAssignee) {
        throw new apiError("Only assignee can submit PR", 403);
      }

      if (task.status !== TASK_STATUS.IN_PROGRESS) {
        throw new apiError("Task must be in progress", 400);
      }

      if (!metadata.prUrl) {
        throw new apiError("PR URL is required", 400);
      }

      // ✅ NEW: Validate that the PR actually exists in GitHub
      try {
        const prValidation = await validatePRExists(metadata.prUrl);

        if (!prValidation.exists) {
          throw new apiError(
            "PR does not exist in GitHub. Please submit a valid PR URL.",
            400
          );
        }
      } catch (error) {
        if (error.message.includes("Invalid PR URL")) {
          throw new apiError("Invalid PR URL format", 400);
        }
        throw error;
      }

      task.status = TASK_STATUS.IN_REVIEW;
      task.githubPRUrl = metadata.prUrl;
      break;
    }
    // pr merged (move from in_review to completed) - admin only
    case "PR_MERGED": {
      if (!isAdmin) {
        throw new apiError("Only admin can merge PR", 403);
      }

      if (task.status !== TASK_STATUS.IN_REVIEW) {
        throw new apiError("Task must be in review", 400);
      }

      // ✅ NEW: Validate that the PR is actually merged in GitHub
      try {
        const prValidation = await validatePRExists(task.githubPRUrl);

        if (!prValidation.exists) {
          throw new apiError(
            "PR does not exist in GitHub. Cannot approve.",
            400
          );
        }

        if (!prValidation.isMerged) {
          throw new apiError(
            "PR is not merged in GitHub yet. Please merge the PR first.",
            400
          );
        }
      } catch (error) {
        if (error.message.includes("Invalid PR URL")) {
          throw new apiError("Invalid PR URL in database", 400);
        }
        // Re-throw our custom errors
        if (error.message.includes("PR does not exist") ||
          error.message.includes("PR is not merged")) {
          throw error;
        }
        throw new apiError("Failed to validate PR in GitHub", 500);
      }

      task.status = TASK_STATUS.COMPLETED;
      task.completedAt = new Date();

      // Update user stats for task completion
      if (task.assignedTo) {
        // Calculate reputation based on difficulty
        const difficultyReputationMap = {
          EASY: 10,
          MEDIUM: 25,
          HARD: 50,
        };
        const reputationPoints =
          difficultyReputationMap[task.difficulty] || 10;

        // Update user: increment tasksCompleted, totalContributions, and reputation
        await User.findByIdAndUpdate(
          task.assignedTo,
          {
            $inc: {
              tasksCompleted: 1,
              totalContributions: 1,
              reputation: reputationPoints,
            },
          },
          { new: true }
        );
      }

      break;
    }
    // pr rejected (move from in_review to reopened) - admin only
    case "PR_REJECTED": {
      if (!isAdmin) {
        throw new apiError("Only admin can reject PR", 403);
      }

      if (task.status !== TASK_STATUS.IN_REVIEW) {
        throw new apiError("Task must be in review", 400);
      }

      task.status = TASK_STATUS.REOPENED;
      task.assignedTo = null;
      task.githubPRUrl = null;
      break;
    }
    // unassign task (move from assigned/in_progress to open) - assignee or admin
    case "UNASSIGN_TASK": {
      if (!isAssignee && !isAdmin) {
        throw new apiError(
          "Not authorized to unassign this task",
          403
        );
      }

      if (
        task.status === TASK_STATUS.COMPLETED ||
        task.status === TASK_STATUS.IN_REVIEW
      ) {
        throw new apiError(
          "Cannot unassign at this stage",
          400
        );
      }

      task.assignedTo = null;
      task.status = TASK_STATUS.OPEN;
      break;
    }

    default:
      throw new apiError("Invalid task event", 400);
  }

  await task.save();

  // Update problem status if needed
  if (
    task.status === TASK_STATUS.COMPLETED ||
    task.status === TASK_STATUS.REOPENED
  ) {
    await updateProblemStatusService(task.problemId);
  }

  return task;
};

export const markTaskCompletedFromWebhook = async (prUrl) => {
  const task = await Task.findOne({ githubPRUrl: prUrl, status: TASK_STATUS.IN_REVIEW });
  if (!task) {
    console.log(`Webhook: No IN_REVIEW task found for PR ${prUrl}`);
    return null;
  }

  task.status = TASK_STATUS.COMPLETED;
  task.completedAt = new Date();
  await task.save();

  // Update user stats for task completion via webhook
  if (task.assignedTo) {
    const difficultyReputationMap = {
      EASY: 10,
      MEDIUM: 25,
      HARD: 50,
    };
    const reputationPoints =
      difficultyReputationMap[task.difficulty] || 10;

    await User.findByIdAndUpdate(
      task.assignedTo,
      {
        $inc: {
          tasksCompleted: 1,
          totalContributions: 1,
          reputation: reputationPoints,
        },
      },
      { new: true }
    );
  }

  await updateProblemStatusService(task.problemId);

  return task;
};
