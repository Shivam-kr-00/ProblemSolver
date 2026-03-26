import { getMyProfileService, getLeaderboardService, getAllUsersService, updateMyProfileService, getMyTasksService, getMyContributionsService, getUserByIdService, deactivateUserService, changeUserRoleService } from "./user.service.js";
import ApiResponse from "../../utils/apiResponse.js";


export const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await getMyProfileService(userId);
        res.status(200).json(new ApiResponse(
            200, user, "User profile fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedData = req.body;
        const updatedUser = await updateMyProfileService(userId, updatedData);
        res.status(200).json(new ApiResponse(
            200, updatedUser, "User profile updated successfully"
        ));

    } catch (error) {
        next(error);
    }
};

export const getMyTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await getMyTasksService(userId);
        res.status(200).json(new ApiResponse(
            200, tasks, "User tasks fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getMyContributions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contributions = await getMyContributionsService(userId);
        res.status(200).json(new ApiResponse(
            200, contributions, "User contributions fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await getLeaderboardService();
        res.status(200).json(new ApiResponse(
            200, leaderboard, "Leaderboard fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserByIdService(userId);
        res.status(200).json(new ApiResponse(
            200, user, "User profile fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getUserContributions = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const contributions = await getUserContributionsService(userId);
        res.status(200).json(new ApiResponse(
            200, contributions, "User contributions fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(new ApiResponse(
            200, users, "All users fetched successfully"
        ));
    } catch (error) {
        next(error);
    }
};

export const deactivateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await deactivateUserService(userId);
        return res.status(200).json(
            new ApiResponse(200, null, "User deactivated successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const changeUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!role) {
            throw new apiError("Role is required", 400);
        }
        await changeUserRoleService(userId, role);
        return res.status(200).json(
            new ApiResponse(200, null, "User role updated successfully")
        );
    } catch (error) {
        next(error);
    }
};

