import { create } from 'zustand';
import * as authApi from '../api/auth.api.js';
import { toast } from 'react-hot-toast';
import { socket } from '../lib/socket.js';

export const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    isGuest: false,

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
            // First, perform signup to get OTP sent
            await authApi.signup({ name, email, password });

            set({ loading: false });
            toast.success("OTP sent to your email!");
            return true; // Indicate success to go to step 2
        } catch (error) {
            set({ loading: false });
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
            return false;
        }
    },

    verifyEmail: async ({ email, otp }) => {
        set({ loading: true });
        try {
            await authApi.verifyEmail({ email, otp });

            const profileRes = await authApi.getProfile();
            const userData = profileRes.data.data || profileRes.data || profileRes;

            sessionStorage.removeItem('isGuest');
            set({ user: userData, isGuest: false, loading: false });
            socket.connect();
            toast.success("Email verified successfully! You are now logged in.");
            return true;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Verification failed");
            return false;
        }
    },

    login: async ({ email, password }) => {
        set({ loading: true });

        if (!email || !password) {
            set({ loading: false });
            return toast.error("Email and password are required");
        }

        try {
            // First, perform login to get OTP sent
            await authApi.login({ email, password });

            set({ loading: false });
            toast.success("OTP sent to your email!");
            return true; // Indicate success to go to step 2
        } catch (error) {
            set({ loading: false });
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    },

    verifyLoginOtp: async ({ email, otp }) => {
        set({ loading: true });
        try {
            await authApi.verifyLoginOtp({ email, otp });

            // After OTP is verified, backend sets cookies. Now fetch profile.
            const profileRes = await authApi.getProfile();
            const userData = profileRes.data.data || profileRes.data || profileRes;

            // Exit guest mode on successful login
            sessionStorage.removeItem('isGuest');
            set({ user: userData, isGuest: false, loading: false });
            socket.connect();
            toast.success("Login successful!");
            return true;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "OTP verification failed");
            return false;
        }
    },

    logout: async () => {
        set({ loading: true });

        try {
            await authApi.logout();
            sessionStorage.removeItem('isGuest');
            set({ user: null, isGuest: false, loading: false });
            socket.disconnect();
            toast.success("Logged out");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        // Restore guest session from sessionStorage (persists on refresh, clears on tab close)
        const savedGuest = sessionStorage.getItem('isGuest') === 'true';
        if (savedGuest) {
            set({ checkingAuth: false, user: null, isGuest: true });
            return;
        }
        try {
            const res = await authApi.getProfile();
            // Handle response - getProfile returns user directly
            const userData = res.data.data || res.data || res;
            set({ checkingAuth: false, user: userData, isGuest: false });
            socket.connect();
        } catch (error) {
            set({ checkingAuth: false, user: null, isGuest: false });
        }
    },

    // Enter as Guest — sets guest mode, persists to sessionStorage
    enterAsGuest: () => {
        sessionStorage.setItem('isGuest', 'true');
        set({ isGuest: true, user: null });
    },

    // Exit Guest — called on login/signup success
    exitGuest: () => {
        sessionStorage.removeItem('isGuest');
        set({ isGuest: false });
    },

    // For OAuth: Set user directly without API call
    setUser: (userData) => {
        sessionStorage.removeItem('isGuest');
        set({ user: userData, isGuest: false });
        socket.connect();
       // toast.success("Login successful!");
    },

    // Clear user data (for logout)
    clearUser: () => {
        sessionStorage.removeItem('isGuest');
        set({ user: null, isGuest: false });
        socket.disconnect();
    },

}));