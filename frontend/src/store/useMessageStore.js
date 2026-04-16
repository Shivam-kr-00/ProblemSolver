import { create } from "zustand";
import { socket } from "../lib/socket.js";
import { getMessage } from "../api/message.api.js";
import { toast } from "react-hot-toast";




export const useMessageStore = create((set, get) => ({

    // initialize initial state
    messages: [],
    isLoading: false,

    // here join room function 
    joinRoom: async (problemId) => {
        set({ isLoading: true });

        try {
            // 1. Fetch message history from REST API
            const res = await getMessage(problemId);
            set({ messages: res.data.data || [], isLoading: false });
        } catch (error) {
            toast.error("Failed to load messages");
            set({ isLoading: false });
        }

        // 2. Join the socket room for this problem
        socket.emit("joinRoom", problemId);

        // 3. Remove any stale listener first to prevent duplicates (React StrictMode
        //    or re-renders can call joinRoom multiple times)
        socket.off("receiveMessage");

        // 4. Listen for new incoming messages
        socket.on("receiveMessage", (newMessage) => {
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },

    // Called when user leaves the problem page (cleanup)
    leaveRoom: () => {
        socket.off("receiveMessage");
        set({ messages: [] });
    },

    // Called when user hits Send
    sendMessage: ({ problemId, senderId, text }) => {
        socket.emit("sendMessage", { problemId, senderId, text });
    },
}));
