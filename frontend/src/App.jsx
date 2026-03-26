import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore.js";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
