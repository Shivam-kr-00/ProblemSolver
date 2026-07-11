import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserCircle2, X, ArrowRight, Sparkles } from "lucide-react";

const GuestBanner = ({ isVisible, onDismiss }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="guest-banner"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 sm:px-8 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 shadow-lg shadow-emerald-900/40"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Left: Icon + text */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5 text-white flex-shrink-0" />
            </motion.div>
            <div className="flex items-center gap-2 flex-wrap">
              <UserCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
              <p className="text-white text-sm font-medium">
                You're browsing as a <span className="font-bold">Guest</span>
                <span className="hidden sm:inline text-white/80">
                  {" "}— Sign in to unlock all features, claim tasks, and collaborate.
                </span>
              </p>
            </div>
          </div>

          {/* Right: CTA buttons + dismiss */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-emerald-700 font-semibold rounded-lg text-sm hover:bg-emerald-50 transition-colors shadow"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-sm transition-colors border border-white/30"
            >
              Sign Up
            </motion.button>
            <button
              onClick={onDismiss}
              aria-label="Dismiss guest banner"
              className="ml-1 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuestBanner;

