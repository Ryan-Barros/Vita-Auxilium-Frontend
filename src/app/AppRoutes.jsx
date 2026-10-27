import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEnvironmentStore } from "../stores/environmentStore";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import GoogleCompleteProfilePage from "../pages/GoogleCompleteProfilePage";
import OAuthCallbackPage from "../pages/OAuthCallbackPage";
import SidebarLayout from "../components/SidebarLayout";
import HomePage from "../pages/shared/HomePage";
import EnvironmentPage from "../pages/shared/EnvironmentPage";
import ActivitiesPage from "../pages/shared/ActivitiesPage";
import ReminderPager from "../pages/shared/ReminderPager";
import ProfileConfigPage from "../pages/shared/ProfileConfigPage";
import ConfigPage from "../pages/shared/ConfigPage";
import MonitoringPage from "../pages/Family/MonitoringPage";
import { useEffect } from "react";

function PrivateRoute({ children }) {
  const { user, status } = useAuthStore();

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-semibold text-lg">
        Carregando Vita Auxilium...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" replace />;
  }

  if (user && (user.profilePending || user.needsProfile)) {
    return <Navigate to="/auth/google-setup" replace />;
  }

  return children;
}

function EnvironmentRoute({ children }) {
  const { currentEnvironment } = useEnvironmentStore();

  if (!currentEnvironment) {
    return <Navigate to="/environments" replace />;
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
      <Route path="/auth/google-setup" element={<GoogleCompleteProfilePage />} />
      <Route path="/auth/complete-profile" element={<GoogleCompleteProfilePage />} />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      <Route
        element={
          <PrivateRoute>
            <SidebarLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/monitoring"
          element={
            <EnvironmentRoute>
              <MonitoringPage />
            </EnvironmentRoute>
          }
        />
        <Route path="/environments" element={<EnvironmentPage />} />
        <Route
          path="/activities"
          element={
            <EnvironmentRoute>
              <ActivitiesPage />
            </EnvironmentRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <EnvironmentRoute>
              <ReminderPager />
            </EnvironmentRoute>
          }
        />
        <Route path="/configuration" element={<ConfigPage />} />
        <Route path="/profile" element={<ProfileConfigPage />} />
      </Route>
    </Routes>
  );
}
