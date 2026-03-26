import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const checkingAuth = useAuthStore((state) => state.checkingAuth);

  // While checking authentication (like on page refresh)
  if (checkingAuth) {
    return <div>Loading...</div>; 
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, allow access
  return children;
};

export default ProtectedRoute;