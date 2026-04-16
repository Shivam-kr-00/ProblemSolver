import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Singleton socket — connects only after user logs in (autoConnect: false)
export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
});

