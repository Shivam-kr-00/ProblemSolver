import axios from './axios';

export const createProblem = async (problemData) => {
    return axios.post('/problems', problemData);
};

export const getAllProblems = async (filters = {}) => {
    return axios.get('/problems', { params: filters });
};

export const getProblemById = async (problemId) => {
    return axios.get(`/problems/${problemId}`);
};

export const updateProblemStatus = async (problemId) => {
    return axios.patch(`/problems/${problemId}/status`);
};

export const addRepoToProblem = async (problemId, repoUrl) => {
    return axios.patch(`/problems/${problemId}/repository`, { repoUrl });
};
