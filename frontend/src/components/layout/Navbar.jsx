import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { motion } from "framer-motion";
import { Menu, X, LogOut, Settings, Bell, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 border-b border-emerald-500/20 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 group hover:opacity-80 transition"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition">
            <span className="text-white font-bold text-lg">PF</span>
          </div>
          <span className="text-white font-bold text-xl hidden sm:inline">
            problem solver
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/admin"
                className={`text-sm font-semibold transition ${
                  isActive("/admin") && !isActive("/admin/")
                    ? "text-emerald-400"
                    : "text-emerald-100 hover:text-emerald-400"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/problems"
                className={`text-sm font-semibold transition ${
                  isActive("/admin/problems")
                    ? "text-emerald-400"
                    : "text-emerald-100 hover:text-emerald-400"
                }`}
              >
                Problems
              </Link>
              <Link
                to="/admin/tasks"
                className={`text-sm font-semibold transition ${
                  isActive("/admin/tasks")
                    ? "text-emerald-400"
                    : "text-emerald-100 hover:text-emerald-400"
                }`}
              >
                Tasks
              </Link>
              <Link
                to="/admin/users"
                className={`text-sm font-semibold transition ${
                  isActive("/admin/users")
                    ? "text-emerald-400"
                    : "text-emerald-100 hover:text-emerald-400"
                }`}
              >
                Users
              </Link>
            </>
          )}
          <Link
            to="/dashboard"
            className={`text-sm font-semibold transition ${
              isActive("/dashboard")
                ? "text-emerald-400"
                : "text-emerald-100 hover:text-emerald-400"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/problems"
            className={`text-sm font-semibold transition ${
              isActive("/problems")
                ? "text-emerald-400"
                : "text-emerald-100 hover:text-emerald-400"
            }`}
          >
            Problems
          </Link>
          <Link
            to="/leaderboard"
            className={`text-sm font-semibold transition ${
              isActive("/leaderboard")
                ? "text-emerald-400"
                : "text-emerald-100 hover:text-emerald-400"
            }`}
          >
            Leaderboard
          </Link>
          <Link
            to="/profile"
            className={`text-sm font-semibold transition ${
              isActive("/profile")
                ? "text-emerald-400"
                : "text-emerald-100 hover:text-emerald-400"
            }`}
          >
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex p-2 hover:bg-emerald-500/10 rounded-lg transition">
            <Bell className="w-5 h-5 text-emerald-300" />
          </button>
          <div className="relative group">
            <button className="p-2 hover:bg-emerald-500/10 rounded-lg transition">
              <User className="w-5 h-5 text-emerald-300" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-emerald-500/20 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <p className="px-4 py-2 text-xs text-emerald-200">
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 text-sm hover:bg-red-500/10 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-emerald-500/10 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-emerald-300" />
            ) : (
              <Menu className="w-5 h-5 text-emerald-300" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-emerald-500/20 bg-slate-900/50 backdrop-blur"
        >
          <div className="px-6 py-4 space-y-3">
            {user?.role === "ADMIN" && (
              <>
                <Link
                  to="/admin"
                  className="block text-emerald-100 hover:text-emerald-400 transition"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/problems"
                  className="block text-emerald-100 hover:text-emerald-400 transition"
                >
                  Manage Problems
                </Link>
                <Link
                  to="/admin/tasks"
                  className="block text-emerald-100 hover:text-emerald-400 transition"
                >
                  Manage Tasks
                </Link>
                <Link
                  to="/admin/users"
                  className="block text-emerald-100 hover:text-emerald-400 transition"
                >
                  Manage Users
                </Link>
              </>
            )}
            <Link
              to="/dashboard"
              className="block text-emerald-100 hover:text-emerald-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/problems"
              className="block text-emerald-100 hover:text-emerald-400 transition"
            >
              Problems
            </Link>
            <Link
              to="/profile"
              className="block text-emerald-100 hover:text-emerald-400 transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-400 hover:text-red-300 transition flex items-center gap-2 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
