import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore.js";
import GuestBanner from "./components/GuestBanner.jsx";

function App() {
  const { checkAuth, isGuest } = useAuthStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Reset bannerDismissed when isGuest changes to false
  useEffect(() => {
    if (!isGuest) {
      setBannerDismissed(false);
    }
  }, [isGuest]);

  const isBannerVisible = isGuest && !bannerDismissed;

  return (
    <>
      <GuestBanner isVisible={isBannerVisible} onDismiss={() => setBannerDismissed(true)} />
      {/* Offset page content so the fixed GuestBanner doesn't overlap the Navbar */}
      <div style={{ paddingTop: isBannerVisible ? "46px" : "0px", transition: "padding-top 0.3s ease" }}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;

