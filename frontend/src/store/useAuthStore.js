import { create } from 'zustand';
import * as authApi from '../api/auth.api.js';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (!name || !email || !password || !confirmPassword) {
            set({ loading: false });
            return toast.error("All fields are required");
        }

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            // First, perform signup to get tokens in cookies
            await authApi.signup({ name, email, password });

            // Then fetch the complete user profile
            const profileRes = await authApi.getProfile();
            const userData = profileRes.data.data || profileRes.data || profileRes;

            set({ user: userData, loading: false });
            toast.success("Signup successful");
        } catch (error) {
            set({ loading: false });
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });

        if (!email || !password) {
            set({ loading: false });
            return toast.error("Email and password are required");
        }

        try {
            // First, perform login to get tokens in cookies
            const loginRes = await authApi.login({ email, password });

            // Then fetch the complete user profile
            const profileRes = await authApi.getProfile();

            // Handle the user data - getProfile returns user directly, not wrapped in data.data
            const userData = profileRes.data.data || profileRes.data || profileRes;

            set({ user: userData, loading: false });
            toast.success("Login successful");
        } catch (error) {
            set({ loading: false });
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
        }
    },

    logout: async () => {
        set({ loading: true });

        try {
            await authApi.logout();
            set({ user: null, loading: false });
            toast.success("Logged out");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const res = await authApi.getProfile();
            // Handle response - getProfile returns user directly
            const userData = res.data.data || res.data || res;
            set({ checkingAuth: false, user: userData });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    }


}));