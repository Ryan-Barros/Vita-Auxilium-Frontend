import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SidebarLayout from "../components/SidebarLayout";
import HomePage from "../pages/shared/HomePage";
import EnvironmentPage from "../pages/shared/EnvironmentPage";
import ElderlyEnvironmentPage from "../pages/Elderly/ElderlyEnvironmentPage";
import CaregiverEnvironmentPage from "../pages/Caregiver/CaregiverEnvironmentPage";
import FamilyEnvironmentsPage from "../pages/Family/FamilyEnvironmentsPage";
import { useEffect } from "react";

function PrivateRoute({ children }) {
  const { status } = useAuthStore();

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-semibold text-lg">
        Carregando Vita Auxilium...
      </div>
    );
  }

  return children;
}

export default function AppRoutes() {
  const checkAuth = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      <Route
        element={
          <PrivateRoute>
            <SidebarLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/environments" element={<EnvironmentPage />} />
        {/* <Route path="/environment/elderly" element={<ElderlyEnvironmentPage />} />
        <Route path="/environment/caregiver" element={<CaregiverEnvironmentPage />} />
        <Route path="/environment/family" element={<FamilyEnvironmentsPage />} /> */}
      </Route>
    </Routes>
  );
}
