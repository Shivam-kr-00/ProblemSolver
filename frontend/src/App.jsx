import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore.js";
import GuestBanner from "./components/GuestBanner.jsx";

function App() {
  const { checkAuth, isGuest } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <GuestBanner />
      {/* Offset page content so the fixed GuestBanner doesn't overlap the Navbar */}
      <div style={{ paddingTop: isGuest ? "46px" : "0px", transition: "padding-top 0.3s ease" }}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
