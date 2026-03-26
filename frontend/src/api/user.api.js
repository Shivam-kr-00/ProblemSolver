import axios from './axios';

export const getMyProfile = async () => {
    return axios.get('/users/me');
};

export const updateMyProfile = async (userData) => {
    return axios.patch('/users/me', userData);
};

export const getMyTasks = async () => {
    return axios.get('/users/me/tasks');
};

export const getMyContributions = async () => {
    return axios.get('/users/me/contributions');
};

export const getLeaderboard = async () => {
    return axios.get('/users/leaderboard');
};

export const getUserById = async (userId) => {
    return axios.get(`/users/${userId}`);
};

export const getUserContributions = async (userId) => {
    return axios.get(`/users/${userId}/contributions`);
};

export const getAllUsers = async () => {
    return axios.get('/users');
};

export const deactivateUser = async (userId) => {
    return axios.patch(`/users/${userId}/deactivate`);
};

export const changeUserRole = async (userId, role) => {
    return axios.patch(`/users/${userId}/role`, { role });
};
