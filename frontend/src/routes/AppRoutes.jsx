import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import AdminRoute from "../components/layout/AdminRoute.jsx";

import LoginPage from "../features/auth/Login.jsx";
import SignupPage from "../features/auth/Register.jsx";
import HomePage from "../pages/HomePage.jsx";

import Dashboard from "../pages/user/Dashboard.jsx";
import ProblemsList from "../pages/user/ProblemsList.jsx";
import ProblemDetails from "../pages/user/ProblemDetails.jsx";
import CreateProblem from "../pages/user/CreateProblem.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import MyTasks from "../pages/user/MyTasks.jsx";
import Leaderboard from "../pages/user/Leaderboard.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";
import ManageProblems from "../pages/admin/ManageProblems.jsx";
import ManageTasks from "../pages/admin/ManageTasks.jsx";
import EditProblem from "../pages/admin/EditProblem.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Home Page */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <ProblemsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems/:problemId"
        element={
          <ProtectedRoute>
            <ProblemDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-problem"
        element={
          <ProtectedRoute>
            <CreateProblem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/problems"
        element={
          <AdminRoute>
            <ManageProblems />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/problems/:problemId/edit"
        element={
          <AdminRoute>
            <EditProblem />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tasks"
        element={
          <AdminRoute>
            <ManageTasks />
          </AdminRoute>
        }
      />

      {/* Default Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
