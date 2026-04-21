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
}
