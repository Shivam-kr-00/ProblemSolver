import { motion } from "framer-motion";

const Loader = ({ size = "md", variant = "spinner", fullScreen = false }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinnerVariants = {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, easing: "linear" },
  };

  const pulseVariants = {
    animate: { opacity: [0.3, 1, 0.3] },
    transition: { duration: 1.5, repeat: Infinity },
  };

  const dotsVariants = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity },
  };

  if (variant === "spinner") {
    return (
      <motion.div
        animate={spinnerVariants.animate}
        transition={spinnerVariants.transition}
        className={`border-4 border-emerald-500/30 border-t-emerald-500 rounded-full ${sizeClasses[size]}`}
      />
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        animate={pulseVariants.animate}
        transition={pulseVariants.transition}
        className={`bg-emerald-500 rounded-full ${sizeClasses[size]}`}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className="flex gap-2 items-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={dotsVariants.animate}
            transition={{
              ...dotsVariants.transition,
              delay: i * 0.1,
            }}
            className="w-2 h-2 bg-emerald-500 rounded-full"
          />
        ))}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className="flex gap-1 items-center">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className={`w-1 bg-emerald-500 rounded-full ${
              i === 0 || i === 3 ? "h-4" : "h-6"
            }`}
          />
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "h-screen" : ""}`}
    >
      <motion.div
        animate={spinnerVariants.animate}
        transition={spinnerVariants.transition}
        className={`border-4 border-emerald-500/30 border-t-emerald-500 rounded-full ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Loader;
