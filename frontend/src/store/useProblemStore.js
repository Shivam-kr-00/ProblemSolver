import { create } from 'zustand';
import * as problemApi from '../api/problem.api.js';
import { toast } from 'react-hot-toast';

export const useProblemStore = create((set) => ({
    problems: [],
    currentProblem: null,
    loading: false,
    error: null,

    getAllProblems: async (filters) => {
        set({ loading: true, error: null });
        try {
            const res = await problemApi.getAllProblems(filters);
            set({ problems: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch problems';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getProblemById: async (problemId) => {
        set({ loading: true, error: null });
        try {
            const res = await problemApi.getProblemById(problemId);
            set({ currentProblem: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch problem';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    createProblem: async (formData) => {
        set({ loading: true, error: null });
        try {
            const res = await problemApi.createProblem(formData);
            set((state) => ({
                problems: [res.data.data, ...state.problems],
                loading: false,
            }));
            toast.success('Problem created successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create problem';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateProblemStatus: async (problemId) => {
        set({ loading: true, error: null });
        try {
            const res = await problemApi.updateProblemStatus(problemId);
            set((state) => ({
                currentProblem: res.data.data,
                problems: state.problems.map((p) =>
                    p._id === problemId ? res.data.data : p
                ),
                loading: false,
            }));
            toast.success('Problem status updated');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update problem';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    addRepoToProblem: async (problemId, repoUrl) => {
        set({ loading: true, error: null });
        try {
            const res = await problemApi.addRepoToProblem(problemId, repoUrl);
            set((state) => ({
                currentProblem: res.data.data,
                problems: state.problems.map((p) =>
                    p._id === problemId ? res.data.data : p
                ),
                loading: false,
            }));
            toast.success('Repository added successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add repository';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    clearCurrentProblem: () => set({ currentProblem: null }),
}));
