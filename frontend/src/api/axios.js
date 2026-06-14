import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : (import.meta.env.VITE_API_URL || "/api"),
    withCredentials: true,
    // 30-second timeout — if the server hangs (e.g. email service with missing credentials),
    // the request fails cleanly instead of spinning forever.
    timeout: 30000,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;

        if (originalConfig && originalConfig.url !== "/auth/login" && error.response) {
            // Access token expired or unauthorized
            if (
                error.response.status === 401 &&
                !originalConfig._retry &&
                !originalConfig._skipAuthRetry  // don't retry if caller opted out
            ) {
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
                    // Don't force-redirect if the user is browsing as a guest
                    const isGuestSession = sessionStorage.getItem('isGuest') === 'true';
                    if (!isGuestSession && !originalConfig.url.startsWith("/auth/")) {
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