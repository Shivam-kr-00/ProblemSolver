import mongoose from 'mongoose';
import Problem from './problem.model.js';
import User from '../auth/auth.model.js';

export const createProblemService = async (problemData, userId) => {

    const problem = await Problem.create({
        ...problemData,
        createdBy: userId
    });
    return problem;

}

export const getProblemByIdService = async (problemId) => {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
        throw new Error('Invalid problem ID')
    }

    const problem = await Problem.findById(problemId)
        .populate('createdBy', 'name')
        .populate('contributors', 'name')

    if (!problem) {
        throw new Error('Problem not found')
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

export const markAsPendingContributor = async(repoUrl, githubUsername) => {
    const user = await User.findOne({ githubUsername });
    if (!user) {
        const error = new Error("User not found on our platform");
        error.statusCode = 404;
        throw error;
    }

    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });    
    if (!problem) {
        const error = new Error("Problem not found for this repo");
        error.statusCode = 404;
        throw error;
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
        const error = new Error(`User with GitHub handle ${githubUsername} not found`);
        error.statusCode = 404;
        throw error;
    }

    // 2. Find the Problem linked to the repository
    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });
    if (!problem) {
        const error = new Error(`No problem found for repository: ${repoUrl}`);
        error.statusCode = 404;
        throw error;
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
        const error = new Error(`User with GitHub handle ${githubUsername} not found`);
        error.statusCode = 404;
        throw error;
    }

    const problem = await Problem.findOne({ githubRepoUrl: repoUrl });
    if (!problem) return { status: 404, message: "Problem not found for this repo" };   if (!problem) {
        const error = new Error(`No problem found for repository: ${repoUrl}`);
        error.statusCode = 404;
        throw error;
    }
    problem.pendingContributors = problem.pendingContributors.filter(
        contributorId => contributorId.toString() !== user._id.toString()
    );
    await problem.save();   
}

export const updateProblemStatusService = async (problemId, status) => {
    const problem = await Problem.findById(problemId);
    if(!problem) {
        throw new Error('Problem not found');
    }
    problem.status = status;
    await problem.save();
    return problem;
}