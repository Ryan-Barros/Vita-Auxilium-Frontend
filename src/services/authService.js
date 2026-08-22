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
