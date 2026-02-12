import mongoose from "mongoose";
import Task from "./task.model.js";
import { TASK_STATUS, ROLES } from "../../constants.js";
import { updateProblemStatusService } from "../problems/problem.service.js";

export const getTasksByProblemService = async (problemId) => {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new Error("Invalid problem ID");
  }

  const tasks = await Task.find({ problemId })
    .populate("assignedTo", "name")
    .select("title status assignedTo createdAt updatedAt");

  return tasks;
};

export const getTaskByIdService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(taskId)
    .select(
      "title description status type repositoryUrl githubIssueUrl branchName githubPRUrl assignedTo createdBy createdAt"
    )
    .populate("assignedTo", "name")
    .populate("createdBy", "name");

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const createTaskService = async (
  problemId,
  title,
  description,
  createdBy
) => {
  if (!mongoose.Types.ObjectId.isValid(problemId)) {
    throw new Error("Invalid problem ID");
  }

  if (!title) {
    throw new Error("Task title is required");
  }

  const task = await Task.create({
    problemId,
    title,
    description,
    status: TASK_STATUS.OPEN,
    assignedTo: null,
    createdBy,
  });

  return task;
};

export const handleTaskEventService = async (
  taskId,
  event,
  user,
  metadata = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const isAdmin = user.role === ROLES.ADMIN;
  const isAssignee =
    task.assignedTo?.toString() === user._id.toString(); // Check if current user is the assignee of the task

  switch (event) {
// Claim task event allows users to claim open tasks, ensuring only one assignee per task and preventing
    case "CLAIM_TASK":
      if (task.status !== TASK_STATUS.OPEN) {
        throw new Error("Task is not open");
      }

      task.assignedTo = user._id;
      task.status = TASK_STATUS.ASSIGNED;
      break;
// START_TASK event allows assignee to move task to in-progress, useful for tracking active work and preventing others from claiming or being assigned the same task
    case "START_TASK":
      if (!isAssignee) {
        throw new Error("Only assignee can start task");
      }

      if (task.status !== TASK_STATUS.ASSIGNED) {
        throw new Error("Task must be assigned first");
      }

      task.status = TASK_STATUS.IN_PROGRESS;
      break;
// Admin can directly assign task to a user without going through claim/start flow, useful for high-priority tasks or when manual intervention is needed
    case "SUBMIT_PR":
      if (!isAssignee) {
        throw new Error("Only assignee can submit PR");
      }

      if (task.status !== TASK_STATUS.IN_PROGRESS) {
        throw new Error("Task must be in progress");
      }

      if (!metadata.prUrl) {
        throw new Error("PR URL is required");
      }

      task.status = TASK_STATUS.IN_REVIEW;
      task.githubPRUrl = metadata.prUrl;
      break;
// Merge PR event is handled via GitHub webhook to ensure authenticity and capture additional data like merge commit, but we can have an admin override here if needed
    case "PR_MERGED":
      if (!isAdmin) {
        throw new Error("Only admin can merge PR");
      }

      if (task.status !== TASK_STATUS.IN_REVIEW) {
        throw new Error("Task must be in review");
      }

      task.status = TASK_STATUS.COMPLETED;
      task.completedAt = new Date();

      break;

// PR_REJECTED event allows admin to reject a PR and reopen the task for the assignee to fix and resubmit
    case "PR_REJECTED":
      if (!isAdmin) {
        throw new Error("Only admin can reject PR");
      }

      if (task.status !== TASK_STATUS.IN_REVIEW) {
        throw new Error("Task must be in review");
      }

      task.status = TASK_STATUS.REOPENED;
      task.assignedTo = null;
      task.githubPRUrl = null;

      break;

    default:
      throw new Error("Invalid task event");
  }

  await task.save();
// automatic update of problem status after task completion or reopening
  if (
    task.status === TASK_STATUS.COMPLETED ||
    task.status === TASK_STATUS.REOPENED
  ) {
    await updateProblemStatusService(task.problemId);
  }

  return task;
};
