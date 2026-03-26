import axios from './axios';

export const getAllProblemsForAdmin = async () => {
    return axios.get('/problems');
};

export const getAllUsersForAdmin = async () => {
    return axios.get('/users');
};

export const changeUserRole = async (userId, role) => {
    return axios.put(`/users/${userId}/role`, { role });
};

export const updateProblem = async (problemId, problemData) => {
    return axios.patch(`/problems/${problemId}`, problemData);
};

export const deactivateUser = async (userId) => {
    return axios.put(`/users/${userId}/deactivate`);
};

// Note: Delete endpoints don't exist yet in backend
// export const deleteProblem = async (problemId) => {
//     return axios.delete(`/problems/${problemId}`);
// };

// export const deleteTask = async (taskId) => {
//     return axios.delete(`/tasks/${taskId}`);
// };

// Note: Admin stats endpoint doesn't exist yet in backend
// export const getAdminStats = async () => {
//     return axios.get('/admin/stats');
// };

