import api from "./api";

export async function login(email, password) {
  return await api.post("/auth/login", { email, password });
}

export async function register(data) {
  return await api.post("/auth/register", data);
}

export async function getMe() {
  return await api.get("/auth/me");
}

export function loginWithGoogle() {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  window.location.href = `${baseUrl}/oauth2/authorization/google`;
}

export async function completeGoogleRegistration(data) {
  return await api.post("/auth/complete-registration", data);
}

