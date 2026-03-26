import { motion } from "framer-motion";

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 animate-pulse"
        >
          <div className="h-6 bg-white/10 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
          </div>
        </motion.div>
      ))}
    </>
  );
};

export const ListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
            <div className="h-6 bg-white/10 rounded w-20" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const StatCardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-lg p-4 animate-pulse"
        >
          <div className="w-10 h-10 bg-white/10 rounded-lg mb-3" />
          <div className="h-3 bg-white/10 rounded mb-2 w-2/3" />
          <div className="h-6 bg-white/10 rounded w-1/2" />
        </motion.div>
      ))}
    </>
  );
};
