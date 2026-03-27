import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : (import.meta.env.VITE_API_URL || "/api"),
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig && originalConfig.url !== "/auth/login" && error.response) {
            // Access token expired or unauthorized
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                // Prevent infinite loop if the refresh token call itself fails
                if (originalConfig.url === "/auth/refresh-token") {
                    return Promise.reject(error);
                }

                try {
                    await axiosInstance.post("/auth/refresh-token");
                    // Retry original request
                    return axiosInstance(originalConfig);
                } catch (_error) {
                    // Let the application handle failed refresh (returns 401)
                    // If they were trying to access a secure api route, forcefully redirect
                    if (!originalConfig.url.startsWith("/auth/")) {
                        window.location.href = '/login';
                    }
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;