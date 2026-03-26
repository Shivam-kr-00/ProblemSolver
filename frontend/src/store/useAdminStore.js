import { create } from 'zustand';
import * as adminApi from '../api/admin.api.js';
import * as taskApi from '../api/task.api.js';
import { toast } from 'react-hot-toast';

export const useAdminStore = create((set) => ({
    allProblems: [],
    allUsers: [],
    problemTasks: {}, // Map of problemId to tasks
    adminStats: null,
    loading: false,
    error: null,

    getAllProblems: async () => {
        set({ loading: true, error: null });
        try {
            const res = await adminApi.getAllProblemsForAdmin();
            const problems = res.data.data;

            // Fetch tasks for each problem to show task count and assignee info
            const problemTasks = {};
            await Promise.all(
                problems.map(async (problem) => {
                    try {
                        const tasksRes = await taskApi.getTasksByProblem(problem._id);
                        problemTasks[problem._id] = tasksRes.data.data;
                    } catch (err) {
                        problemTasks[problem._id] = [];
                    }
                })
            );

            set({ allProblems: problems, problemTasks, loading: false });
            return problems;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch problems';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getTasksByProblem: async (problemId) => {
        try {
            const res = await taskApi.getTasksByProblem(problemId);
            set((state) => ({
                problemTasks: {
                    ...state.problemTasks,
                    [problemId]: res.data.data
                }
            }));
            return res.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch tasks');
        }
    },

    getAllUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await adminApi.getAllUsersForAdmin();
            set({ allUsers: res.data.data, loading: false });
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    deleteProblem: async (problemId) => {
        // TODO: Backend endpoint DELETE /problems/:problemId not implemented yet
        toast.error('Delete problem feature not yet available');
        return;
        // set({ loading: true, error: null });
        // try {
        //     const res = await adminApi.deleteProblem(problemId);
        //     set((state) => ({
        //         allProblems: state.allProblems.filter((p) => p._id !== problemId),
        //         loading: false,
        //     }));
        //     toast.success('Problem deleted successfully');
        //     return res.data.data;
        // } catch (error) {
        //     const message = error.response?.data?.message || 'Failed to delete problem';
        //     set({ error: message, loading: false });
        //     toast.error(message);
        // }
    },

    deleteTask: async (taskId) => {
        // TODO: Backend endpoint DELETE /tasks/:taskId not implemented yet
        toast.error('Delete task feature not yet available');
        return;
        // set({ loading: true, error: null });
        // try {
        //     const res = await adminApi.deleteTask(taskId);
        //     set({ loading: false });
        //     toast.success('Task deleted successfully');
        //     return res.data.data;
        // } catch (error) {
        //     const message = error.response?.data?.message || 'Failed to delete task';
        //     set({ error: message, loading: false });
        //     toast.error(message);
        // }
    },

    deactivateUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await adminApi.deactivateUser(userId);
            set((state) => ({
                allUsers: state.allUsers.map((u) =>
                    u._id === userId ? res.data.data : u
                ),
                loading: false,
            }));
            toast.success('User deactivated successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to deactivate user';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    changeUserRole: async (userId, role) => {
        set({ loading: true, error: null });
        try {
            const res = await adminApi.changeUserRole(userId, role);
            set((state) => ({
                allUsers: state.allUsers.map((u) =>
                    u._id === userId ? res.data.data : u
                ),
                loading: false,
            }));
            toast.success('User role updated successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update user role';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getAdminStats: async () => {
        // TODO: Backend endpoint GET /admin/stats not implemented yet
        // For now, return null
        set({ adminStats: null, loading: false });
        return;
        // set({ loading: true, error: null });
        // try {
        //     const res = await adminApi.getAdminStats();
        //     set({ adminStats: res.data.data, loading: false });
        //     return res.data.data;
        // } catch (error) {
        //     const message = error.response?.data?.message || 'Failed to fetch stats';
        //     set({ error: message, loading: false });
        //     toast.error(message);
        // }
    },

    unassignTask: async (taskId, problemId) => {
        set({ loading: true, error: null });
        try {
            const res = await taskApi.unassignTask(taskId);

            // Update the problemTasks map
            set((state) => ({
                problemTasks: {
                    ...state.problemTasks,
                    [problemId]: (state.problemTasks[problemId] || []).map((t) =>
                        t._id === taskId ? res.data.data : t
                    )
                },
                loading: false,
            }));
            toast.success('Task unassigned successfully');
            return res.data.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to unassign task';
            set({ error: message, loading: false });
            toast.error(message);
        }
    },
}));
