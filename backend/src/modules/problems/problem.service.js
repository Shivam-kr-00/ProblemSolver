import mongoose from 'mongoose';
import Problem from './problem.model.js';
import User from '../auth/auth.model.js';
import Task from '../tasks/task.model.js';
import { PROBLEM_STATUS, TASK_STATUS, ROLES } from '../../constants.js';
import apiError from '../../utils/apiError.js';
import { createGithubRepository } from "../../utils/github.js";

export const createProblemService = async (problemData, userId) => {

    // 1. Create a safe, unique GitHub repository name
    const safeTitle = problemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const repoName = `problem-${safeTitle}-${Date.now().toString().slice(-4)}`;

    // 2. Call GitHub API to create repository
    const repoUrl = await createGithubRepository(repoName, problemData.description);

    // 3. Save Problem to Database with the repository URL
    const problem = await Problem.create({
        ...problemData,
        repositoryUrl: repoUrl,
        createdBy: userId
    });
    return problem;

}

export const getProblemByIdService = async (problemId) => {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new apiError('Invalid problem ID', 400)
    }

    const problem = await Problem.findById(problemId)
        .populate('createdBy', 'name')
        .populate('contributors', 'name')

    if (!problem) {
        throw new apiError('Problem not found', 404)
    }

    return problem
}

export const getAllProblemsService = async (query) => {
    const filters = {}

    if (query.category) filters.category = query.category
    if (query.region) filters.region = query.region
    if (query.status) filters.status = query.status
    if (query.createdBy) filters.createdBy = query.createdBy
    if (query.tags) filters.tags = { $in: query.tags.split(',') }

    return await Problem.find(filters)
        .sort({ createdAt: -1 })
}

export const markAsPendingContributor = async (repoUrl, githubUsername) => {
    const user = await User.findOne({ githubUsername });
    if (!user) {
        throw new apiError("User not found on our platform", 404);
    }

    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });
    if (!problem) {
        throw new apiError("Problem not found for this repo", 404);
    }

    const isPending = problem.pendingContributors.includes(user._id);
    const isContributor = problem.contributors.includes(user._id);

    if (!isPending && !isContributor) {
        problem.pendingContributors.push(user._id);
        await problem.save();
    }

    return problem;
};

export const addContributorByGithubMerge = async (repoUrl, githubUsername) => {
    // 1. Find User by GitHub handle
    const user = await User.findOne({ githubUsername });
    if (!user) {
        throw new apiError(`User with GitHub handle ${githubUsername} not found`, 404);
    }

    // 2. Find the Problem linked to the repository
    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });
    if (!problem) {
        throw new apiError(`No problem found for repository: ${repoUrl}`, 404);
    }

    const isAlreadyContributor = problem.contributors.includes(user._id);

    if (!isAlreadyContributor) {

        problem.pendingContributors.pull(user._id);

        problem.contributors.push(user._id);

        user.reputation += 100;
        await Promise.all([problem.save(), user.save()]);
    }

    return { problem, user };
};

export const removePendingContributor = async (repoUrl, githubUsername) => {
    const user = await User.findOne({ githubUsername });
    if (!user) {
        throw new apiError(`User with GitHub handle ${githubUsername} not found`, 404);
    }

    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });
    if (!problem) {
        throw new apiError(`No problem found for repository: ${repoUrl}`, 404);
    }

    problem.pendingContributors = problem.pendingContributors.filter(
        contributorId => contributorId.toString() !== user._id.toString()
    );

    await problem.save();
    return problem;
}

export const updateProblemStatusService = async (problemId) => {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new apiError("Invalid problem ID", 400);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new apiError("Problem not found", 404);
    }

    if (problem.status === PROBLEM_STATUS.CANCELLED) {
        return problem; // admin override respected
    }

    const tasks = await Task.find({ problemId });

    if (tasks.length === 0) return problem;

    const allCompleted = tasks.every(
        task => task.status === TASK_STATUS.COMPLETED
    );

    const anyActive = tasks.some(
        task => task.status !== TASK_STATUS.COMPLETED
    );

    let newStatus = problem.status;

    if (allCompleted) {
        newStatus = PROBLEM_STATUS.COMPLETED;
    } else if (anyActive) {
        newStatus = PROBLEM_STATUS.IN_PROGRESS;
    }

    if (newStatus !== problem.status) {
        problem.status = newStatus;
        await problem.save();
    }

    return problem;
};

export const addRepoToProblemService = async (problemId, repoUrl) => {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new apiError("Invalid problem ID", 400);
    }

    if (!repoUrl) {
        throw new apiError("Repository URL is required", 400);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new apiError("Problem not found", 404);
    }

    if (problem.repositoryUrl) {
        throw new apiError("Repository already linked to this problem", 400);
    }

    problem.repositoryUrl = repoUrl;
    await problem.save();
    return problem;
};

export const updateProblemService = async (problemId, userId, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new apiError("Invalid problem ID", 400);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new apiError("Problem not found", 404);
    }

    // Admins usually bypass this but just in case we verify ownership or role later
    // For now, we update the simple fields
    const allowedUpdates = ['title', 'description', 'category', 'region', 'tags'];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            // Handle tags specifically if it comes as comma separated string instead of array
            if (field === 'tags' && typeof updateData.tags === 'string') {
                problem.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(t => t);
            } else {
                problem[field] = updateData[field];
            }
        }
    });

    await problem.save();
    return problem;
};

