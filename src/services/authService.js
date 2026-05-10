import api from "./api";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}
