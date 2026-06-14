import { useAuthStore } from "../store/useAuthStore";

/**
 * GuestRoute — A wrapper for routes that guests CAN view (read-only).
 * Unlike ProtectedRoute, this does NOT redirect guests away.
 * It simply passes isGuest down so child components can
 * conditionally disable write actions or show login prompts.
 */
const GuestRoute = ({ children }) => {
  const checkingAuth = useAuthStore((state) => state.checkingAuth);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Both guests and authenticated users can access this route
  return children;
};

export default GuestRoute;
