import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useAuthStore();

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-emerald-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
