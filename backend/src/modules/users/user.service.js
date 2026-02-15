import User from "../auth/auth.model.js";
import mongoose from "mongoose";
import Task from "../tasks/task.model.js";
import apiError from "../../utils/apiError.js";
import { TASK_STATUS } from "../../constants.js";

export const getMyProfileService = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new apiError("User not found", 404);
    }
    return user;
};

export const updateMyProfileService = async (userId, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError("User not found", 404);
    }
    // Allowed fields only
    const allowedFields = ["name", "profileImageUrl", "bio", "githubUsername"];

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    await user.save();

    return await User.findById(userId).select("-password");
};

export const getMyTasksService = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError("User not found", 404);
    }
    const tasks = await Task.find({ assignedTo: userId });
    return tasks;
};

export const getMyContributionsService = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError("User not found", 404);
    }
    const tasks = await Task.find({ assignedTo: userId }).populate('problemId', 'title');
    return tasks;
};

export const getLeaderboardService = async () => {

    const users = await User.find({ isActive: true })
        .select("name reputation totalContributions profileImageUrl")
        .sort({ reputation: -1 })
        .limit(10);

    return users;
};

export const getUserByIdService = async (userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }

    const user = await User.findById(userId)
        .select("-password");

    if (!user) {
        throw new apiError("User not found", 404);
    }

    return user;
};

export const getUserContributionsService = async (userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }

    const userExists = await User.exists({ _id: userId });

    if (!userExists) {
        throw new apiError("User not found", 404);
    }

    const contributions = await Task.find({
        assignedTo: userId,
        status: TASK_STATUS.COMPLETED
    })
        .select("title completedAt")
        .populate("problemId", "title category");

    return contributions;
};

export const getAllUsersService = async () => {
    const users = await User.find({ isActive: true })
        .select("name profileImageUrl reputation totalContributions")
        .sort({ name: 1 });
    return users;
};

export const deactivateUserService = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    );
    if (!user) {
        throw new apiError("User not found", 404);
    }
    return user;
};

export const changeUserRoleService = async (userId, newRole) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError("Invalid user ID", 400);
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    );
    if (!user) {
        throw new apiError("User not found", 404);
    }
    return user;
};

