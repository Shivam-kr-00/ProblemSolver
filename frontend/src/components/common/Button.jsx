import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const Button = ({
  children,
  variant = "primary", // primary, secondary, danger, ghost
  size = "md", // sm, md, lg
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  icon: Icon = null,
  ...props
}) => {
  const baseStyle =
    "font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded-lg";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 border border-emerald-400/20",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 disabled:opacity-50",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 disabled:opacity-50",
    ghost:
      "bg-transparent hover:bg-slate-800/50 text-slate-200 border border-transparent hover:border-slate-700 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { y: 0 } : {}}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
