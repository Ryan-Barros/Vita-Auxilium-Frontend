import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// Rotas públicas que não recarregam
const publicRoutes = ["/auth/login", "/auth/register"]; 

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Verifica se o token expirou e redireciona para login se necessário
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicRoute = publicRoutes.some((route) =>
      error.config.url.includes(route),
    );
    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default api;
