import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/auth/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* rotas protegidas */}
      {/* <Route path="/caminho" element={<PrivateRoute><Page /></PrivateRoute>} /> */}
    </Routes>
  );
}