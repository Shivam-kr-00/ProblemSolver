import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const checkingAuth = useAuthStore((state) => state.checkingAuth);

  // While checking authentication (like on page refresh)
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

  // Guests trying to access a fully protected route → redirect with reason
  if (isGuest && !user) {
    return <Navigate to="/login?reason=guest" replace />;
  }

  // If no user at all, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated user — allow access
  return children;
};

export default ProtectedRoute;