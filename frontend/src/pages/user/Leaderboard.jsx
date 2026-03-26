import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar.jsx";
import { Trophy, Star, Target, Crown } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useUserStore } from "../../store/useUserStore.js";

const Leaderboard = () => {
  const { user } = useAuthStore();
  const { getLeaderboard, leaderboard, loading } = useUserStore();

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
            >
              <Trophy className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Global Leaderboard
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The top developers building, solving, and shaping the future of
              problem solver.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Leaderboard Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
                <div className="col-span-6 sm:col-span-5">Developer</div>
                <div className="col-span-4 sm:col-span-3 text-right">
                  Reputation
                </div>
                <div className="hidden sm:block sm:col-span-3 text-right">
                  Tasks Solved
                </div>
              </div>

              {/* Developer List */}
              {leaderboard.map((dev, index) => {
                const isTop3 = index < 3;
                const isCurrentUser = user?._id === dev._id;
                return (
                  <motion.div
                    key={dev._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-all duration-300 ${
                      isCurrentUser
                        ? "bg-emerald-900/40 border-emerald-500/50 shadow-md shadow-emerald-900/20"
                        : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-1 flex justify-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                            : index === 1
                              ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                              : index === 2
                                ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {index === 0 ? (
                          <Crown className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
                        {dev.profileImageUrl ? (
                          <img
                            src={dev.profileImageUrl}
                            alt={dev.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          dev.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100">
                          {dev.name}{" "}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                              You
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">Contributor</p>
                      </div>
                    </div>

                    {/* Reputation */}
                    <div className="col-span-4 sm:col-span-3 flex justify-end items-center gap-2">
                      <Star
                        className={`w-4 h-4 ${isTop3 ? "text-yellow-500" : "text-emerald-400"}`}
                      />
                      <span className="font-mono text-xl font-bold text-slate-100">
                        {dev.reputation?.toLocaleString()}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="hidden sm:flex sm:col-span-3 justify-end items-center gap-2">
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-lg font-bold text-slate-300">
                        {dev.totalContributions || 0}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
