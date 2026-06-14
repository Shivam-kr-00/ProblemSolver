import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const { login, verifyLoginOtp, loading, user, enterAsGuest } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Show error toast when redirected back from failed OAuth
  useEffect(() => {
    const error = searchParams.get("error");
    const reason = searchParams.get("reason");
    if (error === "google_auth_failed") {
      toast.error("Google login failed. Please try again.");
    } else if (error === "github_auth_failed") {
      toast.error("GitHub login failed. Please try again.");
    } else if (reason === "guest") {
      toast("Please sign in to access this feature.", {
        icon: "🔒",
        style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" },
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const success = await login(formData);
      if (success) {
        setStep(2);
      }
    } else {
      if (!otp || otp.length < 6) {
        setErrors({ otp: "Please enter a valid 6-digit OTP" });
        return;
      }
      const success = await verifyLoginOtp({ email: formData.email, otp });
      if (success) {
        navigate("/");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex overflow-hidden">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-emerald-200 text-lg">
              Sign in to access your account
            </p>
          </motion.div>

          {/* Guest Access Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              enterAsGuest();
              navigate("/");
            }}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Enter as Guest
          </motion.button>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            {step === 1 ? (
              <>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-emerald-100 mb-3"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-emerald-100 mb-3"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded bg-white/10 border border-emerald-400/30 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 cursor-pointer"
                    />
                    <span className="ml-2 text-emerald-100 group-hover:text-emerald-50 transition">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-semibold text-emerald-100 mb-3"
                >
                  Enter 6-digit OTP
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition" />
                  <input
                    id="otp"
                    type="text"
                    maxLength="6"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp) setErrors({ ...errors, otp: "" });
                    }}
                    className="w-full pl-12 pr-4 py-3 tracking-[0.5em] text-center bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                  />
                </div>
                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-center text-sm mt-2"
                  >
                    {errors.otp}
                  </motion.p>
                )}
                <p className="text-emerald-200 text-xs text-center mt-4">
                  We've sent a verification code to
                  <br />
                  <span className="font-semibold text-emerald-400">
                    {formData.email}
                  </span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {step === 1 ? "Signing In..." : "Verifying..."}
                </>
              ) : (
                <>
                  {step === 1 ? "Sign In" : "Verify OTP"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-emerald-100"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition inline-flex items-center gap-1"
            >
              Sign up here
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-emerald-500/30"></div>
            <span className="text-emerald-300 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-emerald-500/30"></div>
          </motion.div>

          {/* Google Login Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Prevent duplicate /api/api if VITE_API_URL already has /api at the end
              const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const apiBase = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
              window.location.href = `${apiBase}/auth/google`;
            }}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.91 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Login with Google
          </motion.button>

          {/* GitHub Login Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Prevent duplicate /api/api if VITE_API_URL already has /api at the end
              const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const apiBase = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
              window.location.href = `${apiBase}/auth/github`;
            }}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Login with GitHub
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Side - Image/Branding */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000" />
        </div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 text-center px-8"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <div className="text-5xl">⚡</div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">problem solver</h2>
          <p className="text-emerald-100 text-lg max-w-sm">
            The collaborative ecosystem where developers solve real-world
            software problems.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
