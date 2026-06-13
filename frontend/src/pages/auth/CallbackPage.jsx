import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";
import apiClient from "../../api/axios";

const CallbackPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Small delay to ensure the browser has stored the Set-Cookie headers
      // from the backend redirect before we fire the profile request.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const maxAttempts = 3;
      let attempts = 0;

      while (attempts < maxAttempts) {
        try {
          const response = await apiClient.get("/auth/profile", {
            // Suppress the axios interceptor's automatic refresh-token attempt.
            // We're managing retries manually here; no point trying to refresh
            // a token that doesn't exist yet (OAuth cookies not set = no tokens at all).
            _skipAuthRetry: true,
          });

          const userData = response.data.data;

          setUser(userData);
          setLoading(false);
          console.log("OAuth callback successful:", userData);

          setTimeout(() => {
            navigate("/");
          }, 300);
          return; // success — exit loop
        } catch (err) {
          attempts++;
          console.warn(`OAuth profile fetch attempt ${attempts} failed:`, err?.response?.status);

          if (attempts >= maxAttempts) {
            // All retries exhausted
            console.error("OAuth callback error after retries:", err);
            setLoading(false);
            setError(err.response?.data?.message || "Failed to authenticate");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            // Wait 500ms before retrying
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser]);


  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Logging you in...</p>
          <p className="text-emerald-200 text-sm mt-2">
            Please wait while we verify your account
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-bold mb-2">
            Authentication Failed
          </h1>
          <p className="text-emerald-200 mb-6">{error}</p>
          <p className="text-emerald-200 text-sm">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default CallbackPage;
