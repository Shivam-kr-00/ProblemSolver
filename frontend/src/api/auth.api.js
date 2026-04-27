import axiosInstance from "./axios";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response;
};

export const signup = async (data) => {
    const response = await axiosInstance.post("/auth/signup", data);
    return response;
};

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response;
};

export const getProfile = async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response;
};

export const verifyEmail = async (data) => {
    const response = await axiosInstance.post("/auth/verify-email", data);
    return response;
};

export const verifyLoginOtp = async (data) => {
    const response = await axiosInstance.post("/auth/verify-login-otp", data);
    return response;
};
