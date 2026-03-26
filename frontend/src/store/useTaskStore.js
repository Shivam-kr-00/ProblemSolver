import { create } from 'zustand';
import * as taskApi from '../api/task.api.js';
import { toast } from 'react-hot-toast';

export const useTaskStore = create((set) => ({
    tasks: [],
    allTasks: [],
    currentTask: null,
    loading: false,
    error: null,

    getTasksByProblem: async (problemId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.getTasksByProblem(problemId);
            set({ tasks: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch tasks';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getTaskById: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.getTaskById(taskId);
            set({ currentTask: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    createTask: async (taskData) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.createTask(taskData);
            set((state) => ({
                tasks: [res.data.data, ...state.tasks],
                loading: false,
            }));
            toast.success('Task created successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateTask: async (taskId, taskData) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.updateTask(taskId, taskData);
            set((state) => ({
                currentTask: state.currentTask?._id === taskId ? res.data.data : state.currentTask,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('Task updated successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateTaskStatus: async (taskId, event, metadata = {}) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.updateTaskStatus(taskId, event, metadata);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) =>
                    t._id === taskId ? res.data.data : t
                ),
                loading: false,
            }));
            toast.success('Task updated successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    claimTask: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.claimTask(taskId);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('Task claimed successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to claim task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    startTask: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.startTask(taskId);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('Task started');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to start task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    submitPR: async (taskId, prUrl) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.submitPR(taskId, prUrl);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('PR submitted successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit PR';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    approvePR: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.approvePR(taskId);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('PR merged successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to approve PR';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    rejectPR: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.rejectPR(taskId);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('PR rejected - task reopened');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reject PR';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    unassignTask: async (taskId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.unassignTask(taskId);
            set((state) => ({
                currentTask: res.data.data,
                tasks: state.tasks.map((t) => t._id === taskId ? res.data.data : t),
                loading: false,
            }));
            toast.success('Task unassigned');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to unassign task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    clearTasks: () => set({ tasks: [], currentTask: null }),
    clearCurrentTask: () => set({ currentTask: null }),
}));
