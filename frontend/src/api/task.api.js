import axios from './axios';

export const getTasksByProblem = async (problemId) => {
    return axios.get(`/tasks/problem/${problemId}`);
};

export const getTaskById = async (taskId) => {
    return axios.get(`/tasks/${taskId}`);
};

export const createTask = async (taskData) => {
    return axios.post('/tasks', taskData);
};

export const updateTask = async (taskId, taskData) => {
    return axios.put(`/tasks/${taskId}`, taskData);
};

export const updateTaskStatus = async (taskId, event, metadata = {}) => {
    return axios.patch(`/tasks/${taskId}/status`, { event, metadata });
};

export const claimTask = async (taskId) => {
    return axios.patch(`/tasks/${taskId}/status`, { event: 'CLAIM_TASK' });
};

export const startTask = async (taskId) => {
    return axios.patch(`/tasks/${taskId}/status`, { event: 'START_TASK' });
};

export const submitPR = async (taskId, prUrl) => {
    return axios.patch(`/tasks/${taskId}/status`, {
        event: 'SUBMIT_PR',
        metadata: { prUrl }
    });
};

export const approvePR = async (taskId) => {
    return axios.patch(`/tasks/${taskId}/status`, { event: 'PR_MERGED' });
};

export const rejectPR = async (taskId) => {
    return axios.patch(`/tasks/${taskId}/status`, { event: 'PR_REJECTED' });
};

export const unassignTask = async (taskId) => {
    return axios.patch(`/tasks/${taskId}/status`, { event: 'UNASSIGN_TASK' });
};
