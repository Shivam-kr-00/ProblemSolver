import { createProblemService, getAllProblemsService, getProblemByIdService } from "./problem.service.js"
import ApiResponse from "../../utils/apiResponse.js";


export const createProblem = async (req, res,next) => {
    try {
        const userId = req.user.id;
        const problemData = req.body;

        const problem = await createProblemService(problemData, userId);

        res.status(201).json(new ApiResponse(
            201, problem, "Problem created successfully"
        ))
    } catch (error) {
       next(error);
    }
};

export const getProblemById = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const problem = await getProblemByIdService(problemId);
    if (!problem) {
       const error = new Error("Problem not found");
       error.statusCode = 404;
       throw error;
    }

    res.status(200).json(new ApiResponse(
      200, problem, "Problem fetched successfully"
    ));
  } catch (error) {
    next(error); 
  }
};

export const getAllProblems = async (req, res, next) => {
  try {
    
    const filters = req.query;
    const problems = await getAllProblemsService(filters);

    res.status(200).json(new ApiResponse(
      200, problems, "Problems fetched successfully"
    ));
  } catch (error) {
    next(error);
  }
}

export const updateProblemStatus = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { status } = req.body;

    const problem = await getProblemByIdService(problemId);
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    problem.status = status;
    await problem.save();
    res.status(200).json(new ApiResponse(
      200, problem, "Problem status updated successfully"
    ));

  } catch (error) {
    next(error);
    
  }
}