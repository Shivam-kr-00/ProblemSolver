import { create } from 'zustand';
import * as userApi from '../api/user.api.js';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set) => ({
    userProfile: null,
    myTasks: [],
    myContributions: null,
    leaderboard: [],
    loading: false,
    error: null,
    isUpdatingProfile: false,

    getMyProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await userApi.getMyProfile();
            set({ userProfile: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch profile';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateMyProfile: async (userData) => {
        set({ loading: true, error: null });
        try {
            const res = await userApi.updateMyProfile(userData);
            set({ userProfile: res.data.data, loading: false });
            toast.success('Profile updated successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getMyTasks: async () => {
        set({ loading: true, error: null });
        try {
            const res = await userApi.getMyTasks();
            set({ myTasks: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch tasks';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getMyContributions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await userApi.getMyContributions();
            set({ myContributions: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch contributions';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getLeaderboard: async () => {
        set({ loading: true, error: null });
        try {
            const res = await userApi.getLeaderboard();
            set({ leaderboard: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch leaderboard';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },
}));
