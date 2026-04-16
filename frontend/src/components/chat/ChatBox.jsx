import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../../store/useMessageStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Avatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-600 text-slate-200 flex items-center justify-center text-xs font-bold">
      {initials}
    </div>
  );
};

const ChatBox = ({ problemId }) => {
  const { user } = useAuthStore();
  const { messages, isLoading, joinRoom, leaveRoom, sendMessage } = useMessageStore();

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (problemId) joinRoom(problemId);
    return () => leaveRoom();
  }, [problemId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage({ problemId, senderId: user?._id, text: trimmed });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-md">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-900/60 border-b border-slate-700/50">
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <h2 className="text-white font-bold text-[15px] tracking-wide">Problem Chat</h2>

      </div>

      {/* ── Messages area ── */}
      <div className="h-80 overflow-y-auto flex flex-col gap-3 px-4 py-4 bg-slate-800/30 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <MessageSquare className="w-9 h-9 text-slate-600" />
            <p className="text-slate-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const senderId = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
              const isMe = senderId === user?._id;
              const senderName = typeof msg.senderId === "object" ? msg.senderId?.name : "User";

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {/* Sender name + avatar (others only) */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 ml-0.5">
                      <Avatar name={senderName} />
                      <span className="text-xs font-semibold text-emerald-400">{senderName}</span>
                    </div>
                  )}

                  {/* Bubble — asymmetric radius uses inline style */}
                  <div
                    className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed break-words ${
                      isMe
                        ? "bg-gradient-to-br from-emerald-600/80 to-slate-600/80 text-white"
                        : "bg-slate-700/70 text-slate-100 border border-slate-600/40"
                    }`}
                    style={{
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp */}
                  <span className={`text-[11px] text-slate-500 mt-1 ${isMe ? "mr-1" : "ml-1"}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 px-4 py-3 bg-slate-900/60 border-t border-slate-700/50"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-full px-5 py-2.5 text-sm outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br from-emerald-600/80 to-slate-600/80 hover:from-emerald-500 hover:to-slate-500 shadow-md"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;