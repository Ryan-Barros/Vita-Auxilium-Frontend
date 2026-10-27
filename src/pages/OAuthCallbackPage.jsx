import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function OAuthCallbackPage() {
  const { user, status, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (status === "authenticated") {
      if (user?.profilePending || user?.needsProfile) {
        navigate("/auth/google-setup", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } else if (status === "unauthenticated") {
      navigate("/auth/login", { replace: true });
    }
  }, [status, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-[#191c1b] text-on-surface dark:text-[#e1e3e0]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-lg">Autenticando no Vita Auxilium...</p>
      </div>
    </div>
  );
}
