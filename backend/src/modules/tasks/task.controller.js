import { getTasksByProblemService, getTaskByIdService, createTaskService, handleTaskEventService, updateTaskService } from "./task.service.js";
import ApiResponse from "../../utils/apiResponse.js";
export const getTasksByProblem = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const tasks = await getTasksByProblemService(problemId);
        res.status(200).json(new ApiResponse(
            200, tasks, "Tasks fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await getTaskByIdService(taskId);
        res.status(200).json(new ApiResponse(
            200, task, "Task fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        const { problemId, title, description, difficulty } = req.body;
        const createdBy = req.user.id;
        const task = await createTaskService(problemId, title, description, difficulty, createdBy);
        res.status(201).json(new ApiResponse(
            201, task, "Task created successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await updateTaskService(taskId, req.body);
        res.status(200).json(new ApiResponse(
            200, task, "Task updated successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const handleTaskEvent = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { event, metadata } = req.body;
        const user = req.user; // Get authenticated user
        const task = await handleTaskEventService(taskId, event, user, metadata);
        res.status(200).json(new ApiResponse(
            200, task, "Task status updated successfully"
        ));
    } catch (error) {
        next(error);
    }
}; 