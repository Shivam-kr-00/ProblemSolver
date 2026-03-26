import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader, Check } from "lucide-react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { signup, loading, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    signup(formData);
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

  const passwordStrength = {
    weak: formData.password.length < 6,
    medium: formData.password.length >= 6 && formData.password.length < 10,
    strong: formData.password.length >= 10,
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
              Join the Network
            </h1>
            <p className="text-emerald-200 text-lg">
              Start building, collaborating, and solving today.
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-emerald-100 mb-3"
              >
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex gap-1 h-1">
                    <div
                      className={`flex-1 rounded-full transition ${
                        formData.password ? "bg-red-500" : "bg-emerald-500/30"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition ${
                        passwordStrength.medium
                          ? "bg-yellow-500"
                          : "bg-emerald-500/30"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition ${
                        passwordStrength.strong
                          ? "bg-emerald-500"
                          : "bg-emerald-500/30"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-emerald-300">
                    {passwordStrength.weak
                      ? "Weak password"
                      : passwordStrength.medium
                        ? "Medium strength"
                        : "Strong password"}
                  </p>
                </motion.div>
              )}

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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-emerald-100 mb-3"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5 group-focus-within:text-emerald-300 transition" />
                {formData.confirmPassword === formData.password &&
                  formData.password && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  )}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition duration-300"
                />
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-white/10 border border-emerald-400/30 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 cursor-pointer mt-1"
              />
              <span className="ml-3 text-sm text-emerald-100 group-hover:text-emerald-50 transition">
                I agree to the{" "}
                <a href="#" className="text-emerald-400 hover:text-emerald-300">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-400 hover:text-emerald-300">
                  Privacy Policy
                </a>
              </span>
            </label>

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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Login Link */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-emerald-100"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition inline-flex items-center gap-1"
            >
              Sign in here
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Image/Branding */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000" />
        </div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 text-center px-8"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl"
            >
              <div className="text-5xl">💻</div>
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Build Your Portfolio
          </h2>
          <p className="text-emerald-100 text-lg max-w-sm mx-auto">
            Solve problems, collaborate on tasks, and grow your developer reputation globally.
          </p>

          {/* Feature List */}
          <motion.div className="mt-10 space-y-3">
            {[
              "Real-world software challenges",
              "Structured task-based collaboration",
              "Earn reputation and climb the leaderboard",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 justify-center text-emerald-100"
              >
                <div className="w-2 h-2 bg-emerald-300 rounded-full" />
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
