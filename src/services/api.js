import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    if (error.response?.status === 401 && !url.startsWith("/auth/")) {
      import("../stores/authStore").then(({ useAuthStore }) => {
        useAuthStore.setState({ user: null, status: "unauthenticated" });
      });
    }
    return Promise.reject(error);
  },
);

export default api;
