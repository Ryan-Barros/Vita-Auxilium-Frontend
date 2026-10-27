import api from "./api";

export const environmentService = {
  async getEnvironments(params = {}) {
    const response = await api.get("/environment", { params });
    return Array.isArray(response.data)
      ? response.data
      : (response.data?.content ?? []);
  },

  async getEnvironmentById(id) {
    const response = await api.get(`/environment/${id}`);
    return response.data;
  },

  async createEnvironment(data) {
    const payload = typeof data === "string" ? { environmentName: data } : data;
    const response = await api.post("/environment", payload);
    return response.data;
  },

  async updateEnvironment(id, data) {
    const payload = typeof data === "string" ? { environmentName: data } : data;
    const response = await api.patch(`/environment/${id}`, payload);
    return response.data;
  },

  async deleteEnvironment(id) {
    await api.delete(`/environment/${id}`);
    return true;
  },

  async joinEnvironment(code) {
    const normalized = String(code || "").trim().toUpperCase();
    const response = await api.post("/environment/join", { code: normalized });
    return response.data;
  },

  async setActiveEnvironment(envId) {
    await api.patch(`/users/me/active-environment/${envId}`);
    return true;
  },
};

export default environmentService;
